import { asyncHandler } from "../utils/asyncHandler.js"
import { uploadOnCloudinary, deleteFromCloudinary, compressImageCloudinary } from "../utils/cloudinary.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js"
import { Video } from "../models/video.model.js"
import { Comment } from "../models/comment.model.js";
import mongoose from "mongoose";

const checkHealth = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(
      new ApiResponse(200, {}, "working fine as wine")
    )
})

const deleteResource = asyncHandler(async (req, res) => {
  const { url, resourceType } = req.body;

  if (!url || !resourceType) {
    throw new ApiError(500, "url and resourceType: (Must be one of: image, javascript, css, video, raw) is required")
  }

  const response = await deleteFromCloudinary(url, resourceType)

  if (!response) {
    throw new ApiError(500, "Error while deleting resouce from cloudinary")
  }

  return res
    .status(200).json(
      new ApiResponse(200, response, "resource deleted successfully")
    )
})

// cloudinary compress method doesnt work as intended
const compressImage = asyncHandler(async (req, res) => {
  const localFilePath = req?.file?.path

  if (!localFilePath) {
    throw new ApiError(400, "image is required")
  }

  const compressedImage = await compressImageCloudinary(localFilePath)

  return res
    .status(200)
    .json(
      new ApiResponse(200, compressedImage, "image compressed successfully")
    )
})

const getAllComments = asyncHandler(async (req, res) => {
  // get all comments in database
  const { page = 1, limit = 10, sortBy = "likes", sortType = "desc" } = req.query

  // valid sortBy values: duration, views, publishDate(createdAt)
  if (sortBy) {
    if (!["likes", "date"].some((value) => value === sortBy)) {
      throw new ApiError(400, "Invalid sortBy")
    }
  }

  if (sortType != "desc" && sortType != "asc") {
    throw new ApiError(400, "Invalid sortType")
  }

  if (Number(page) != parseInt(page) || Number(limit) != parseInt(limit)) {
    throw new ApiError(400, "Invalid page or limit")
  }

  const buildSortStage = (sortBy, sortType) => {
    if (sortBy === "likes") sortBy = "likeCount"
    if (sortBy === "date") sortBy = "updatedAt"

    if (!sortBy) sortBy = undefined

    const sortStage = {}
    if (sortType === "asc") sortStage[sortBy] = 1
    if (sortType === "desc") sortStage[sortBy] = -1

    return { $sort: sortStage }
  }
  const sortStage = buildSortStage(sortBy, sortType);

  const comments = await Comment.aggregate([
    {
      $lookup: {
        from: "likes",
        localField: "_id",
        foreignField: "comment",
        as: "likes",
        pipeline: [
          {
            $project: {
              _id: 1
            }
          }
        ]
      }
    },
    {
      $addFields: {
        likeCount: {
          $size: "$likes"
        }
      }
    },
    sortStage,
    {
      $skip: Number((page - 1) * limit)
    },
    {
      $limit: Number(limit)
    },
    {
      $lookup: {
        from: "users",
        localField: "owner",
        foreignField: "_id",
        as: "owner",
        pipeline: [
          {
            $project: {
              _id: 0,
              fullName: 1,
              username: 1,
              avatar: 1
            }
          }
        ]
      }
    },
    {
      $addFields: {
        owner: {
          $first: "$owner"
        },
      }
    },
    {
      $project: {
        content: 1,
        likeCount: 1,
        owner: 1,
        createdAt: 1,
        updatedAt: 1
      }
    }
  ])

  if (!comments) {
    throw new ApiError(500, "Something went wrong while fetching comments")
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, comments, "comments fetched successfully")
    )
})




export { checkHealth, deleteResource, compressImage, getAllComments }
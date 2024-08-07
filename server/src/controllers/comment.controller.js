import mongoose from "mongoose"
import { Comment } from "../models/comment.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { Video } from "../models/video.model.js"

const getVideoComments = asyncHandler(async (req, res) => {
  //TODO: get all comments for a video
  const { videoId } = req.params
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

  if (!mongoose.Types.ObjectId.isValid(videoId)) {
    throw new ApiError(400, "Invalid videoId")
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
      $match: {
        video: new mongoose.Types.ObjectId(String(videoId))
      }
    },
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

const addComment = asyncHandler(async (req, res) => {
  // TODO: add a comment to a video
  const { videoId } = req?.params
  const { content } = req?.body

  if (!videoId?.trim()) {
    throw new ApiError(400, "videoId required")
  }

  if (!content?.trim()) {
    throw new ApiError(400, "comment content required")
  }

  if (!mongoose.Types.ObjectId.isValid(videoId)) {
    throw new ApiError(400, "Invalid videoId")
  }

  const video = await Video.findById(videoId)

  if (!video) {
    throw new ApiError(400, "Invalid videoId")
  }

  const comment = await Comment.create(
    {
      content: content,
      video: videoId,
      owner: req?.user?._id
    }
  )
  if (!comment) {
    throw new ApiError(500, "something went wrong while creating comment")
  }

  return res
    .status(201)
    .json(
      new ApiResponse(201, comment, "Comment created successfully")
    )
})

const updateComment = asyncHandler(async (req, res) => {
  // TODO: update a comment
  const { commentId } = req?.params
  const { content } = req?.body

  if (!commentId?.trim()) {
    throw new ApiError(400, "commentId required")
  }

  if (!content?.trim()) {
    throw new ApiError(400, "comment content required")
  }

  if (!mongoose.Types.ObjectId.isValid(commentId)) {
    throw new ApiError(400, "Invalid commentId")
  }

  const comment = await Comment.findByIdAndUpdate(
    commentId,
    { content: content },
    { new: true })

  if (!comment) {
    throw new ApiError(400, "Invalid commentId")
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, comment, "Comment updated successfully")
    )
})

const deleteComment = asyncHandler(async (req, res) => {
  // TODO: delete a comment
  const { commentId } = req?.params

  if (!commentId?.trim()) {
    throw new ApiError(400, "CommentId required")
  }

  if (!mongoose.Types.ObjectId.isValid(commentId)) {
    throw new ApiError(400, "Invalid commentId")
  }

  const comment = await Comment.findByIdAndDelete(commentId)

  if (!comment) {
    throw new ApiError(400, "Invalid commentId")
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, comment, "comment deleted successfully")
    )

})

export {
  getVideoComments,
  addComment,
  updateComment,
  deleteComment
}
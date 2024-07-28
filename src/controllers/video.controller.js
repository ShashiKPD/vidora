import { asyncHandler } from "../utils/asyncHandler.js"
import { uploadOnCloudinary, deleteFromCloudinary } from "../utils/cloudinary.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js"
import { Video } from "../models/video.model.js"
import fs from "fs"
import { cloudinaryFileTypes } from "../constants.js"
import mongoose from "mongoose";

//  NOT COMPLETE !! {handle showing only published videos}, {return owner details instead of ownerId}
const getAllVideos = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, query, sortBy, sortType = "desc", userId } = req.query

  // valid sortBy values: duration, views, publishDate(createdAt)
  if (sortBy) {
    if (!["duration", "views", "uploadDate"].some((value) => value === sortBy)) {
      throw new ApiError(400, "Invalid sortBy")
    }
  }

  if (sortType != "desc" && sortType != "asc") {
    throw new ApiError(400, "Invalid sortType")
  }

  if (Number(page) != parseInt(page) || Number(limit) != parseInt(limit)) {
    throw new ApiError(400, "Invalid page or limit")
  }

  const buildSearchStage = (query) => {
    if (!query) {
      return null
    }
    return {
      $search: {
        index: "videos",  // index created in mongodb atlas named "videos"
        text: {
          query: query,
          path: ["title", "description"]
        }
      }
    }
  }

  const buildSortStage = (sortBy, sortType) => {
    const sortStage = {}
    if (sortType === "asc") sortStage[sortBy] = 1
    if (sortType === "desc") sortStage[sortBy] = -1
    return { $sort: sortStage }
  }

  const searchStage = buildSearchStage(query)
  const sortStage = buildSortStage(sortBy, sortType)
  const skipStage = { $skip: Number((page - 1) * limit) }
  const limitStage = { $limit: Number(limit) }
  console.log(sortStage)
  const pipeline = []

  if (query) pipeline.push(searchStage)
  pipeline.push(sortStage, skipStage, limitStage)

  const videos = await Video.aggregate(pipeline)

  return res
    .status(200)
    .json(
      new ApiResponse(200, videos, "Succesfully fetched videos")
    )
})

const publishAVideo = asyncHandler(async (req, res) => {
  const { title, description } = req.body

  if (!title?.trim()) {
    throw new ApiError(400, "Video title is required")
  }

  const videoLocalPath = req?.files?.videoFile?.[0].path
  const thumbnailLocalPath = req?.files?.thumbnail?.[0].path

  if (!thumbnailLocalPath) {
    throw new ApiError(500, "Failed to get the local thumbnail path")
  }
  if (!videoLocalPath) {
    throw new ApiError(500, "Failed to get the local video path")
  }

  const videoFile = await uploadOnCloudinary(videoLocalPath)

  if (!videoFile?.url) {
    fs.unlinkSync(thumbnailLocalPath)
    throw new ApiError(500, "Error while uploading video file to cloudinary", videoFile)
  }

  const thumbnail = await uploadOnCloudinary(thumbnailLocalPath)

  if (!thumbnail?.url) {
    const response = await deleteFromCloudinary(videoFile.url, cloudinaryFileTypes.VIDEO)
    throw new ApiError(500, "Error while uploading video thumbnail to cloudinary", [response])
  }

  const video = await Video.create(
    {
      title,
      description: description ? description : "",
      videoFile: videoFile.url,
      thumbnail: thumbnail.url,
      duration: videoFile?.duration || 0,
      isPublished: true,
      owner: req?.user?._id
    }
  )

  return res
    .status(201)
    .json(
      new ApiResponse(201, video, "Video uploaded Successfully")
    )

})

const getVideoById = asyncHandler(async (req, res) => {
  const { videoId } = req.params

  if (!mongoose.Types.ObjectId.isValid(videoId)) {
    throw new ApiError(400, "invalid videoId")
  }

  const video = await Video.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(String(videoId))
      }
    },
    {
      $lookup: {
        from: "likes",
        localField: "_id",
        foreignField: "video",
        as: "likes"
      }
    },
    {
      $addFields: {
        likeCount: {
          $size: "$likes"
        }
      }
    },
    {
      $project: {
        _id: 1,
        title: 1,
        description: 1,
        videoFile: 1,
        thumbnail: 1,
        duration: 1,
        views: 1,
        likeCount: 1,
        isPublished: 1,
        owner: 1,
        createdAt: 1,
        updatedAt: 1
      }
    }
  ])

  if (!video?.length) {
    throw new ApiError(400, "invalid videoId: video not found")
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, video?.[0], "video details fetched successfully")
    )
})

const updateVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params
  //TODO: update video details like title, description, thumbnail

  if (!mongoose.Types.ObjectId.isValid(videoId)) {
    throw new ApiError(400, "invalid videoId")
  }

  const { title, description } = req.body
  const thumbnailLocalPath = req?.file?.path

  if (!title?.trim() && !description?.trim() && !thumbnailLocalPath) {
    throw new ApiError(400, "update fields required")
  }

  const video = await Video.findById(videoId)
  if (!video) {
    throw new ApiError(400, "Invalid videoId")
  }

  let thumbnail = undefined
  if (thumbnailLocalPath) {
    thumbnail = await uploadOnCloudinary(thumbnailLocalPath)

    if (!thumbnail?.url) {
      throw new ApiError(500, "Error while uploading video thumbnail to cloudinary", [response])
    }

    if (video?.thumbnail) {
      await deleteFromCloudinary(video.thumbnail, cloudinaryFileTypes.IMAGE)
    }
  }

  const updatedVideo = await Video.findByIdAndUpdate(
    videoId,
    {
      $set: {
        title: title,
        description: description,
        thumbnail: thumbnail?.url
      }
    },
    {
      new: true
    }
  )
  if (!updatedVideo) {
    throw new ApiError(500, "error occured while updating video")
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, updatedVideo, "video details updated successfully")
    )

})

// TODO: delete comments and likes of this video
const deleteVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params

  const video = await Video.findById(videoId)
  if (!video) {
    throw new ApiError(400, "video not found")
  }
  if (video?.thumbnail) {
    await deleteFromCloudinary(video.thumbnail, cloudinaryFileTypes.IMAGE)
  }
  if (video?.videoFile) {
    await deleteFromCloudinary(video.videoFile, cloudinaryFileTypes.VIDEO)
  }

  const deletedVideo = await Video.findByIdAndDelete(videoId)

  if (!deletedVideo) {
    throw new ApiError(500, "Error while deleting user from database")
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, deletedVideo, "Deleted video successfully")
    )

})

const togglePublishStatus = asyncHandler(async (req, res) => {
  const { videoId } = req.params

  if (!mongoose.Types.ObjectId.isValid(videoId)) {
    throw new ApiError(400, "invalid videoId")
  }

  const video = await Video.findById(videoId)

  if (!video) {
    throw new ApiError(400, "invalid videoId: video not found")
  }

  video.isPublished = !video.isPublished

  video.save({ validateBeforeSave: false })

  return res
    .status(200)
    .json(
      new ApiResponse(200, video, `successfully toggeled isPublished`)
    )
})

export {
  getAllVideos,
  publishAVideo,
  getVideoById,
  updateVideo,
  deleteVideo,
  togglePublishStatus
}
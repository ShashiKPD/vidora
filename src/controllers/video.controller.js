import { asyncHandler } from "../utils/asyncHandler.js"
import { uploadOnCloudinary, deleteFromCloudinary } from "../utils/cloudinary.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js"
import { Video } from "../models/video.model.js"
import { cloudinaryFileTypes } from "../constants.js"

// not completed
const getAllVideos = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query

  const videos = await Video.find({})

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


export { getAllVideos, publishAVideo }
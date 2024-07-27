import { asyncHandler } from "../utils/asyncHandler.js"
import { uploadOnCloudinary, deleteFromCloudinary } from "../utils/cloudinary.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js"
import { Video } from "../models/video.model.js"

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

export { checkHealth, deleteResource }
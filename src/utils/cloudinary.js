import { v2 as cloudinary } from "cloudinary";
import fs from "fs"
import { ApiError } from "./ApiError.js";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Written by me (It works but ChatGPT suggested i use its function to handle edge cases)
// https://res.cloudinary.com/<cloud_name>/image/upload/v<version>/<public_id>.<format>

function extractPublicIdFromCloudinaryUrl(url) {
  if (!url) return null;
  const urlParts = url.split('/')

  if (urlParts.length < 1) return null

  const lastPart = urlParts[urlParts.length - 1]
  const publicId = lastPart.split('.')?.[0]

  return publicId
}

// Written by ChatGPT
// Function to extract the public_id from a Cloudinary URL
const extractPublicIdFromUrl = (url) => {
  const urlParts = url.split('/');
  // Find the index of 'upload' and then get the next parts as public_id
  const uploadIndex = urlParts.indexOf('upload');
  if (uploadIndex !== -1) {
    const publicIdParts = urlParts.slice(uploadIndex + 1);
    // Remove version and file extension if present
    const lastPart = publicIdParts[publicIdParts.length - 1];
    const [publicIdWithoutExtension] = lastPart.split('.');
    return publicIdParts[publicIdParts.length - 1]
  }
  return null;
};

//This function uploads the file stored locally on the server to the cloudinary server
const uploadOnCloudinary = async (localFilePath) => {
  try {
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
      quality: "auto"
    })
    fs.unlinkSync(localFilePath)
    return response;
  } catch (error) {
    console.log("Failed to upload on cloudinary ", error.message)
    fs.unlinkSync(localFilePath) // remove the locally stored file as the upload operation failed miserably
    return null
  }
}

// This function deleted the file from the cloudinary server (accepts url)
const deleteFromCloudinary = async (url, resourceType = "image") => {
  let publicId = ""
  try {
    publicId = extractPublicIdFromCloudinaryUrl(url)
    const response = await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType
    })
    if (response?.result === "not found") {
      throw new ApiError(400, `${resourceType} resource not found`)
    }
    return response;
  } catch (error) {
    throw new ApiError(400, `Error occured while deleting file (publicId: ${publicId}) from cloudinary server: ${error.message}`)
  }
}

// not working as intended
const compressImageCloudinary = async (localFilePath) => {
  try {
    const response = await cloudinary.image(localFilePath, {
      transformation: [
        { width: 1000, crop: "scale" },
        { quality: 35 },
        { fetch_format: "auto" }
      ]
    })
    fs.unlinkSync(localFilePath)
    return response
  } catch (error) {
    fs.unlinkSync(localFilePath)
    throw new ApiError(500, "something went wrong while compressing image", error?.message)
  }
}


export { uploadOnCloudinary, deleteFromCloudinary, compressImageCloudinary }
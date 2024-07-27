import { v2 as cloudinary } from "cloudinary";
import fs from "fs"

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Written by me (It works but ChatGPT suggested i use its function to handle edge cases)
// https://res.cloudinary.com/<cloud_name>/image/upload/v<version>/<public_id>.<format>

// function extractPublicIdFromCloudinaryUrl(url) {
//   if (!url) return null;
//   const urlParts = url.split('/')

//   if (urlParts.length < 1) return null

//   const lastPart = urlParts[urlParts.length - 1]
//   const publicId = lastPart.split('.')?.[0]

//   return publicId
// }

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
    publicIdParts[publicIdParts.length - 1] = publicIdWithoutExtension;
    return publicIdParts.join('/');
  }
  return null;
};

//This function uploads the file stored locally on the server to the cloudinary server
const uploadOnCloudinary = async (localFilePath) => {
  try {
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto"
    })
    fs.unlinkSync(localFilePath)
    return response;
  } catch (error) {
    console.log("Failed to upload on cloudinary ", error)
    fs.unlinkSync(localFilePath) // remove the locally stored file as the upload operation failed miserably
    return null
  }
}

// This function deleted the file from the cloudinary server (accepts url)
const deleteFromCloudinary = async (url) => {
  try {
    const publicId = extractPublicIdFromUrl(url)
    const response = await cloudinary.uploader.destroy(publicId)
    return response;
  } catch (error) {
    console.log("Error occured while deleting file from cloudinary servers ", error.message)
    return null
  }
}

export { uploadOnCloudinary, deleteFromCloudinary }
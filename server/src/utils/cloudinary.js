import { v2 as cloudinary } from "cloudinary";
import fs from "fs"
import { ApiError } from "./ApiError.js";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true // Enforces HTTPS
});

const getFileSize = (localFilePath) => {
  var stats = fs.statSync(localFilePath)
  var fileSizeInBytes = stats.size;
  // Convert the file size to megabytes (optional)
  var fileSizeInMegabytes = fileSizeInBytes / (1024 * 1024);

  return fileSizeInMegabytes;

  // function getFilesizeInBytes(filename) {
  //   var stats = fs.statSync(filename);
  //   var fileSizeInBytes = stats.size;
  //   return fileSizeInBytes;
  // }
}

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
  // check for large files
  if (getFileSize(localFilePath) > 20) { // threshold = 20
    return await uploadLargeFileCloudinary(localFilePath)
  }

  try {
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
      // quality: "auto",
    })
    fs.unlinkSync(localFilePath)
    // console.log(response)
    return response;
  } catch (error) {
    console.log("Failed to upload on cloudinary ", error.message)
    fs.unlinkSync(localFilePath) // remove the locally stored file as the upload operation failed miserably
    return null
  }
}

// Upload large files
const uploadLargeFileCloudinary = async (localFilePath) => {
  // From documentation: 
  // Note There are multiple responses to a chunked upload: one after each chunk that only includes basic information plus the done : false parameter, and a full upload response that is returned after the final chunk is uploaded with done: true included in the response.
  const response = await new Promise((resolve, reject) => {
    cloudinary.uploader.upload_large(localFilePath, {
      resource_type: "auto"
    }, (error, result) => {
      if (error) {
        console.log("ERROR: ", error);
        return reject(error);
      }
      if (result) {
        // console.log("RESULT: ", result);
        return (resolve(result));
      }

    })
  })
  fs.unlinkSync(localFilePath);
  return response;
}

// This function deletes the file from the cloudinary server (accepts url)
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
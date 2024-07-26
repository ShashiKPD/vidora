import { v2 as cloudinary } from "cloudinary";
import fs from "fs"

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});


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

export { uploadOnCloudinary }
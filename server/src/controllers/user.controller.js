import { asyncHandler } from "../utils/asyncHandler.js"
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js"
import jwt from "jsonwebtoken"
import { v2 as cloudinary } from "cloudinary";
import mongoose from "mongoose";

const generateAccessAndRefreshTokens = async (userId) => {
  try {
    const user = await User.findById(userId)
    const accessToken = user.generateAccessToken()
    const refreshToken = user.generateRefreshToken()

    user.refreshToken = refreshToken
    await user.save({ validateBeforeSave: false })

    return { accessToken, refreshToken }

  } catch (error) {
    throw new ApiError(500, "Something went wrong while generating access and refresh tokens")
  }
}

// Function to extract the public_id from the URL
function extractPublicIdFromCloudinaryUrl(url) {
  try {
    const parts = url.split('/');
    const filename = parts.pop();
    const publicId = filename.split('.').slice(0, -1).join('.');
    return publicId;
  } catch (error) {
    throw new ApiError(500, "Error extracting PublicId from Cloudinary Url")
  }
}

const registerUser = asyncHandler(async (req, res) => {
  // receive the data from frontend
  // validate the fields (non empty)
  // check if a user with the same username or email already existe
  // extract localFilePath from multer
  // upload file to cloudinary and get file path\
  // create user object
  // remove password and refreshToken field from usr obj
  // create user in mongodb
  // send response to user

  const { username, email, fullName, password } = req.body

  if ([username, email, fullName, password].some((field) =>
    field?.trim() === "" || !field)) {
    throw new ApiError(400, "All fields are required.")
  }

  const userAlreadyExists = await User.findOne({
    $or: [{ username }, { email }]
  })

  if (userAlreadyExists) {
    throw new ApiError(400, "User with this username or email alredy exists")
  }

  const avatarLocalPath = req.files?.avatar?.[0]?.path
  const coverImageLocalPath = req.files?.coverImage?.[0]?.path

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar image is required")
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath)
  const coverImage = coverImageLocalPath ? await uploadOnCloudinary(coverImageLocalPath) : null;

  if (!avatar) {
    throw new ApiError(500, "Failed to upload avatar to cloudinary")
  }

  const user = await User.create({
    username: username.toLowerCase(),
    email: email.toLowerCase(),
    password,
    fullName,
    avatar: avatar.url,
    coverImage: coverImage?.url || ""
  })

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken -watchHistory"
  )

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering the user")
  }

  return res.status(201).json(
    new ApiResponse(200, createdUser, "User registered successfully")
  )

})

const loginUser = asyncHandler(async (req, res) => {

  // req.body -> user details
  // validate (not empty) and atleast one of email or password is available
  // check is username or email matches from database
  // match password
  // generate access and refresh token
  // respond embedded token with cookies

  const { email, password, username } = req.body

  if (!email?.trim() && !username?.trim()) {
    throw new ApiError(400, "username or email is required")
  }
  if (!password) {
    throw new ApiError(400, "password is required")
  }

  const user = await User.findOne({
    $or: [{ username }, { email }]
  })

  if (!user) {
    throw new ApiError(401, "User does not exist")
  }

  const isPasswordCorrect = await user.isPasswordCorrect(password)

  if (!isPasswordCorrect) {
    throw new ApiError(401, "Invalid user credentials")
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id)

  const loggedInUser = await User.findById(user._id).select("-password -refreshToken -watchHistory")

  const options = {
    httpOnly: true,
    secure: true
  }

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser, accessToken, refreshToken
        },
        "User logged in successfully"
      ))

})

const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(req.user._id,
    {
      $unset:
      {
        refreshToken: 1 // this removes the field from the document
      }
    },
    {
      new: true
    }
  )

  const options = {
    httpOnly: true,
    secure: true
  }

  return res
    .status(200)
    .clearCookie("refreshToken", options)
    .clearCookie("accessToken", options)
    .json(new ApiResponse(200, {}, "User logged out"))

})

const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken = req.cookies?.refreshToken || req.body?.refreshToken

  if (!incomingRefreshToken) {
    throw new ApiError(401, "Unauthorized request")
  }

  try {
    const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET)

    if (!decodedToken) {
      throw new ApiError(401, "The refresh token is invalid")
    }

    const user = await User.findById(decodedToken?._id)

    if (!user) {
      throw new ApiError(401, "Invalid refresh token")
    }

    if (incomingRefreshToken != user?.refreshToken) {
      throw new ApiError(401, "Refresh token is expired or used")
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id)

    const options = {
      httpOnly: true,
      secure: true
    }

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json(
        new ApiResponse(
          200,
          {
            accessToken,
            refreshToken
          },
          "Access token refreshed"
        ))
  } catch (error) {
    throw new ApiError(401, error?.message || "something happened while generating the new access token")
  }
})

const changeCurrentPassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body

  const user = req.user

  const isOldPasswordCorrect = await user.isPasswordCorrect(oldPassword)

  if (!isOldPasswordCorrect) {
    throw new ApiError(400, "Invalid old password")
  }

  user.password = newPassword
  await user.save({ validateBeforeSave: false })

  return res
    .status(200)
    .json(
      new ApiResponse(200, {}, "Password changed successfully")
    )

})

const getCurrentUser = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(
      new ApiResponse(200, req.user, "Current User Fetched Successfully")
    )
})

const updateAccountDetails = asyncHandler(async (req, res) => {

  const { fullName, email } = req.body

  if (!fullName?.trim() && !email?.trim()) {
    throw new ApiError(400, "No field Provided for updation. Fields supported: fullName, email")
  }

  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        fullName: fullName,
        email: email
      }
    },
    { new: true }
  ).select("-password -refreshToken -watchHistory")

  return res
    .status(200)
    .json(
      new ApiResponse(200, user, "Account details updated successfully")
    )
})

const updateUserAvatar = asyncHandler(async (req, res) => {
  const avatarLocalPath = req?.file?.path

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is missing")
  }

  const oldAvatarPublicId = extractPublicIdFromCloudinaryUrl(req?.user?.avatar)
  const isAvatarDeleted = await cloudinary.uploader.destroy(oldAvatarPublicId)

  if (!isAvatarDeleted) {
    throw new ApiError(500, "error while deleting old avatar from cloudinary")
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath)

  if (!avatar.url) {
    throw new ApiError(500, "Error while uploading avatar to cloudinary")
  }

  const user = await User.findByIdAndUpdate(
    req?.user?._id,
    {
      $set: {
        avatar: avatar.url
      }
    },
    {
      new: true
    }
  ).select("-password -refreshToken -watchHistory")


  return res
    .status(200)
    .json(
      new ApiResponse(200, user, "Avatar updated successfully")
    )

})

const updateUserCoverImage = asyncHandler(async (req, res) => {
  const coverImageLocalPath = req?.file?.path

  if (!coverImageLocalPath) {
    throw new ApiError(400, "Cover image file is missing")
  }

  const oldCoverImagePublicId = extractPublicIdFromCloudinaryUrl(req?.user?.coverImage)
  const iscoverImageDeleted = await cloudinary.uploader.destroy(oldCoverImagePublicId)

  if (!iscoverImageDeleted) {
    throw new ApiError(500, "error while deleting old cover image from cloudinary")
  }

  const coverImage = await uploadOnCloudinary(coverImageLocalPath)

  if (!coverImage.url) {
    throw new ApiError(400, "Error while uploading coverImage")
  }
  const user = await User.findByIdAndUpdate(
    req?.user?._id,
    {
      $set: {
        coverImage: coverImage.url
      }
    },
    {
      new: true
    }
  ).select("-password -refreshToken")

  return res
    .status(200)
    .json(
      new ApiResponse(200, user, "Cover image updated successfully")
    )

})

const getUserChannelProfile = asyncHandler(async (req, res) => {
  const { username } = req.params

  if (!username?.trim()) {
    throw new ApiError(400, "Channel username missing")
  }

  const channel = await User.aggregate([
    {
      $match: {
        username: username.toLowerCase()
      }
    },
    {
      $lookup: {
        from: "subscriptions",
        localField: "_id",
        foreignField: "channel",
        as: "subscribers"
      }
    },
    {
      $lookup: {
        from: "subscriptions",
        localField: "_id",
        foreignField: "subscriber",
        as: "subscribedTo"
      }
    },
    {
      $addFields: {
        subscribersCount: {
          $size: "$subscribers"
        },
        channelsSubscribedToCount: {
          $size: "$subscribedTo"
        },
        isUserSubscribed: {
          $cond: {
            if: { $in: [req.user?._id, "$subscribers.subscriber"] },
            then: true,
            else: false
          }
        }
      }
    },
    {
      $project: {
        username: 1,
        fullName: 1,
        avatar: 1,
        coverImage: 1,
        subscribersCount: 1,
        channelsSubscribedToCount: 1,
        isUserSubscribed: 1
      }
    }
  ])

  if (!channel?.length) {
    throw new ApiError(404, "Channel does not exist")
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, channel[0], "User Channel Profile fetched succesfully")
    )
})

const getWatchHistory = asyncHandler(async (req, res) => {

  const user = await User.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(String(req.user?._id))
      }
    },
    {
      $lookup: {
        from: "videos",
        localField: "watchHistory",
        foreignField: "_id",
        as: "watchHistory",
        pipeline: [
          {
            $lookup: {
              from: "users",
              localField: "owner",
              foreignField: "_id",
              as: "ownerDetails",
              pipeline: [
                {
                  $project: {
                    fullName: 1,
                    username: 1,
                    avatar: 1
                  }
                },
                {
                  $addFields: {
                    ownerDetails: {
                      $first: "$ownerDetails"
                    }
                  }
                }
              ]
            }
          },
          {
            $unwind: "$ownerDetails"
          }
        ]
      }
    },
    // {// try adding this field after the user has watched some videos (hitesh didnt add this) from this line
    //   $addFields: {
    //     watchHistory: "$watchHistory"
    //   }
    // }// to this line
  ])

  return res
    .status(200)
    .json(
      new ApiResponse(200, user[0].watchHistory, "Watch history fetched successfully")
    )
})

export {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  changeCurrentPassword,
  getCurrentUser,
  updateAccountDetails,
  updateUserAvatar,
  updateUserCoverImage,
  getUserChannelProfile,
  getWatchHistory
}
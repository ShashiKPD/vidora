import { asyncHandler } from "../utils/asyncHandler.js"
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js"

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
    field?.trim === "" || !field)) {
    throw new ApiError(400, "All fields are required.")
  }

  const userAlreadyExists = await User.findOne({
    $or: [{ username }, { email }]
  })

  if (userAlreadyExists) {
    throw new ApiError(401, "User with this username or email alredy exists")
  }

  const avatarLocalPath = req.files?.avatar?.[0]?.path
  const coverImageLocalPath = req.files?.coverImage?.[0]?.path

  if (!avatarLocalPath) {
    throw new ApiError(401, "Avatar image is required")
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath)
  const coverImage = coverImageLocalPath ? await uploadOnCloudinary(coverImageLocalPath) : null;

  if (!avatar) {
    throw new ApiError(500, "Failed to upload avatar to cloudinary")
  }

  const user = await User.create({
    username: username.toLowerCase(),
    email,
    password,
    fullName,
    avatar: avatar.url,
    coverImage: coverImage?.url || ""
  })

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
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

  if (!email?.trim && !username?.trim) {
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

  const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

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
      $set:
      {
        refreshToken: undefined
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

export { registerUser, loginUser, logoutUser }
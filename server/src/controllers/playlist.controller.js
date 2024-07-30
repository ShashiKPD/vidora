import mongoose, { isValidObjectId } from "mongoose"
import { Playlist } from "../models/playlist.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { Video } from "../models/video.model.js"

const createPlaylist = asyncHandler(async (req, res) => {
  const { name, description = "", privacyStatus = "public" } = req.body

  if (!name?.trim()) {
    throw new ApiError(400, "Playlist name is required")
  }

  if (privacyStatus != "public" && privacyStatus != "private") {
    throw new ApiError(400, "Invalid privacyStatus")
  }

  if (!req?.user?._id) {
    throw new ApiError(400, "User not logged in")
  }

  const playlist = await Playlist.create(
    {
      name: name,
      description: description,
      owner: req.user._id,
      privacyStatus: privacyStatus
    }
  )

  if (!playlist) {
    throw new ApiError(500, "Something went wrong while creating the playlist")
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, playlist, "Playlist created successfully")
    )
})

const getUserPlaylists = asyncHandler(async (req, res) => {
  const { userId } = req.params
  //TODO: get user playlists

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new ApiError(400, "Invalid userId")
  }
  // only playlist owner can see private playlists
  let privacyStatus = undefined;
  if (userId != req?.user._id) {
    privacyStatus = { privacyStatus: "public" }
  }

  const fieldsToMatch = {
    owner: new mongoose.Types.ObjectId(String(userId)),
    ...privacyStatus
  }

  const playlists = await Playlist.find(fieldsToMatch)

  if (!playlists) {
    throw new ApiError(500, "Something went wrong while fetching playlists")
  }
  return res
    .status(200)
    .json(
      new ApiResponse(200, playlists, "Playlists fetched successfully")
    )

})

const getPlaylistById = asyncHandler(async (req, res) => {
  const { playlistId } = req.params
  //  VALIDATION
  if (!playlistId?.trim()) {
    throw new ApiError(400, "playlistId required")
  }

  if (!mongoose.Types.ObjectId.isValid(playlistId)) {
    throw new ApiError(400, "Invalid playlistId")
  }

  const playlist = await Playlist.findById(playlistId)

  if (!playlist) {
    throw new ApiError(500, "something went wrong while fetching playlist from database")
  }
  // make sure its not other user's private playlist
  if (playlist.privacyStatus === "private" && !(playlist.owner.equals(new mongoose.Types.ObjectId(String(req?.user._id))))) {
    throw new ApiError(401, "Cannot access other's private playlist")
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, playlist, "fetched playlist successfully")
    )
})

const addVideoToPlaylist = asyncHandler(async (req, res) => {
  const { playlistId, videoId } = req.params
  //  VALIDATION
  if (!playlistId?.trim() || !videoId?.trim()) {
    throw new ApiError(400, "playlistId and videoId required")
  }

  if (!mongoose.Types.ObjectId.isValid(videoId) || !mongoose.Types.ObjectId.isValid(playlistId)) {
    throw new ApiError(400, "Invald playlistId or videoId")
  }
  // Check if both video and playlist exist
  const video = await Video.findById(videoId)
  const playlist = await Playlist.findById(playlistId)

  if (!video || !playlist) {
    throw new ApiError(400, "video or playlist doesn't exist")
  }
  // Verify if its playlist owner that is adding to the playlist  
  if (!playlist.owner.equals(new mongoose.Types.ObjectId(String(req?.user._id)))) {
    throw new ApiError(401, "Cannot add video to other's playlist")
  }
  // make sure that the user can add an unpublished video to the playlist only if its the owner
  if ((!video.owner.equals(new mongoose.Types.ObjectId(String(req?.user._id))) && video.isPublished === false)) {
    throw new ApiError(401, "Cannot add other's unpublished video to own playlist")
  }
  // add video to the playlist if its not already present
  if (!playlist.videos.includes(videoId)) {
    playlist.videos.push(videoId)
    await playlist.save()
  }

  return res
    .status(201)
    .json(
      new ApiResponse(201, playlist, "Video added to playlist successfully")
    )
})

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
  const { playlistId, videoId } = req.params
  // VALIDATION
  if (!playlistId?.trim() || !videoId?.trim()) {
    throw new ApiError(400, "playlistId and videoId required")
  }

  if (!mongoose.Types.ObjectId.isValid(videoId) || !mongoose.Types.ObjectId.isValid(playlistId)) {
    throw new ApiError(400, "Invald playlistId or videoId")
  }
  // Check if both video and playlist exist
  const video = await Video.findById(videoId)
  const playlist = await Playlist.findById(playlistId)

  if (!video || !playlist) {
    throw new ApiError(400, "video or playlist doesn't exist")
  }
  // Verify if its playlist owner that is removing from the playlist  
  if (!(await playlist.owner.equals(new mongoose.Types.ObjectId(String(req?.user._id))))) {
    throw new ApiError(401, "Cannot remove video from other's playlist")
  }
  // (NOT APPLICABLE HERE): make sure that the user can remove an unpublished video from the playlist only if its the owner
  // if ((!video.owner.equals(new mongoose.Types.ObjectId(String(req?.user._id))) && video.isPublished === false)) {
  //   throw new ApiError(401, "Cannot add other's unpublished video to own playlist")
  // }

  // REMOVE video FROM the playlist
  playlist.videos = playlist.videos.filter((video) => video != videoId)
  await playlist.save()

  return res
    .status(201)
    .json(
      new ApiResponse(201, playlist, "Video added to playlist successfully")
    )

})

const deletePlaylist = asyncHandler(async (req, res) => {
  const { playlistId } = req.params
  //  VALIDATION
  if (!playlistId?.trim()) {
    throw new ApiError(400, "playlistId required")
  }

  if (!mongoose.Types.ObjectId.isValid(playlistId)) {
    throw new ApiError(400, "Invalid playlistId")
  }

  const playlist = await Playlist.findById(playlistId)

  if (!playlist) {
    throw new ApiError(500, "playlist doesn't exist")
  }
  // make sure its the owner trying to delete the playlist
  if (!(playlist.owner.equals(new mongoose.Types.ObjectId(String(req?.user._id))))) {
    throw new ApiError(401, "Cannot delete other user's playlist")
  }

  const deletedPlaylist = await Playlist.findByIdAndDelete(req?.user._id)

  return res
    .status(200)
    .json(
      new ApiResponse(200, deletedPlaylist, "playlist deleted successfully")
    )
})

const updatePlaylist = asyncHandler(async (req, res) => {
  const { playlistId } = req.params
  const { name, description = "" } = req.body
  // VALIDATION
  if (!name?.trim()) {
    throw new ApiError(400, "Playlist name is required")
  }

  if (!playlistId?.trim()) {
    throw new ApiError(400, "playlistId required")
  }

  if (!mongoose.Types.ObjectId.isValid(playlistId)) {
    throw new ApiError(400, "Invalid playlistId")
  }

  const playlist = await Playlist.findById(playlistId)

  if (!playlist) {
    throw new ApiError(500, "playlist doesn't exist")
  }
  // make sure its the owner trying to update the playlist
  if (!(playlist.owner.equals(new mongoose.Types.ObjectId(String(req?.user._id))))) {
    throw new ApiError(401, "Cannot update other user's playlist")
  }

  playlist.name = name
  playlist.description = description
  await playlist.save()

  return res
    .status(200)
    .json(
      new ApiResponse(200, playlist, "updated playlist successfully")
    )
})

const togglePrivacyStatus = asyncHandler(async (req, res) => {
  const { playlistId } = req.params
  //  VALIDATION
  if (!playlistId?.trim()) {
    throw new ApiError(400, "playlistId required")
  }

  if (!mongoose.Types.ObjectId.isValid(playlistId)) {
    throw new ApiError(400, "Invalid playlistId")
  }

  const playlist = await Playlist.findById(playlistId)

  if (!playlist) {
    throw new ApiError(500, "playlist doesn't exist")
  }
  // make sure its the owner trying to delete the playlist
  if (!(playlist.owner.equals(new mongoose.Types.ObjectId(String(req?.user._id))))) {
    throw new ApiError(401, "Cannot toggle privacyStatus of other user's playlist")
  }

  playlist.privacyStatus = (playlist.privacyStatus === "private") ? "public" : "private";
  await playlist.save()

  return res
    .status(200)
    .json(
      new ApiResponse(200, { privacyStatus: playlist.privacyStatus }, "toggled playlist privacyStatus successfully")
    )
})

export {
  createPlaylist,
  getUserPlaylists,
  getPlaylistById,
  addVideoToPlaylist,
  removeVideoFromPlaylist,
  deletePlaylist,
  updatePlaylist,
  togglePrivacyStatus
}
import mongoose from "mongoose"
import { Video } from "../models/video.model.js"
import { Subscription } from "../models/subscription.model.js"
import { Like } from "../models/like.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { User } from "../models/user.model.js"

const getChannelStats = asyncHandler(async (req, res) => {
  // TODO: Get the channel stats like total video views, total subscribers, total videos, total likes etc.
  const { channelId } = req.params
  //  VALIDATION
  if (!channelId?.trim()) {
    throw new ApiError(400, "channelId required")
  }

  if (!mongoose.Types.ObjectId.isValid(channelId)) {
    throw new ApiError(400, "Invalid channelId")
  }

  const channel = await User.findById(channelId)

  if (!channel) {
    throw new ApiError(500, "channel doesn't exist")
  }

  const videos = await Video.find({ owner: new mongoose.Types.ObjectId(String(channelId)) })
  const subscribers = await Subscription.find({ channel: new mongoose.Types.ObjectId(String(channelId)) })

  // const totalChannelVideoLikes = videos.reduce(async (likeCount, currentVideo) => {
  //   const likes = await Like.find({ video: currentVideo._id })
  //   return likeCount + likes.length
  // })
  const likeCounts = await Promise.all(
    videos.map(async (currentVideo) => {
      const likes = await Like.find({ video: currentVideo._id });
      return likes.length;
    })
  );
  const totalChannelVideoLikes = likeCounts.reduce((total, count) => total + count, 0);

  const data = {
    _id: channelId,
    videoCount: videos.length,
    totalVideoViews: videos.reduce((totalView, currentVideo) => totalView + currentVideo.views, 0),
    subscriberCount: subscribers.length,
    totalLikes: totalChannelVideoLikes
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, data, "fetched channel videos successfully")
    )
})

const getChannelVideos = asyncHandler(async (req, res) => {
  // TODO: Get all the videos uploaded by the channel
  const { channelId } = req.params
  //  VALIDATION
  if (!channelId?.trim()) {
    throw new ApiError(400, "channelId required")
  }

  if (!mongoose.Types.ObjectId.isValid(channelId)) {
    throw new ApiError(400, "Invalid channelId")
  }

  const channel = await User.findById(channelId)

  if (!channel) {
    throw new ApiError(500, "channel doesn't exist")
  }

  let videos = await Video.find({ owner: channel })

  // if it's not the owner accessing the video list, then don't show unpublished videos
  // compare function
  const isUserTheVideoOwner = (video, userId) => (video.owner.equals(new mongoose.Types.ObjectId(String(userId))))
  //filter
  videos = videos.filter((video) => isUserTheVideoOwner(video, req?.user._id))


  return res
    .status(200)
    .json(
      new ApiResponse(200, videos, "fetched channel videos successfully")
    )
})

export {
  getChannelStats,
  getChannelVideos
}
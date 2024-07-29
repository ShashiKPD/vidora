import mongoose, { isValidObjectId } from "mongoose"
import { User } from "../models/user.model.js"
import { Subscription } from "../models/subscription.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"

const toggleSubscription = asyncHandler(async (req, res) => {
  const { channelId } = req.params
  // Validation 
  if (!channelId?.trim()) {
    throw new ApiError(400, "channelId is required")
  }

  const currentUserId = req?.user?._id

  if (!currentUserId) {
    throw new ApiError(401, "user not logged in")
  }
  // get _id of channel from its username
  const channelUser = await User.findOne({ username: channelId })

  if (!channelUser) {
    throw new ApiError(400, "Invalid channelId")
  }
  const channelUserId = channelUser?._id
  // declare rsponse and data
  let responseMessage = "";
  let subscription;
  let isSubscribed;

  const subscribedDoc = await Subscription.findOne({
    subscriber: currentUserId,
    channel: channelUserId
  })

  if (subscribedDoc === null) {
    // not subscribed
    subscription = await Subscription.create({
      subscriber: currentUserId,
      channel: channelUserId
    })

    if (!subscription) {
      throw new ApiError(500, "something went wrong while creating subscription")
    }
    responseMessage = "User subscribed successfully"
    isSubscribed = true
  } else {
    // already subscribed
    subscription = await Subscription.findByIdAndDelete(subscribedDoc._id)
    if (!subscription) {
      throw new ApiError(500, "something went wrong while deleting subscription")
    }
    responseMessage = "User unsubscribed successfully"
    isSubscribed = false
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, { isSubscribed }, responseMessage)
    )
})

// CONTROLLER TO RETURN THE SUBSCRIBER LIST OF A CHANNEL
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
  const { channelId } = req.params
  // Validation
  if (!channelId?.trim()) {
    throw new ApiError(400, "channelId is required")
  }
  // get _id of channel from its username
  const channelUser = await User.findOne({ username: channelId })

  if (!channelUser) {
    throw new ApiError(400, "Invalid channelId")
  }
  const channelUserId = channelUser?._id
  // contruct the subscriber list using pipelining
  const subscriberList = await Subscription.aggregate(
    [
      {
        $match: {
          channel: new mongoose.Types.ObjectId(String(channelUserId))
        }
      },
      {
        $lookup: {
          from: "users",
          localField: "subscriber",
          foreignField: "_id",
          as: "subscribers",
          pipeline: [
            {
              $project: {
                fullName: 1,
                username: 1,
                avatar: 1
              }
            }
          ]
        }
      },
      {
        $unwind: "$subscribers"
      },
      {
        $group: {
          _id: "$channel",
          subscriberCount: {
            $count: {}
          },
          subscribers: {
            $push: "$subscribers"
          }
        }
      }
    ]
  )

  if (!subscriberList) {
    throw new ApiError(500, "something went wrong while fetching subscriber info")
  }
  // response
  return res
    .status(200)
    .json(
      new ApiResponse(200, subscriberList?.[0], "channel subscribers fetched successfully")
    )
})

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
  const { subscriberId } = req.params //subscriberId is the username

  // Validation
  if (!subscriberId?.trim()) {
    throw new ApiError(400, "subscriberId is required")
  }
  // get username of subscriber from req.user that is created by vrifyJwtmiddleware
  const currentUsername = req?.user?.username
  const currentUserId = req?.user?._id

  if (!currentUsername) {
    throw new ApiError(401, "User not logged in")
  }
  // VALIDATION: the logged in user should only be able to access their own subscription list
  if (currentUsername != subscriberId) {
    throw new ApiError(401, "User not authorized to access other users' subscribedTo list")
  }

  // get subscribed channel list
  const channels = await Subscription.aggregate([
    {
      $match: {
        subscriber: new mongoose.Types.ObjectId(String(currentUserId))
      }
    },
    {
      $lookup: {
        from: "users",
        localField: "channel",
        foreignField: "_id",
        as: "channelDetails",
        pipeline: [
          {
            $project: {
              username: 1,
              fullName: 1,
              avatar: 1
            }
          }
        ]
      }
    },
    {
      $unwind: "$channelDetails"
    },
    {
      $group: {
        _id: "$subscriber",
        channels: {
          $push: "$channelDetails"
        }
      }
    }
  ])

  if (!channels) {
    throw new ApiError(500, "something went wrong while fetching subscribed channel list")
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, channels?.[0], "Fetched subscribed channel successfully")
    )

})

export {
  toggleSubscription,
  getUserChannelSubscribers,
  getSubscribedChannels
}
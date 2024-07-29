import mongoose, { isValidObjectId } from "mongoose"
import { Like } from "../models/like.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { Video } from "../models/video.model.js"
import { Comment } from "../models/comment.model.js"
import { CommunityPost } from "../models/communityPost.model.js"

const toggleVideoLike = asyncHandler(async (req, res) => {
  const { videoId } = req.params
  //TODO: toggle like on video

  // Validation
  if (!videoId) {
    throw new ApiError(400, "videoId is required")
  }
  if (!mongoose.Types.ObjectId.isValid(videoId)) {
    throw new ApiError(400, "Invalid videoId")
  }
  // check if video exists
  const video = await Video.findById(videoId)

  if (video === null) {
    throw new ApiError(400, "video does not exist")
  }
  if (!video) {
    throw new ApiError(500, "something went wrong while validating videoId")
  }

  let like;
  let isLiked = false;
  // check if like current user has liked this video before and deletes it
  like = await Like.findOneAndDelete(
    {
      likedBy: new mongoose.Types.ObjectId(String(req?.user._id)),
      video: new mongoose.Types.ObjectId(String(videoId))
    }
  )

  if (like === null) {
    // user has not liked this video before
    like = await Like.create({
      likedBy: req.user.id,
      video: videoId
    })

    if (!like) {
      throw new ApiError(500, "something went wrong while creating the like document")
    }
    isLiked = true
  }

  if (!like) {
    throw new ApiError(500, "something went wrong while finding the like document")
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, { isLiked }, "Toggled like status")
    )
})

const toggleCommentLike = asyncHandler(async (req, res) => {
  const { commentId } = req.params
  //TODO: toggle like on comment

  // Validation
  if (!commentId) {
    throw new ApiError(400, "commentId is required")
  }
  if (!mongoose.Types.ObjectId.isValid(commentId)) {
    throw new ApiError(400, "Invalid commentId")
  }
  // check if Comment exists
  const comment = await Comment.findById(commentId)

  if (comment === null) {
    throw new ApiError(400, "comment does not exist")
  }
  if (!comment) {
    throw new ApiError(500, "something went wrong while validating commentId")
  }

  let like;
  let isLiked = false;
  // check if like current user has liked this video before and deletes it
  like = await Like.findOneAndDelete(
    {
      likedBy: new mongoose.Types.ObjectId(String(req?.user._id)),
      comment: new mongoose.Types.ObjectId(String(commentId))
    }
  )

  if (like === null) {
    // user has not liked this video before
    like = await Like.create({
      likedBy: req.user.id,
      comment: commentId
    })

    if (!like) {
      throw new ApiError(500, "something went wrong while creating the like document")
    }
    isLiked = true
  }

  if (!like) {
    throw new ApiError(500, "something went wrong while finding the like document")
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, { isLiked }, "Toggled like status")
    )
})

const togglecommunityPostLike = asyncHandler(async (req, res) => {
  const { communityPostId } = req.params
  //TODO: toggle like on communityPostId

  // Validation
  if (!communityPostId) {
    throw new ApiError(400, "communityPostId is required")
  }
  if (!mongoose.Types.ObjectId.isValid(communityPostId)) {
    throw new ApiError(400, "Invalid communityPostId")
  }
  // check if communityPost exists
  const communityPost = await CommunityPost.findById(communityPostId)

  if (communityPost === null) {
    throw new ApiError(400, "Community Post does not exist")
  }
  if (!communityPost) {
    throw new ApiError(500, "something went wrong while validating communityPostId")
  }

  let like;
  let isLiked = false;
  // check if like current user has liked this video before and deletes it
  like = await Like.findOneAndDelete(
    {
      likedBy: new mongoose.Types.ObjectId(String(req?.user._id)),
      CommunityPost: new mongoose.Types.ObjectId(String(communityPostId))
    }
  )

  if (like === null) {
    // user has not liked this video before
    like = await Like.create({
      likedBy: req.user.id,
      communityPost: communityPostId
    })

    if (!like) {
      throw new ApiError(500, "something went wrong while creating the like document")
    }
    isLiked = true
  }

  if (!like) {
    throw new ApiError(500, "something went wrong while finding the like document")
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, { isLiked }, "Toggled like status")
    )
}
)

const getLikedVideos = asyncHandler(async (req, res) => {
  //TODO: get all liked videos
  const userId = req?.user._id
  // Validation
  if (!isValidObjectId(userId)) {
    throw new ApiError(400, "Invalid userId")
  }

  const likedVideos = await Like.aggregate(
    [
      {
        $match: {
          $and: [
            { likedBy: new mongoose.Types.ObjectId(String(userId)) },
            { video: { $exists: true, $ne: null } }
          ]
        }
      },
      {
        $lookup: {
          from: "videos",
          localField: "video",
          foreignField: "_id",
          as: "videoDetails",
          pipeline: [
            {
              $match: {
                $or: [{ isPublished: true }, { owner: userId }]
              }
            },
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
                      avatar: 1
                    }
                  }
                ]
              }
            },
            {
              $unwind: "$ownerDetails"
            },
            {
              $project: {
                owner: 0
              }
            }
          ]
        }
      },
      {
        $unwind: "$videoDetails"
      },
      {
        $group: {
          _id: "$likedBy",
          videos: {
            $push: "$videoDetails"
          }
        }
      }
    ]
  )

  return res
    .status(200)
    .json(
      new ApiResponse(200, likedVideos?.[0], "Liked video list fetched successfully")
    )
})

export {
  toggleCommentLike,
  togglecommunityPostLike,
  toggleVideoLike,
  getLikedVideos
}
import mongoose, { Schema } from "mongoose";

const likeSchema = new Schema(
  {
    likedBy: {
      type: Schema.Types.ObjectId,
      ref: "User"
    },
    comment: {
      type: Schema.Types.ObjectId,
      ref: "Comment"
    },
    video: {
      type: Schema.Types.ObjectId,
      ref: "Video"
    },
    communityPost: {
      type: Schema.Types.ObjectId,
      ref: "CommunityPost"
    }
  }, { timestamps: true })


export const Like = mongoose.model("Like", likeSchema)
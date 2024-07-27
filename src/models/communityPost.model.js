import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const communityPostSchema = new Schema(
  {
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    content: {
      type: String,
      required: true,
      trim: true
    }
  }, { timestamps: true })

communityPostSchema.plugin(mongooseAggregatePaginate)

export const communityPost = mongoose.model("CommunityPost", communityPostSchema)
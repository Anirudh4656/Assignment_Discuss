import mongoose, { Schema, Types } from "mongoose";

export interface ILike {
    user: Types.ObjectId;
    discussion: Types.ObjectId;
    reply: Types.ObjectId;
  }

const LikeSchema = new Schema<ILike>({
    user: { type: Schema.Types.ObjectId, ref: "User" },
    discussion: { type: Schema.Types.ObjectId, ref: "Discuss" },
    reply: { type: Schema.Types.ObjectId, ref: "Reply" },
  });

  export const Like = mongoose.model("Like", LikeSchema);
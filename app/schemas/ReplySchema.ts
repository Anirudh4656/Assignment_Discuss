

import mongoose, { Schema, Types } from "mongoose";
export interface Reply {
    id: any;
    discussion: Types.ObjectId;
    user: Types.ObjectId;
    name: string;
    content: string;
  }
  export interface Like {
    equals: any;
    user: Types.ObjectId;
  }
  export interface IReply {
    save(): unknown;
    id: any;
    discussion: Types.ObjectId;
    user: Types.ObjectId;
    name: string;
    content: string;
    replies: Reply[];
    likes: Like[];
  }
const ReplySchema = new Schema<IReply>({
    content: { type: String, required: true },
    replies: [{ type: Schema.Types.ObjectId, ref: "Reply" }],
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    discussion: { type: Schema.Types.ObjectId, ref: "Discuss", required: true },
    name: { type: String },
    likes: [{ type: Schema.Types.ObjectId, ref: "Like" }],
  });

  export const Reply = mongoose.model("Reply", ReplySchema);
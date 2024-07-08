
import mongoose, { Schema, Types } from "mongoose";
import { type BaseSchema } from "./index";
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
  export interface ILike {
    user: Types.ObjectId;
    discussion: Types.ObjectId;
    reply: Types.ObjectId;
  }
export interface IDiscuss extends BaseSchema {
    title: string;
    content: string;
    user: Types.ObjectId;
    isClosed: boolean;
    replies: IReply[];
    likes: ILike[];
    name: string;
  }

const DiscussionSchema = new Schema<IDiscuss>({
    title: { type: String, required: true },
    content: { type: String, required: true },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String },
    createdAt: { type: Date, Default: Date.now },
    updatedAt: { type: Date, Default: Date.now },
    isClosed: { type: Boolean, default: false },
    replies: [{ type: Schema.Types.ObjectId, ref: "Reply" }],
    likes: [{ type: Schema.Types.ObjectId, ref: "Like" }],
  });
  export const Discuss = mongoose.model("Discuss", DiscussionSchema);
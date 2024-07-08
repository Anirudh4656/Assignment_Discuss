import { IUser } from "../schemas/User";
import { NextFunction, Request, Response } from "express";
import expressAsyncHandler from "express-async-handler";
import { createResponse } from "../helper/response";
import { ObjectId } from "mongodb";
import mongoose from "mongoose";
import { Like } from "../schemas/LikeSchema";
import { Discuss } from "../schemas/Discussion";
import { Reply } from "../schemas/ReplySchema";

export const createDiscussion = async (req: Request, res: Response) => {
  const { title, content } = req.body;
  const result = req.user as IUser;
  // console.log("in req user", result);

  const discuss = new Discuss({
    title,
    content,
    user: result.id,
    name: result.user,
  });
  await discuss.save();
  // console.log("in create discuss", discuss);
  res.send(createResponse(discuss));
};
export const likeDiscussion = async (req: Request, res: Response) => {
  const user = req.user as IUser;
  const { id } = req.params;

  try {
    const discussion = await Discuss.findById(id).populate({
      path: "likes",
    });

    let like;
    if (discussion) {
      // const userLike = discussion.likes.find((like: any) =>
      //   like.user.equals(user?.id)
      // );
      const userLike = await Like.findOne({ user: user.id, discussion: id });
      console.log("like found or not", userLike);

      if (userLike) {
        // discussion.likes = discussion.likes.filter(
        //   (like: any) => !like.user.equals(user.id)
        // );
        await Like.findByIdAndDelete(userLike._id);
        await Discuss.updateOne(
          { _id: id },
          { $pull: { likes: userLike._id } }
        );
        console.log("unLike of Discussion");
        res.send(createResponse({ message: " UnLiked successfully", like }));
      } else {
        console.log("inLike of Discussion");
        like = new Like({ user: user.id, discussion: id });
        await like.save();
        // console.log("inn c l", like);
        // discussion.likes.push(like);
        await Discuss.updateOne({ _id: id }, { $push: { likes: like._id } });
        console.log("discussion After Like ", discussion);
        res.send(createResponse({ message: "Liked successfully", like }));
      }
    }
  } catch (error) {
    console.log(error);
  }
};

export const getDiscusssion = async (req: Request, res: Response) => {
  const Discusss = await Discuss.find()
    .sort({ _id: -1 })
    .populate({
      path: "likes",
    })
    .populate({
      path: "replies",
      populate: [
        {
          path: "replies",
          populate: [
            {
              path: "replies",
              populate: {
                path: "likes",
              },
            },
            {
              path: "likes",
            },
          ],
        },
        {
          path: "likes",
        },
      ],
    });

  //error in .populate
  console.log("in dicuss", Discusss);
  res.send(createResponse(Discusss));
};
//to check
export const getUserDiscusssion = async (req: Request, res: Response) => {
  const { id } = req.params;
  const Discusss = await Discuss.findById(id);
  console.log("User Discussions", Discuss);
  res.send(createResponse(Discusss));
};

//
export const replyToDiscussion = async(
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { content } = req.body;
  const { id } = req.params;
  const user = req.user as IUser;
  const userId = new ObjectId(id);

  try {
    const discussion = await Discuss.findById(id);

    if (discussion) {
      const reply = new Reply({
        content,
        user: user.id,
        discussion: userId,
        name: user.user,
      });
      await reply.save();
      console.log("newreply:", reply);

   
        discussion.replies.push(reply);
        await discussion.save();

      console.log("in reply after discussion", discussion);
      res.send(createResponse(reply));
    }
  } catch (error) {
    console.error("Error replying to discussion:", error);
    next(error);
  }
};
export const nestedReply = async (req: Request, res: Response) => {
  const user = req.user as IUser;
  const { discussionId, replyId } = req.params;
  // console.log("in nested comments", user.user);
  const { content } = req.body;
  // console.log(
  //   "discussionId:",
  //   discussionId,
  //   "parentReplyID:",
  //   replyId,
  //   "content:",
  //   content
  // );
  try {
    const discussion = await Discuss.findById(discussionId);
    if (discussion) {
      const nestedReply = new Reply({
        content,
        user: user.id,
        discussion: discussionId,
        name: user.user,
      });
      console.log("in nested reply", nestedReply);
      await nestedReply.save();
      // const parentreply=discussion?.replies.find((reply:any)=>reply.id ===replyId);
      const parentReply = await Reply.findById(replyId).populate("replies");
      if (parentReply) {
        console.log("Parent reply is:", parentReply);
        parentReply.replies.push(nestedReply);
        await parentReply.save();
        await parentReply.populate({
          path: "replies",
        });
      }
      console.log("Parent reply after is:", parentReply);
      res.send(createResponse(nestedReply));
    }
  } catch (e) {
    console.log(e);
  }
};
export const replyLike = async (req: Request, res: Response) => {
  const user = req.user as IUser;
  const { id } = req.params;
  // const id="6684eb95de93c2f0fbe097e7"
  //reply id
  let newLike;
  // const replyId = "6683a271b5785ce930501a1c";
  try {
    const reply = await Reply.findById(id);
    // console.log("reply",reply);

    const existingLike = await Like.findOne({ user: user.id, reply: id });
    console.log("existingLike", existingLike);
    if (existingLike && reply) {
      await Like.findByIdAndDelete(existingLike._id);
      reply.likes = reply.likes.filter(
        (like) => !like.equals(existingLike._id)
      );
    } else {
      newLike = new Like({ user: user.id, reply: id });
      await newLike.save();
      // console.log("new like", newLike);
      reply?.likes.push(newLike);

      await reply?.save();
    }
    // await Discuss.findOneAndUpdate(
    //   { "replies._id": id },
    //   { $set: { "replies.$": reply } },
    //   { new: true }
    // );
    if (reply) {
      console.log("in likereply after pushing data", reply.likes);

      res.send(createResponse(newLike));
    }
  } catch (e) {
    console.log(e);
  }
};

function createHttpError(arg0: number, arg1: string) {
  throw new Error("Function not implemented.");
}

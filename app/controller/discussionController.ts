import { Discuss, IUser, Like, Reply } from "../schemas/User";
import { NextFunction, Request, Response } from "express";
import expressAsyncHandler from "express-async-handler";
import { createResponse } from "../helper/response";
import { ObjectId } from "mongodb";
import mongoose from "mongoose";

export const createDiscussion = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const { title, content } = req.body;
    const result = req.user as IUser;
    console.log("in req user", result);

    //667dc51b36a5ed8dcc799819
    //why user but we need only user.id?
    const discuss = new Discuss({
      title,
      content,
      user: result.id,
      name: result.user,
    });
    await discuss.save();
    console.log("in create discuss", discuss);
    res.send(createResponse(discuss));
  }
);
export const likeDiscussion = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const user = req.user as IUser;
    //name ?
    // console.log("in user.id", user.id);
    const { id } = req.params;

    try {
      const discussion = await Discuss.findById(id).populate({
        path: "likes",
      });

      console.log("in. ", discussion);
      // if (!discussion) {
      //   return res.status(404).json({ message: 'Discussion not found' });
      // }
      let like;
      if (discussion) {
        //6682786733a502194736ae63
        const userLike = discussion.likes.find((like: any) =>
          like.user.equals(user?.id)
        );

        console.log("like found or not", userLike);

        if (userLike) {
          // Unlike
          console.log("inuser unlike");
          discussion.likes = discussion.likes.filter(
            (like: any) => !like.user.equals(user.id)
          );
          await Like.findByIdAndDelete(userLike);
          console.log("inuser unlike success");
        } else {
          console.log("inuserlike");
          like = new Like({ user: user.id, Discussion: id });
          await like.save();
          console.log("inn c l", like);
          discussion.likes.push(like);
          console.log("in after discussion. ", discussion);
        }

        await discussion.save();
        console.log("in backend of like", like);
        res.send(createResponse(like));
      }
    } catch (error) {
      console.log(error);
    }
  }
);

export const getDiscusssion = expressAsyncHandler(
  async (req: Request, res: Response) => {
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
  }
);
//to check
export const getUserDiscusssion = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const Discusss = await Discuss.findById(id);
    console.log("dd", Discuss);
    res.send(createResponse(Discusss));
  }
);

//
export const replyToDiscussion = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { content } = req.body;
    const { id } = req.params;
    console.log(id);
    const user = req.user as IUser;
    // const userId=user._doc._id;
    //when iam  sending user._id not working but sending user it is working
    console.log("in id", id);
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(createHttpError(400, "Invalid discussion ID format"));
    }
    const userId = new ObjectId(id);
    console.log("in userid", user.username);

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

        if (discussion) {
          discussion.replies.push(reply);
          await discussion.save();
        }
        console.log("in reply after discussion", discussion);
        res.send(createResponse(reply));
      }
    } catch (e) {
      console.log(e);
    }
  }
);
export const nestedReply = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const user = req.user as IUser;
    const { discussionId, replyId } = req.params;
    // console.log("in nested comments", user.user);
    const { content } = req.body;
    console.log(
      "discussionId:",
      discussionId,
      "parentReplyID:",
      replyId,
      "content:",
      content
    );
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
  }
);
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
// export const likeDiscussion = expressAsyncHandler(async (req: Request, res: Response) => {
//   const user = req.user as IUser;
//   const { id } = req.params;

//   try {
//     const discussion = await Discuss.findById(id);

//     if (!discussion) {
//       throw createHttpError(404, 'Discussion not found');
//     }

//     const userLike = await Like.findOne({ user: user.id, discussion: id });

//     if (userLike) {
//       // Unlike
//       await Like.findByIdAndDelete(userLike._id);
//       await Discuss.findByIdAndUpdate(id, { $pull: { likes: userLike._id } });
//     } else {
//       // Like
//       const like = new Like({ user: user.id, discussion: id });
//       await like.save();
//       await Discuss.findByIdAndUpdate(id, { $push: { likes: like._id } });
//     }
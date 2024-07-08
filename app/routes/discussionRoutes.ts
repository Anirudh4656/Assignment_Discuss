import express from "express";
import { Request, Response } from "express";
const router = express.Router();
import expressAsyncHandler from "express-async-handler";
import {
  replyLike,
  createDiscussion,
  getDiscusssion,
  getUserDiscusssion,
  likeDiscussion,
  nestedReply,
  replyToDiscussion,
} from "../controller/discussionController";

router.post("/discussions", expressAsyncHandler(createDiscussion));
router.patch("/discussions/:id/like", expressAsyncHandler(likeDiscussion));
router.patch("/discussions/:id/reply", expressAsyncHandler(replyToDiscussion));
router.get("/discussions", expressAsyncHandler(getDiscusssion));
router.get("/user/:id/discussions", expressAsyncHandler(getUserDiscusssion));
router.patch(
  "/discussions/:discussionId/replies/:replyId/reply",
  expressAsyncHandler(nestedReply)
);
router.patch(
  "/discussions/replies/:replyId/like",
  expressAsyncHandler(replyLike)
);

export default router;

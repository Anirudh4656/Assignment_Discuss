import { Request, Response } from "express";
import { User, UserRole } from "../schemas/User";
import createHttpError from "http-errors";
import { createResponse } from "../helper/response";
import { Discuss } from "../schemas/Discussion";

export const blockUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  console.log(id);
  const user = await User.findById(id);
  console.log(user);
  if (!user) {
    //i am not able to use return here?
    throw createHttpError(404, {
      message: `Invalid User not found`,
    });
  }
  console.log(user.isBlocked);
  if (user.isBlocked == true) {
    user.isBlocked = false;
  } else {
    user.isBlocked = true;
  }
  // user.role = UserRole.USER;
  await user.save();
  console.log(user);
  res.send(createResponse({ msg: "User blocked" }));
};
export const Users = async (req: Request, res: Response) => {
  const users = await User.find();
  console.log(users);
  res.send(createResponse(users));
};

export const closeDiscussion = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;
  const discussion = await Discuss.findByIdAndUpdate(
    id,
    { isClosed: true },
    { new: true }
  );
  if (!discussion) {
    throw createHttpError(404, {
      message: `Discussion not found`,
    });
  }
  res.send(createResponse({ msg: "Discussion closed" }));
};
export const deleteUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;
  try {
    await User.findByIdAndDelete(id);
    res.send(createResponse({ msg: "User Deleted" }));
  } catch (e) {
    console.log(e);
  }
};

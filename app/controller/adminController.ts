import { Request, Response } from 'express';
import { User } from '../schemas/User';
import { Discuss } from '../schemas/User';

export const blockUser = async (req: Request, res: Response) => {
  const user = await User.findById(req.params.userId);
  if (!user) {
    return res.status(404).json({ msg: 'User not found' });
  }
  user.isBlocked = true;
  await user.save();
  res.json({ msg: 'User blocked' });
};

export const closeDiscussion = async (req: Request, res: Response) => {
  const discussion = await Discuss.findById(req.params.discussionId);
  if (!discussion) {
    return res.status(404).json({ msg: 'Discussion not found' });
  }
  discussion.isClosed = true;
  await discussion.save();
  res.json({ msg: 'Discussion closed' });
};
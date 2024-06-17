import {Discuss, IUser, Like, Reply} from "../schemas/User";
import { Request, Response } from 'express';


export  const createDiscuss=async(req:Request,res:Response)=>{
 const {title,content}=req.body;
  const user = req.user as IUser;
 const discuss= new Discuss({title,content,user:user._id})
 await discuss.save();
 res.json(discuss);

}
export const getDiscusss = async (req: Request, res: Response) => {
    const Discusss = await Discuss.find().populate('user', 'username');
    res.json(Discusss);
  };
  
  export const replyToDiscuss = async (req: Request, res: Response) => {
    const { content } = req.body;
    const user = req.user as IUser;
    const reply = new Reply({ content, user: user._id, Discuss: req.params.DiscussId });
    await reply.save();
    res.json(reply);
  };
  
  export const likeDiscuss = async (req: Request, res: Response) => {
    const user = req.user as IUser;
    const like = new Like({ user: user._id, Discuss: req.params.DiscussId });
    await like.save();
    res.json(like);
  };
  
  export const getUserDiscusss = async (req: Request, res: Response) => {
    const Discusss = await Discuss.find({ user: req.params.userId });
    res.json(Discusss);
  };
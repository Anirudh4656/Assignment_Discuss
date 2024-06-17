import { type IUser } from "../schemas/User";
import expressAsyncHandler from "express-async-handler";
import { createResponse } from "../helper/response";
//validate
import * as userService from "../services/user";
export const loginUser=expressAsyncHandler(async()=>{
  
});

export const registerUser=expressAsyncHandler(async(req,res)=>{
  const {email,password,role} =req.body as IUser;  
  const user= await userService.createUser({email,password ,role});
  res.send(createResponse (user,"User created successfully"))
  })
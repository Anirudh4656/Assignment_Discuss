import express from "express";
const router=express.Router();
import { User,type IUser } from '../schemas/User';
// import {registerUser,loginUser} from "../controller/user";
import passport from "passport";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import { validate } from "../middlewares/validations";
import expressAsyncHandler from "express-async-handler";
// import { catchError, validate } from "../middleware/validation";
// router.route('/login').post(loginUser);
// router.route('/Signup').post(registerUser);
// router.post('/signup',(req,res,next)=>{
//     passport.authenticate('signup', { session: false }, (err:any, user: IUser, info:any) => {
//         if (err || !user) {
//           return res.status(400).json({ message: info.message || 'Signup failed', user });
//         }
    
//         res.status(200).json({ message: 'Signup successful', user });
//       })(req, res, next)}
// )
router.post('/signup',validate("users:create"), expressAsyncHandler(async(req:any, res:any) => {
    const { username,email, password } = req.body as IUser;
    const duplicateUser = await User.findOne({ email });
  
    if (!duplicateUser || duplicateUser.isBlocked) {
      return res.status(400).json({ msg: 'Invalid credentials or user blocked' });
    }
    const user = new User({ email, password,username });
    await user.save();
    
    // const isMatch = await bcrypt.compare(password, user.password);
    // if (!isMatch) {
    //   return res.status(400).json({ msg: 'Invalid credentials' });
    // }
  
    // const token = jwt.sign({ id: user._id, role: user.role }, 'your_jwt_secret', { expiresIn: '1h' });
    // res.json({ token, user: { id: user._id, username: user.username, role: user.role } });
  }))

router.post('/signin', (req: Request, res: Response, next: Function) => {
    passport.authenticate('signin', { session: false }, (err:any, user: IUser, info:any) => {
      if (err || !user) {
        return res.status(400).json({ message: info.message || 'Signin failed', user });
      }
  
      req.login(user, { session: false }, (err) => {
        if (err) {
          return res.status(400).json({ message: 'Signin failed' });
        }
  
        const token = jwt.sign({ id: user._id, email: user.email }, 'your_jwt_secret', { expiresIn: '1h' });
        return res.json({ token, user });
      });
    })(req, res, next)
  })
export default router;

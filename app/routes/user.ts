import express from "express";
const router=express.Router();
import {registerUser,loginUser} from "../controller/user";
import expressAsyncHandler from "express-async-handler";
// import { catchError, validate } from "../middleware/validation";
router.post('/login',expressAsyncHandler(loginUser));
router.post('/Signup',expressAsyncHandler(registerUser));

export default router;

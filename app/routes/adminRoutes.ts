import express from "express";
import { blockUser, closeDiscussion, deleteUser, Users } from "../controller/adminController";
import expressAsyncHandler from "express-async-handler";
const router=express.Router();

// router.put('/blockUser/:id',blockUser);
// router.get('/getAllUsers',getAllUsers);
// router.patch('/closeDiscussion/:id',closeDiscussion);
// router.put('/deleteUser/:id',deleteUser);
router.patch("/users/block/:id",expressAsyncHandler(blockUser));
router.get("/users",expressAsyncHandler(Users));
router.patch("/discussions/close/:id",expressAsyncHandler(closeDiscussion));
router.delete("/users/delete/:id",expressAsyncHandler(deleteUser));

export default router;
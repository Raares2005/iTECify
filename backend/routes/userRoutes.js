import express from "express";
const userRouter = express.Router();

import { createUser } from "../controllers/userControllers/createUserController.js";
//import { updateUserProfile } from "../controllers/userControllers/updateUserController.js";
import { getUserProfile } from "../controllers/userControllers/getUserController.js";
import { authUser } from "../controllers/userControllers/signInUserController.js";
import { logoutUser } from "../controllers/userControllers/signOutUserController.js";

import { protect } from "../middleware/authMiddleware.js";

userRouter.post("/", createUser);
userRouter.post("/auth", authUser);
userRouter.post("/logout", logoutUser);
// userRouter.route("/profile").get(protect, getUserProfile).put(protect, updateUserProfile);
export default userRouter;
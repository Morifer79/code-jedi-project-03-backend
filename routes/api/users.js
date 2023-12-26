import express from "express";
import userController from "../../controllers/auth-controllers.js"
import {validateBody} from "../../decorators/index.js";
import {authenticate, isEmptyBody,upload} from "../../middlewares/index.js";
import {userInfoSchema, userUpdateSchema, userNormWaterSchema, userLoginSchema, userRegisterForm} from "../../db/models/User.js";


const userRouter = express.Router();

userRouter.post("/register", isEmptyBody, validateBody(userRegisterForm), userController.register);

userRouter.post("/login", isEmptyBody, validateBody(userLoginSchema), userController.login);

userRouter.post("/logout", authenticate, userController.logout);

userRouter.patch("/avatar", authenticate, upload.single("avatarURL"), userController.updateAvatar);

userRouter.get("/:userId", authenticate, validateBody(userInfoSchema), userController.currentUser);

userRouter.patch("/:userId", authenticate,isEmptyBody, validateBody(userUpdateSchema), userController.updateUser);

userRouter.patch("/waterNorm", authenticate, isEmptyBody, validateBody(userNormWaterSchema), userController.updateWaterNorm);

export default  userRouter;

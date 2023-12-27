import express from "express";
import userController from "../../controllers/user-controllers.js"
import {validateBody} from "../../decorators/index.js";
import {authenticate, isEmptyBody,upload} from "../../middlewares/index.js";
import {userInfoSchema, userUpdateSchema, userNormWaterSchema} from "../../db/models/User.js";

const userRouter = express.Router();

userRouter.patch("/avatar", authenticate, upload.single("avatarURL"), userController.updateAvatar);

userRouter.get("/:userId", authenticate, validateBody(userInfoSchema), userController.currentUser);

userRouter.patch("/:userId", authenticate,isEmptyBody, validateBody(userUpdateSchema), userController.updateUser);

userRouter.patch("/waterNorm", authenticate, isEmptyBody, validateBody(userNormWaterSchema), userController.updateWaterNorm);

export default userRouter;
import express from "express";
import userController from "../../controllers/user-controllers.js"
import {validateBody} from "../../decorators/index.js";
import {authenticate, isEmptyBody,upload} from "../../middlewares/index.js";
import {userInfoSchema, 
  userUpdateSchema, 
  userNormWaterSchema, 
  userChangePasswordSchema
} from "../../db/models/User.js";

const userRouter = express.Router();

userRouter.patch("/avatar", authenticate, upload.single("avatarURL"), userController.updateAvatar);

userRouter.get("/:userId", authenticate, validateBody(userInfoSchema), userController.currentUser);

userRouter.patch("/:userId", authenticate,isEmptyBody, validateBody(userUpdateSchema), userController.updateUser);

userRouter.patch("/waterRate", authenticate, isEmptyBody, validateBody(userNormWaterSchema), userController.updateWaterNorm);

userRouter.patch("/:userId/changePassword", authenticate, isEmptyBody, validateBody(userChangePasswordSchema), userController.changePassword);

userRouter.post("/forgotPassword", isEmptyBody, userController.forgotPassword);

userRouter.post("/resetPassword/:forgotPasswordToken", isEmptyBody, validateBody(userChangePasswordSchema), userController.resetPassword);

export default userRouter;
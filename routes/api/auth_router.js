import express from "express";
import authController from "../../controllers/auth_controllers.js"
import {validateBody} from "../../decorators/index.js";
import {authenticate, isEmptyBody} from "../../middlewares/index.js";
import { authLoginSchema, authRegisterForm, userEmailSchema} from "../../db/models/User.js";


const authRouter = express.Router();

authRouter.post("/register", isEmptyBody, validateBody(authRegisterForm), authController.register);

authRouter.post("/login", isEmptyBody, validateBody(authLoginSchema), authController.login);

authRouter.post("/logout", authenticate, authController.logout);


export default  authRouter;

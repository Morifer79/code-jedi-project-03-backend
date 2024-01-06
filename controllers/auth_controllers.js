import User from "../db/models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import "dotenv/config";
import gravatar from 'gravatar';
import path from "path";
import { ctrlWrapper } from "../decorators/index.js";


const { JWT_SECRET } = process.env;


const avatarsPath = path.resolve("public", "avatars");


const register = async (req, res) => {
  const { name, email, password } = req.body;
  const user = await User.findOne({ email });
  if (user) {
   res.status(409).json({
  message: "Email already in use",
});
return;
  }
  const hashPassword = await bcrypt.hash(password, 10);
  const avatarURL = gravatar.url(email);
  const newUser = await User.create({ ...req.body, name, password: hashPassword, avatarURL });
 
  res.status(201).json({
    user: {
      name: newUser.name,
      email: newUser.email,
      userId: newUser._id,
    },
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
   res.status(401).json({
  message: "Email or password is wrong",
});
return;
  }

  const passwordCompare = await bcrypt.compare(password, user.password);
  if (!passwordCompare) {
    res.status(401).json({
      message: "Email or password is wrong",
    });
    return;
  }
  const payload = {
    id: user._id,
  };

  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '23h' })
  await User.findByIdAndUpdate(user._id, { token });
  res.json({
    token,
    user: {
      name: user.name,
      email,
      userId: user._id,
      waterRate: user.waterRate
    },
  });
};

const logout = async (req, res) => {
  const { _id } = req.user;
  await User.findByIdAndUpdate(_id, { token: "" });
  res.status(204).json();
}


export default {
  register: ctrlWrapper(register),
  login: ctrlWrapper(login),
  logout: ctrlWrapper(logout)
};
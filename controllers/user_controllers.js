import User from "../db/models/User.js";
import "dotenv/config";
import fs from "fs/promises";
import path from "path";
import Jimp from 'jimp';
import { ctrlWrapper } from "../decorators/index.js";
import {sendEmail, cloudinary } from "../helpers/index.js";
import bcrypt from "bcryptjs";
import generator from 'generate-password';

const generatePassword = generator.generate({
  length: 10,
  numbers: true
});



const updateAvatar = async (req, res) => {
  const {_id} = req.user;

  if (!req.file) {
  res.status(400).json({message:`no download file`})
}

  const {url: avatarURL} = await cloudinary.uploader.upload(req.file.path, {
      folder: "avatars",
  });
  await fs.unlink(req.file.path);

  const result = await User.findByIdAndUpdate(_id, {avatarURL});

  res.status(201).json(result);
}

const currentUser = async (req, res) => {
  const { _id } = req.user;
  const { name, email, avatarURL, gender, waterRate } = await User.findById(_id, "-createdAt -updatedAt");
  res.json({
    name, email, avatarURL, gender, waterRate
  })
}


const updateUser = async (req, res) => {
  const { _id } = req.user;
  const updateUserInfo = req.body;
  const updateUser = await User.findByIdAndUpdate(_id, updateUserInfo);
 
  if (!updateUser) {
    return res.status(404).json({ error: `User not found` })
  }
  const {
    name, email, avatarURL, gender, waterRate
  } = updateUser;
  res.status(200).json({
    name, email, avatarURL, gender, waterRate
  })
}


const updateWaterNorm = async (req, res) => {
  const { _id } = req.user;
  const { waterRate } = req.body;
  await User.findByIdAndUpdate(_id, { waterRate });
  res.status(200).json({ waterRate });
}


const changePassword = async (req, res, next) => {
  const { _id } = req.user;
  const user = await User.findById({ _id });
  const { password, newPassword } = req.body;
  const compareCurrentPassword = await bcrypt.compare(password, user.password);

  if (!compareCurrentPassword) {
       res.status(401).json({
  message: "This password is wrong!",
});
return;
  }

  const comparePassword = await bcrypt.compare(newPassword, user.password);
  if (comparePassword) {
       res.status(401).json({
  message: "This Password is your current password",
});
return;
  }
  const hashNewPassword = await bcrypt.hash(newPassword, 10);
  await User.findByIdAndUpdate(_id, { password: hashNewPassword });
  res.status(200).json({ message: "Password changed successful" });
}


const forgotPasswordEmail = (email, generatePassword) => ({
  to: email,
  subject: "You get a new password",
  html: `<p>${generatePassword}</p><br/><a target="_blank" href="https://localhost:3000/singin"><button>Go to Singin page</button></a>`
});

const forgotPassword = async (req, res, next) => {
  const { email } = req.body;
  if (!email) {
    res.status(400).json({
      message: "missing email",
    });
    return;
  }
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({ error: `User not found` })
  }
  const hashNewPassword = await bcrypt.hash(generatePassword, 10);
  await User.findByIdAndUpdate(user._id, { password: hashNewPassword });
  await sendEmail(forgotPasswordEmail(email, generatePassword));

  res.status(200).json({ message: "Please, check your email" });
}

/*
const resetPassword = async (req, res) => {
  const { forgotPasswordToken } = req.params;
  const user = await User.findOne({ forgotPasswordToken });
  if (!user) {
    throw HttpError(404, "User not found")
  }
  const { password: newPassword } = req.body;
  const passwordCompare = await bcrypt.compare(newPassword, user.password);
  if (passwordCompare) {
    throw HttpError(401, "This password is your current password!");
  }
  const hashNewPassword = await bcrypt.hash(newPassword, 10);
  await User.findByIdAndUpdate(user._id, { password: hashNewPassword, forgotPasswordToken: "" });
  res.json({ message: "Password changed successful" });
}
*/

export default {
  updateAvatar: ctrlWrapper(updateAvatar),
  currentUser: ctrlWrapper(currentUser),
  updateUser: ctrlWrapper(updateUser),
  updateWaterNorm: ctrlWrapper(updateWaterNorm),
  changePassword: ctrlWrapper(changePassword),
  forgotPassword: ctrlWrapper(forgotPassword)
};
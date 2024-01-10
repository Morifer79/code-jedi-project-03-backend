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
  const { password, newPassword } = req.body;

  if (password && !newPassword || !password && newPassword) {
    return res.status(401).json({ error: `Enter your current password and new password for changing` })
  }

  const user = await User.findById({ _id });
  if (password && newPassword) {
    const compareCurrentPassword = await bcrypt.compare(password, user.password);

    if (!compareCurrentPassword) {
      return res.status(401).json({ error: `This password is wrong!` })
    }

    const comparePassword = await bcrypt.compare(newPassword, user.password);
    if (comparePassword) {
      return res.status(401).json({ error: `This Password is your current password` })
    }

    const hashNewPassword = await bcrypt.hash(newPassword, 10);
    updateUserInfo.password = hashNewPassword;
  }
  const updateUser = await User.findByIdAndUpdate(_id, updateUserInfo);
  if (!updateUser) {
    return res.status(404).json({ error: `User not found` })
  }
  const {
    name, email, avatarURL, gender, waterRate
  } = updateUser;
  if (newPassword) {
    return res.status(200).json({ message: `Password changed successful`, name, email, avatarURL, gender, waterRate });
  } else {
    res.status(200).json({
      name, email, avatarURL, gender, waterRate
    })
  }
}


const updateWaterNorm = async (req, res) => {
  const { _id } = req.user;
  const { waterRate } = req.body;
  await User.findByIdAndUpdate(_id, { waterRate });
  res.status(200).json({ waterRate });
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


export default {
  updateAvatar: ctrlWrapper(updateAvatar),
  currentUser: ctrlWrapper(currentUser),
  updateUser: ctrlWrapper(updateUser),
  updateWaterNorm: ctrlWrapper(updateWaterNorm),
  forgotPassword: ctrlWrapper(forgotPassword)
};
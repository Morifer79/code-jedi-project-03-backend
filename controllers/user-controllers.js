
import User from "../db/models/User.js";
import "dotenv/config";
import fs from "fs/promises";
import path from "path";
import Jimp from 'jimp';
import {ctrlWrapper}  from "../decorators/index.js";
import { HttpError} from "../helpers/index.js";



const updateAvatar = async (req, res) => {
    const { _id } = req.user;
    if (!req.file) {
      throw HttpError(400, 'no download file');
    }
  
    const {path: oldPath, filename} = req.file;
  
    (await Jimp.read(oldPath)).resize(250, 250).write(oldPath);
    // await pic
    //   .autocrop()
    //   .cover(250, 250, Jimp.HORIZONTAL_ALIGN_CENTER | Jimp.VERTICAL_ALIGN_MIDDLE)
    //   .writeAsync(oldPath);
  
    const newPath = path.join(avatarsPath, filename);
    await fs.rename(oldPath, newPath);
    const avatarURL = path.join('avatars', filename);
    await User.findByIdAndUpdate(_id, { avatarURL });
  
  res.json({
    avatarURL,
  });
  };
  

  const currentUser = async (req, res) => {
    const { _id } = req.user;
    const { name, email, avatarURL, gender, waterRate } = await User.findById(_id, "-createdAt -updatedAt");
    res.json({
      name, email, avatarURL, gender, waterRate
    })
  }


const updateUser = async(req, res) =>{
    const { _id } = req.user;
    const updateUserInfo = req.body;
    const updateUser = await User.findByIdAndUpdate(_id , updateUserInfo);

    if (!updateUser) {
        return res.status(404).json({error : `User not found`})
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
    const { waterRate, gender } = req.body;
    await User.findByIdAndUpdate(_id, { waterRate, gender });
    res.status(200).json({ waterRate });
  }

  export default {
    updateAvatar: ctrlWrapper(updateAvatar),
    currentUser: ctrlWrapper(currentUser),
    updateUser: ctrlWrapper(updateUser),
    updateWaterNorm: ctrlWrapper(updateWaterNorm)
  };
import mongoose from "mongoose";
import User from "../model/User.js";
import {
  comparePassword,
  createJwtToken,
  decryptPassword,
  randomString,
} from "../utils/controller_utils.js";
import { errorLog } from "../utils/logger.js";

export const getRefreshJWT = async (req, res) => {
  try {
    let _id = req.body.generate;
    let user = await User.findOne({ _id: mongoose.Types.ObjectId(_id) });
    return res.status(200).json({
      data: user,
      token: createJwtToken(user._id, "1d"),
      refresh: createJwtToken(user._id, "30d"),
    });
  } catch (error) {
    return res.status(404).json({
      message: error.message,
    });
  }
};

export const loginUsers = async (req, res) => {
  try {
    let user = await User.findOne({ email: req.body.email });
    let compare = await comparePassword(req.body.password, user.password);
    if (compare) {
      return res.status(200).json({
        data: user,
        token: createJwtToken(user._id, "1d"),
        refresh: createJwtToken(user._id, "30d"),
      });
    } else {
      return res.status(401).json({
        message: "wrong password",
      });
    }
  } catch (error) {
    return res.status(404).json({
      message: error.message,
    });
  }
};

export const registerUsers = async (req, res) => {
  let password = "";
  try {
    password = await decryptPassword(req.body.password);
  } catch (error) {
    errorLog(error);
    return res.status(500).json({
      message: error.message,
    });
  }
  const user = new User({
    _id: mongoose.Types.ObjectId(),
    ...req.body,
    key: randomString(Number(process.env.KEY_LENGTH)),
    password: password,
  });
  try {
    const savedUser = await user.save();
    return res.status(201).json({
      data: savedUser,
      token: createJwtToken(savedUser._id, "1d"),
      refresh: createJwtToken(savedUser._id, "30d"),
    });
  } catch (error) {
    errorLog(error);
    return res.status(400).json({ message: error.message });
  }
};

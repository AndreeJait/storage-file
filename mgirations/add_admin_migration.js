import mongoose from "mongoose";
import User from "../model/User.js";
import { decryptPassword } from "../utils/controller_utils";
import { errorLog, printLog } from "../utils/logger.js";

export const addAdminMigration = async () => {
  try {
    let password = await decryptPassword("ITDEL2309");
    await User({
      _id: mongoose.Types.ObjectId(),
      email: "berlianasimamora@gmail.com",
      password: password,
      name: "Berliana Simamora",
      address: "Tarutung",
      role: "Admin",
    }).save();
    await User({
      _id: mongoose.Types.ObjectId(),
      email: "yohanasihombing@gmail.com",
      password: password,
      name: "Yohana Sihombing",
      address: "Tarutung",
      role: "Marketing",
    }).save();
    await User({
      _id: mongoose.Types.ObjectId(),
      email: "agusrokyanto@gmail.com",
      password: password,
      name: "Agus Rokyanto",
      address: "Tarutung",
      role: "Consumer",
    }).save();
    printLog("add new user");
  } catch (error) {
    errorLog(error);
  }
};

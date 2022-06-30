import mongoose from "mongoose";
import User from "../model/User.js";
import { errorLog } from "../utils/logger.js";

export default async (req, res, next) => {
  try {
    const key = req.query.key;
    const id = req.query.id;
    if (id !== undefined && key !== undefined) {
      let user = await User.findById(mongoose.Types.ObjectId(id));
      let email = req.url.split("/")[1];
      if (key === user.key && email === user.email) {
        next();
      } else {
        throw Error("Key not same");
      }
    } else {
      throw Error("Key or Id not found");
    }
  } catch (error) {
    errorLog(error);
    return res.status(401).json({
      message: "Auth Failed",
      error: error.message,
    });
  }
};

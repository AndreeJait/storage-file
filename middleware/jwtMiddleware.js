import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import User from "../model/User.js";
import { errorLog } from "../utils/logger.js";
export default async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    req.generate = {
      id: decoded.id,
    };
    let user = await User.findById(mongoose.Types.ObjectId(decoded.id));
    req.foldername = user.email;
    next();
  } catch (error) {
    errorLog(error);
    return res.status(401).json({
      message: "Auth Failed",
      error: error.message,
    });
  }
};

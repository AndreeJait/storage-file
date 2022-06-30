import mongoose from "mongoose";
import Storage from "../model/Storage.js";
import fs from "fs";
import { promisify } from "util";
const unlinkAsync = promisify(fs.unlink);
export const uploadMultipleFile = async (req, res) => {
  try {
    let files = [];
    req.files.forEach((element) => {
      files.push(
        new Storage({
          _id: mongoose.Types.ObjectId(),
          link: element.path,
          createdBy: req.generate.id,
          fileName: element.originalname,
          size: element.size,
          canAccessBy: req.body.canAccessBy || [],
        })
      );
    });

    let result = await Storage.bulkSave(files);
    let ids = result.getInsertedIds().map((item) => item._id);
    let lastInserted = await Storage.find({ _id: { $in: ids } });
    res.status(201).json({
      result: result,
      message: "Successfully to inserts all your files",
      data: lastInserted,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      error: error,
    });
  }
};

export const getAllFile = async (req, res) => {
  try {
    const key = req.query.key || "";
    const skip = Number(req.query.skip) || 0;
    const limit = Number(req.query.limit) || 20;
    let result = await Storage.find({
      fileName: { $regex: `.*${key}.*` },
      createdBy: mongoose.Types.ObjectId(req.generate.id),
    })
      .populate("canAccessBy")
      .populate("createdBy")
      .skip(skip)
      .limit(limit);
    res.status(200).json({
      message: "Successfully to get your data",
      data: result,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      error: error,
    });
  }
};

export const deleteRawFiles = async (req, res) => {
  try {
    let ids = [...req.body.ids];
    ids.forEach((item, index) => {
      ids[index] = mongoose.Types.ObjectId(item);
    });
    let result = await Storage.find({ _id: { $in: ids } });
    let deleted = await Storage.deleteMany({ _id: { $in: ids } });
    result.forEach((item) => {
      unlinkAsync("./" + item.link);
    });
    res.status(202).json({
      result: deleted,
      data: result,
      message: "Successfully to delete all your data.",
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      error: error,
    });
  }
};

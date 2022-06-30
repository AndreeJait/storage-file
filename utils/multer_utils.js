import multer from "multer";
import fs from "fs";
import path from "path";
export const createMulterDisk = (destination) => {
  return multer.diskStorage({
    destination: function (req, res, cb) {
      let path = "./public/" + destination + "/";
      fs.mkdirSync(path, { recursive: true });
      cb(null, path);
    },
    filename: function (req, file, cb) {
      var today = new Date();
      var timeStr =
        today.getTime().toString() +
        (Math.random() + 1).toString(36).substring(7);
      cb(null, timeStr + path.extname(file.originalname));
    },
  });
};

export const createMulterDiskEmail = () => {
  return multer.diskStorage({
    destination: function (req, res, cb) {
      let path = "./public/" + req.foldername + "/";
      fs.mkdirSync(path, { recursive: true });
      cb(null, path);
    },
    filename: function (req, file, cb) {
      var today = new Date();
      var timeStr =
        today.getTime().toString() +
        (Math.random() + 1).toString(36).substring(7);
      cb(null, timeStr + "-" + file.originalname);
    },
  });
};

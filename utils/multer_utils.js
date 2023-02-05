import multer from "multer";
import fs from "fs";
import path from "path";
import {v4} from "uuid";

export const createMulterDisk = (destination) => {
    return multer.diskStorage({
        destination: function (req, res, cb) {
            let path = "./public/" + destination + "/";
            fs.mkdirSync(path, {recursive: true});
            cb(null, path);
        },
        filename: function (req, file, cb) {
            if (req.body.filename) {
                let uniq = v4();
                cb(null, uniq + "_" + path.extname(file.originalname));
            } else {
                let today = new Date();
                let timeStr =
                    today.getTime().toString() +
                    (Math.random() + 1).toString(36).substring(7);
                cb(null, timeStr + path.extname(file.originalname));
            }
        },
    });
};

export const createMulterDiskEmail = () => {
    return multer.diskStorage({
        destination: function (req, res, cb) {
            let checkDir = req.body["is_public"] === "True" ? "public" : "private";
            let path = `./storage/${checkDir}/${req.foldername}/`;
            if (req.body.subfolder) {
                path += req.body.subfolder + "/";
            }
            fs.mkdirSync(path, {recursive: true});
            cb(null, path);
        },
        filename: function (req, file, cb) {
            if (req.body.filename) {
                let uniq = v4();
                let fileName = uniq + "_" + req.body.filename;
                req.newFileName = fileName;
                cb(null, fileName);
            } else {
                let today = new Date();
                let timeStr =
                    today.getTime().toString() +
                    (Math.random() + 1).toString(36).substring(7);
                let fileName = timeStr + path.extname(file.originalname);
                req.newFileName = fileName;
                cb(null, fileName);
            }
        },
    });
};

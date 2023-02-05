import mongoose from "mongoose";
import Storage from "../model/Storage.js";
import fs from "fs";
import {promisify} from "util";
import {response200, responseError} from "../utils/response.js";
import {decryptPassword} from "../utils/controller_utils.js";

const unlinkAsync = promisify(fs.unlink);

export const getAllFile = async (req, res) => {
    try {
        const key = req.query.key || "";
        const skip = Number(req.query.skip) || 0;
        const limit = Number(req.query.limit) || 20;
        let result = await Storage.find({
            fileName: {$regex: `.*${key}.*`},
            createdBy: mongoose.Types.ObjectId(req.generate.id),
        })
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
        let result = await Storage.find({_id: {$in: ids}});
        let deleted = await Storage.deleteMany({_id: {$in: ids}});
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

export const uploadFile = async (req, res) => {
    try {
        const userID = req.generate.id;
        const file = req.file;
        const storage = new Storage({
            _id: mongoose.Types.ObjectId(),
            link: file.path,
            fileName: req.newFileName,
            isPublic: req.body["is_public"] === "True",
            createdBy: userID,
            size: file.size,
        });
        let saved = await storage.save();
        let signUrl = file.path;
        if (req.body["is_public"] !== "True") {
            let key = await decryptPassword(req.generate.key);
            signUrl += "?key=" + key + "&email=" + req.generate.email;
        }
        return res.status(200).json(response200({
            data: {
                object_name: saved.fileName,
                url: signUrl,
            }
        }))
    } catch (error) {
        return res.status(500).json(responseError({
            error: error,
            message: "Internal server error"
        }))
    }
}

export const signUrl = async (req, res) => {
    try {
        let objectName = req.body["object_name"];
        let file = await Storage.findOne({fileName: objectName});
        if (!file) {
            return res.status(404).json(responseError(
                {
                    message: "file not found", error: new Error("File not found")
                }
            ));
        }
        let signUrl = file.link;
        if (req.body["is_public"] !== "True") {
            let key = await decryptPassword(req.generate.key);
            signUrl += "?key=" + key + "&email=" + req.generate.email;
        }
        return res.status(200).json(response200({
            data: {
                object_name: file.fileName,
                url: signUrl,
            }
        }));
    } catch (error) {
        return res.json(500).json(responseError({
            error: error,
            message: "Internal server error"
        }))
    }
}
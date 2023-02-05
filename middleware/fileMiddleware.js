import mongoose from "mongoose";
import User from "../model/User.js";
import {errorLog, printLog} from "../utils/logger.js";
import AccessKey from "../utils/accessKey.js";
import {comparePassword} from "../utils/controller_utils.js";

export default async (req, res, next) => {
    try {
        const email = req.query.email;
        const key = req.query.key;
        if (!AccessKey.access.hasOwnProperty(email)) {
            return res.status(401).json({
                message: "Auth Failed",
                error: "your key is not register",
            });
        }
        const savedKey = AccessKey.access[email].key;
        const compare = await comparePassword(savedKey, key);
        if (!compare) {
            return res.status(401).json({
                message: "Auth Failed",
                error: "you don't have access to this folder",
            });
        }
        const folderName = email;
        let folderAccess = req.url.split("/")[1];
        if (folderName.toLowerCase() !== folderAccess.toLowerCase()) {
            return res.status(401).json({
                message: "Auth Failed",
                error: "you don't have access to this folder",
            });
        }
        req.generate = {
            email: email,
            id: AccessKey.access[email].id,
            key: AccessKey.access[email].email,
        };
        next();
    } catch (error) {
        errorLog(error);
        return res.status(401).json({
            message: "Auth Failed",
            error: error.message,
        });
    }
};

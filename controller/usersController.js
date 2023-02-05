import mongoose from "mongoose";
import User from "../model/User.js";
import {
    comparePassword, createJwtToken, decryptPassword,
} from "../utils/controller_utils.js";
import {errorLog} from "../utils/logger.js";
import AccessKey from "../utils/accessKey.js";
import {v4 as uuidv4} from "uuid";
import {response200, responseError} from "../utils/response.js";

export const getRefreshJWT = async (req, res) => {
        try {
            let _id = req.body.generate;
            let user = await User.findOne({_id: mongoose.Types.ObjectId(_id)});
            return res.status(200).json(response200({
                data: {
                    token: createJwtToken(user._id, "1d"), refresh: createJwtToken(user._id, "30d"),
                }
            }));
        } catch (error) {
            return res.status(404).json(responseError({message: "user not found", error: error}));
        }
    }
;

export const loginUsers = async (req, res) => {
    try {
        let user = await User.findOne({email: req.body.email});
        if (!user) {
            return res.status(404).json(responseError(
                {
                    message: "user not found", error: new Error("User not found")
                }
            ));
        }
        let compare = await comparePassword(req.body.password, user.password);
        if (compare) {
            return res.status(200).json(response200({
                data: {
                    user: user, token: createJwtToken(user._id, "1d"), refresh: createJwtToken(user._id, "30d"),
                }
            }));
        } else {
            return res.status(401).json(responseError({
                error: Error("password or email wrong"), message: "password or email wrong"
            }));
        }
    } catch (error) {
        return res.status(404).json(responseError({
            error: error, message: "resource not found"
        }));
    }
};

export const registerUsers = async (req, res) => {
    let password = "";
    let key = "";
    try {
        password = await decryptPassword(req.body.password);
        key = uuidv4();
    } catch (error) {
        errorLog(error);
        return res.status(500).json(responseError({
            error: error, message: "Internal server error",
        }));
    }
    const user = new User({
        _id: mongoose.Types.ObjectId(), ...req.body, key: key, password: password,
    });
    try {
        const savedUser = await user.save();
        AccessKey.access[savedUser.email] = {
            key: savedUser.key,
            id : savedUser._id,
        };
        return res.status(201).json(response200({
            data: {
                user: savedUser,
                token: createJwtToken(savedUser._id, "1d"),
                refresh: createJwtToken(savedUser._id, "30d"),
            }
        }));
    } catch (error) {
        errorLog(error);
        return res.status(400).json(responseError({
            error: error, message: "bad request"
        }));
    }
};

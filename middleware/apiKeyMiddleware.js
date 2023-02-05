import {errorLog, printLog} from "../utils/logger.js";
import AccessKey from "../utils/accessKey.js";

export default async (req, res, next) => {

    try {
        const key = req.query.key;
        const email = req.query.email;
        if (!AccessKey.access.hasOwnProperty(email)) {
            return res.status(401).json({
                message: "Auth Failed",
                error: "you are not registered",
            });
        }
        if (AccessKey.access[email].key !== key) {
            return res.status(401).json({
                message: "Auth Failed",
                error: "your api key is wrong",
            });
        }
        req.generate = {
            email: email,
            id: AccessKey.access[email].id,
            key: key,
        };
        req.foldername = email;
        next();
    } catch (error) {
        errorLog(error);
        return res.status(401).json({
            message: "Auth Failed",
            error: error.message,
        });
    }
};

import User from "../model/User.js";
import {errorLog, printLog} from "./logger.js";

class AccessKey {
    static access = {};

    static async init() {
        try {
            let users = await User.find({});
            users.forEach((item) => {
                AccessKey.access[item.email] = {
                    key: item.key,
                    id: item._id,
                };
            });
            printLog("Success to setup access");
        } catch (err) {
            errorLog("Failed to create access, please restart server");
        }
    }
}

export default AccessKey;
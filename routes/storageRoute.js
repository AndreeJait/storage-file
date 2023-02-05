import {Router} from "express";
import multer from "multer";
import {
    deleteRawFiles,
    getAllFile, signUrl, uploadFile,
} from "../controller/storageController.js";
import jwtMiddleware from "../middleware/jwtMiddleware.js";
import {
    createMulterDisk,
    createMulterDiskEmail,
} from "../utils/multer_utils.js";
import apiKeyMiddleware from "../middleware/apiKeyMiddleware.js";

const router = Router();

const storage = createMulterDiskEmail();
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 300,
    },
});

router.post("/upload", apiKeyMiddleware, upload.single("file"), uploadFile);
router.post("/sign", apiKeyMiddleware, signUrl)
router.get("/mine", jwtMiddleware, getAllFile);
router.post("/delete", jwtMiddleware, deleteRawFiles);
export default router;

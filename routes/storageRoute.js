import { Router } from "express";
import multer from "multer";
import {
  deleteRawFiles,
  getAllFile,
  uploadMultipleFile,
} from "../controller/storageController.js";
import jwtMiddleware from "../middleware/jwtMiddleware.js";
import {
  createMulterDisk,
  createMulterDiskEmail,
} from "../utils/multer_utils.js";

const router = Router();

const storage = createMulterDiskEmail();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 100,
  },
});

router.post(
  "/multiple",
  jwtMiddleware,
  upload.array("files"),
  uploadMultipleFile
);
router.get("/mine", jwtMiddleware, getAllFile);
router.post("/delete", jwtMiddleware, deleteRawFiles);
export default router;

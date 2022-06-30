import { Router } from "express";
import {
  getRefreshJWT,
  loginUsers,
  registerUsers,
} from "../controller/usersController.js";
import jwtMiddleware from "../middleware/jwtMiddleware.js";

const router = Router();

router.post("/login", loginUsers);
router.post("/register", registerUsers);
router.get("/refresh", jwtMiddleware, getRefreshJWT);

export default router;

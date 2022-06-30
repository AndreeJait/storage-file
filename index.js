import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { createWriteStream } from "fs";
import ip from "ip";
import morgan from "morgan";
import fileMiddleware from "./middleware/fileMiddleware.js";
import router from "./routes/index.js";
import { connectToDatabase } from "./utils/db.js";
import { printLog } from "./utils/logger.js";
dotenv.config();
const app = express();

const ipaddress = ip.address();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(morgan("dev"));
app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);
app.use(bodyParser.json());
app.use(
  morgan("common", {
    stream: createWriteStream("access.log", {
      flags: "a",
    }),
  })
);

connectToDatabase(process.env.MONGO_URI);

app.use("/public", fileMiddleware, express.static("public"));

app.use("/auth", router.USER_ROUTE);
app.use("/storage", router.STORAGE_ROUTE);
app.use((req, res, next) => {
  const err = new Error("End point not found");
  err.status = 404;
  next(err);
});
app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message,
    },
  });
});
const server = app.listen(PORT, () => {
  printLog(`Server running at http://${ipaddress}:${PORT}`);
});

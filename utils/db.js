import mongoose from "mongoose";
import { errorLog, printLog } from "./logger.js";

const connectToDatabase = async (URI) => {
  mongoose.connect(URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  const db = mongoose.connection;
  db.on("error", (error) => {
    errorLog(error);
  });
  db.on("open", () => printLog("Database connected"));
};

export { connectToDatabase };

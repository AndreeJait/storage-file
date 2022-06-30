import { createServer } from "http";
import { Server } from "socket.io";
import { printLog } from "./utils/logger.js";
import dotenv from "dotenv";
import { connectToDatabase } from "./utils/db.js";
dotenv.config();

connectToDatabase(process.env.MONGO_URI);

const httpServer = createServer();
const io = new Server(httpServer, {
  // options
});
let count = 1;
io.on("connection", (socket) => {});

const PORT = process.env.PORT_SOCKET;
httpServer.listen(PORT, function () {
  printLog(`Socket connect to port ${PORT}`);
});

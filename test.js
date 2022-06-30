import { io } from "socket.io-client";

const socket = io("ws://localhost:5001");

socket.on("notification", (args) => {
  console.log(args);
});

socket.on("id", (args) => {
  if (args === 3) {
    socket.emit("kick");
  }
  console.log(args);
});

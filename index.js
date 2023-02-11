const express = require("express");
const app = express();
const cors = require("cors");
const httpServer = require("https").Server(app);
const PORT = process.env.PORT || 4000;
const socketIO = require("socket.io")(httpServer, {
  cors: {
    origin: "https://metachat2-0.vercel.app/",
    methods: ["GET", "POST"],
  },
  allowEIO3: true,
});

app.use(cors());
let users = [];

socketIO.on("connection", (socket) => {
  console.log(`⚡: ${socket.id} user just connected!`);
  socket.on("message", (data) => {
    socketIO.emit("messageResponse", data);
  });

  socket.on("typing", (data) => socket.broadcast.emit("typingResponse", data));

  socket.on("newUser", (data) => {
    users.push(data);
    socketIO.emit("newUserResponse", users);
  });

  socket.on("disconnect", () => {
    console.log("🔥: A user disconnected");
    users = users.filter((user) => user.socketID !== socket.id);
    socketIO.emit("newUserResponse", users);
    socket.disconnect();
  });
});

app.get("/api", (req, res) => {
  res.json({ message: "Hello" });
});

httpServer.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});

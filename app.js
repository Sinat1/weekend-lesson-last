const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

require("dotenv").config();

const app = express();

app.use(cors());

const { PORT, HOST_URI } = process.env;
const { findAllMessages, createMessage } = require("./services/messageFunc");
const http = require("http").Server(app);
mongoose.connect(HOST_URI, () => console.log("Database connection successful"));
// const socket = require("socket.io")(http, {
//   cors: {
//     origin: "http://localhost:8080/",
//   },
// });
// const socket = require("socket.io")(http, {
//   cors: {
//     origin: "https://weekend-lesson-last-frontend.onrender.com",
//   },
// });
const socket = require("socket.io")(http);
global.usersOnline = new Map();
socket.on("connection", async (client) => {
  client.on("Add new user", async (name) => {
    usersOnline.set(client.id, name);
    client.emit("Changed online", usersOnline.size);
    client.broadcast.emit("Changed online", usersOnline.size);
    const messagesList = await findAllMessages();
    client.emit("fetch messages", messagesList);
  });
  client.on("New Message", async (message) => {
    const res = await createMessage(message);
    client.broadcast.emit("Update message list", res);
    client.emit("Update message list", res);
  });
  client.on("disconnect", () => {
    usersOnline.delete(client.id);
    client.broadcast.emit("Changed online", usersOnline.size);
  });
});

http.listen(PORT, () => console.log("Server is running on port 3001"));

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

require("dotenv").config();

const app = express();

app.use(cors());

const { PORT } = process.env;

const http = require("http").Server(app);

// const socket = require("socket.io")(http, {
//   cors: {
//     origin: "http://localhost:8080/",
//   },
// });
const socket = require("socket.io")(http);
global.usersOnline = new Map();
socket.on("connection", (client) => {
  console.log("connection");
  usersOnline.set(client.id, client.id);
  client.emit("Changed online", usersOnline.size);
  client.broadcast.emit("Changed online", usersOnline.size);
});

http.listen(PORT, () => console.log("Server is running on port 3001"));

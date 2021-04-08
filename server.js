const express = require("express");
const socketio = require("socket.io");
const http = require("http");
const cors = require("cors");

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = socketio(server, {
  cors: {
    methods: ["GET", "POST"],
    credential: true,
  },
});

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET",
    "DELETE",
    "PUT",
    "POST",
    "PATCH"
  );
  next();
});

//Socket Logic

io.on("connection", (socket) => {
  console.log("We have a new connection!!!");

  // Receive data from client side and than pass to all connected connection
  socket.on("message", (msg) => {
    socket.broadcast.emit("message", msg);
  });

  socket.on("joinedUsers", (username) => {
    socket.broadcast.emit("joinedUsers", username);
    console.log(username);
  });

  socket.on("disconnectUser", (name) => {
    console.log("Disconnect!!!", name);
  });
});

//Express Middlware
app.get("/", (req, res, next) => {
  res.send("Server from server side");
});
// Server Listener

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => console.log(`App listen at ${PORT}...`));

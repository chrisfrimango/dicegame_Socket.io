const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

const port = 3000;

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());

io.on("connection", (socket) => {
  console.log(`a client with id ${socket.id} connected`);

  socket.on("chatMessage", (msg) => {
    console.log(`message: " ${msg.user} : ${msg.message}`);
    io.emit("newChatMessage", { user: msg.user, message: msg.message });
  });

  socket.on("diceScore", (msg) => {
    console.log(`Score: ${msg.user} : ${msg.score}`);
    io.emit("newDiceScore", { user: msg.user, score: msg.score });
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

const dicegameRoutes = require("./routes/dicegameRoutes");

app.use(dicegameRoutes);

const connectionDB = require("./config/connectionDB");
connectionDB();

server.listen(port, () => {
  console.log(`Socekt IO server running at http://localhost:${port}`);
});

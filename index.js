const app = require("express")();
const server = require("http").Server(app);
const io = require("socket.io")(server);

const port = 7001;

server.listen(port, () => console.log(`server is running on ${port}`));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

app.get("/javascript", (req, res) => {
  res.sendFile(__dirname + "/public/javascript.html");
});

app.get("/swift", (req, res) => {
  res.sendFile(__dirname + "/public/swift.html");
});

app.get("/css", (req, res) => {
  res.sendFile(__dirname + "/public/css.html");
});

const techIo = io.of("/tech");

techIo.on("connection", (socket) => {
  console.log("user connected");
  socket.on("join", ({ msg, room }) => {
    socket.join(room);
    techIo
      .in(room)
      .emit("proceedMsgFromServer", `new user joined ${room} room`);
  });
  socket.on("rowMsgFromClient", ({ msg, room }) => {
    techIo.in(room).emit("proceedMsgFromServer", msg);
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
    techIo.emit("proceedMsgFromServer", "user disconnected");
  });
});

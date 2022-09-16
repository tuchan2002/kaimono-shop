require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const fileUpload = require("express-fileupload");
const cookieParser = require("cookie-parser");
const Comments = require("./models/commentModel");
const path = require("path");

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: ["http://localhost:3000"],
    credentials: true,
  })
);
app.use(
  fileUpload({
    useTempFiles: true,
  })
);
// socketio
const http = require("http").createServer(app);
const io = require("socket.io")(http);
let users = [];
io.on("connection", (socket) => {
  console.log(socket.id + " connected!");

  // lang nghe du lieu tu client
  socket.on("joinRoom", ({ userId, roomId }) => {
    console.log("userId, roomId ", userId, roomId);
    const user = { userId: userId, roomId: roomId };
    console.log(0, users);
    const check = users.every((user) => user.userId !== userId);
    console.log("check", check);
    if (check) {
      users.push(user);
      console.log(1);
      socket.join(user.roomId); // user hien tai se join vao room
    } else {
      users.map((user) => {
        if (user.userId === userId) {
          console.log(0.5);
          if (user.roomId !== roomId) {
            socket.leave(user.roomId);
            console.log(2);
            socket.join(roomId);
            user.roomId = roomId;
          }
        }
      });
    }
    console.log("users array", users);
    console.log(socket.adapter.rooms);
  });

  socket.on("createComment", async (data) => {
    console.log("datadata", data);
    const { name, content, product_id, createdAt, star } = data;

    const newComment = new Comments({
      name,
      content,
      product_id,
      createdAt,
      star,
    });

    await newComment.save();
    console.log("newComment.product_id", newComment.product_id);
    console.log("users array", users);
    console.log(socket.adapter.rooms);

    io.to(newComment.product_id).emit("sendCommentToClient", newComment);
  });

  socket.on("disconnect", () => {
    console.log(socket.id + " disconnected!");
  });
});

// Connect to mongodb
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("mongodb connected");
  } catch (error) {
    console.log(error.message);
    process.exit(1);
  }
};
connectDB();

app.use("/user", require("./routes/userRouter"));
app.use("/api", require("./routes/categoryRouter"));
app.use("/api", require("./routes/upload"));
app.use("/api", require("./routes/productRouter"));
app.use("/api", require("./routes/commentRouter"));
app.use("/api", require("./routes/paymentRouter"));

if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "client", "build", "index.html"));
  });
}

const PORT = process.env.PORT || 5000;
http.listen(PORT, () => {
  console.log(`Server ready at http://localhost:${PORT}`);
});

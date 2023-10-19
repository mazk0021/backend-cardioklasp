const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const mongoose = require("mongoose");
const app = express();
const AuthenticationRouter = require("./routes/authentication");
const UserRouter = require("./routes/user");
const AdminRouter = require("./routes/admin");
const ConversationRouter = require("./routes/conversation");
const MessageRouter = require("./routes/message");
const DoctorRouter = require("./routes/doctor");
const AppointmentRouter = require("./routes/appointment");
const ReportsRouter = require("./routes/Reports");
const PaymentsRouter = require("./routes/payments");
const asynchandler = require("express-async-handler");

const predictionRouter = require("./routes/prediction");
const { notFound, errorHandler } = require("./middlewares/errorHandling");
const cors = require("cors");
const { Server } = require("socket.io");
app.use(cors());

const mongoURL = process.env.MONGODB_URL;

mongoose
  .connect(mongoURL, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  })
  .then((res) => {
    console.log("connection success");
  })
  .catch((err) => {
    console.log("connection error", err);
  });

app.get("/", (req, res) => {
  res.send("hey");
});

const server = app.listen(3000, () => {
  console.log("server listening at 3000");
});

const io = new Server(server, {
  cors: {
    origin: "*", // Replace with your client's URL
    methods: ["GET", "POST"],
  },
});
app.use(express.json());
app.use("/authentication", AuthenticationRouter);
app.use("/user", UserRouter);
app.use("/report", ReportsRouter);
app.use("/admin", AdminRouter);
app.use("/conversation", ConversationRouter);
app.use("/message", MessageRouter);
app.use("/doctor", DoctorRouter);
app.use("/appointment", AppointmentRouter);
app.use("/payments", PaymentsRouter);
app.use("/predict", predictionRouter);

app.use(notFound);
app.use(errorHandler);

let users = [];

const addUser = asynchandler((userId, name, socketId, role) => {
  users.every((user) => user.userId !== userId) &&
    users.push({
      userId,
      name,
      socketId,
      role,
    });
  console.log("users are ", users);
});

const removeUser = asynchandler((socketId) => {
  users = users.filter((user) => user.socketId !== socketId);
});

const getUser = asynchandler((userId) =>
  users.find((user) => user.userId === userId)
);

io.on("connection", (socket) => {
  console.log("a user connected");

  socket.on("addUser", (userId, name, role) => {
    console.log("add user called", userId, name, role);
    addUser(userId, name, socket.id, role);
    io.emit("getAllOnlineUsers", { users: users });
  });

  socket.on("sendMessage", ({ userId, userName, receiverID, message }) => {
    console.log("receiverid git ===", userId, userName, receiverID, message);
    const receiver = getUser(receiverID);
    console.log("receiver===", receiver);
    io.to(receiver.socketId).emit("getMessage", {
      data: {
        sender: {
          _id: userId,
          name: userName,
        },
        message: message,
      },
    });
  });

  socket.on("disconnect", () => {
    console.log("User Disconnected");
    removeUser(socket.id);
    io.emit("getAllOnlineUsers", { users: users });
  });
});

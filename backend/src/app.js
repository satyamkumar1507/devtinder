const express = require('express');

 const connectDB  =  require("./config/database");
const app = express();
const cookieParser = require("cookie-parser");
const cors = require("cors");
const http = require("http");

require("dotenv").config();
require("./utils/cronjob");
app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
 

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/requests");
const userRouter = require("./routes/user");
const paymentRouter = require("./routes/payment");
const chatRouter = require("./routes/chat")
const initializeSocket = require("./utils/socket");

app.use("/",authRouter);
app.use("/",profileRouter);
app.use("/",requestRouter);
app.use("/",userRouter);
app.use("/", paymentRouter);
app.use("/",chatRouter);

const server = http.createServer(app);
initializeSocket(server);


connectDB()
    .then(() => {
        console.log("Database is connected successfully !!!");
        server.listen(3000,() => {
    console.log("server is running on port 3000...");
});
    })
    .catch((err) => {
        console.log("Database is not connected !!");
        console.error("Reason:", err.message);
    })



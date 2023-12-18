const { PrismaClient } = require("@prisma/client");
const express = require("express");
const authRouter = require("./routers/auth");
const postsRouter = require("./routers/posts");
const userRouter = require("./routers/user");
const cors = require("cors");
require("dotenv").config();


const app = express();
app.use(express.json()); // JSONボディを解析するために必要
const PORT = 8080;

app.use(cors());
app.use("/api/auth", authRouter);
app.use("/api/posts", postsRouter);
app.use("/api/users", userRouter);


app.listen(PORT, () => console.log(`server running on port ${PORT}`));
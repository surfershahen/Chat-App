import path from "path";
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import connectToMongoDB from "./db/connectToMongoDB.js";
//IMPORT ROUTES
import authRoutes from "./routes/auth.js";
import messageRoutes from "./routes/message.js";
import userRoutes from "./routes/user.js";
import { app, server } from "./socket/socket.js";

// const app = express();
const port = process.env.PORT || 8000;

const __dirname = path.resolve();

dotenv.config();

app.use(express.json()); // to parse the incoming request with JSON payload
app.use(cookieParser()); // to parse the incoming cookies from req.cookies

//route for authentication
// app.get("/api/auth/signup", (req, res) => {
//   console.log("signup route");
// });

// app.get("/api/auth/login", (req, res) => {
//   console.log("login route");
// });
// app.get("/api/auth/logout", (req, res) => {
//   console.log("logout route");
// });
//using middleware thats whenever we visit this route /api/auth we will calling authRoutes

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/users", userRoutes);

app.use(express.static(path.join(__dirname, "/frontend/dist")));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend", "dist", "index.html"));
});

server.listen(port, () => {
  connectToMongoDB();
  console.log(`Server listening on port ${port}`);
});

import express from "express";
import { signup, login, logout } from "../controllers/auth.controller.js";

const router = express.Router();

// using controllers instead
// router.get("/signup", (req, res) => {
//   res.send("signup here");
// });
// router.get("/login", (req, res) => {
//   res.send("login here");
// });
// router.get("/logout", (req, res) => {
//   res.send("logout here");
// });

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);

export default router;

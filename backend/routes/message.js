import express from "express";
import { sendMessage, getMessages } from "../controllers/message.controller.js";
import protectRoute from "../middleware/protectRoute.js";
const router = express.Router();

//:id will be the user that would like to send message
// AUTHORIZATION-PROCESS:
//protectRoute: before run the sendMessage function check if user is logged
//or not, protect this route before u act
router.get("/:id", protectRoute, getMessages);
router.post("/send/:id", protectRoute, sendMessage);

export default router;

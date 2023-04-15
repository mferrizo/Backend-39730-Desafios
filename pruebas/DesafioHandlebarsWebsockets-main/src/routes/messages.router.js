import { Router } from "express";
import MessageManager from "../dao/dbManagers/MessageManager.js";

const router = Router();
const messageManager = new MessageManager();

router.get("/", async (req, res) => {
  const messages = await messageManager.getMessages();
  if (!messages) {
    return res
      .status(400)
      .send({ status: "error", error: "Get collection error" });
  } else {
    return res.send({ messages });
  }
});

router.post("/", async (req, res) => {
  const message = req.body;
  const messages = await messageManager.addMessage(message);
  if (!messages) {
    return res
      .status(400)
      .send({ status: "error", error: "Add message error" });
  } else {
    return res.send({ messages });
  }
});

export default router;

import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";
import { getReceiverSocketId, io } from "../socket/socket.js";

export const sendMessage = async (req, res) => {
  try {
    //Getting the Message From User As An Input
    const { message } = req.body;
    //Getting The Sender Id from params
    const { id: receiverId } = req.params;
    //Getting The Sender Id from request user because we add the protectRoute middleware
    const senderId = req.user._id;
    //check to find this conversation between Tow Users
    let conversation = await Conversation.findOne({
      //find conversation where participant array includes all these fields [senderId, receiverId]
      participants: { $all: [senderId, receiverId] },
    });

    //here conversation can be null if this the first conversation between Tow Users
    //if not exists we create new one
    if (!conversation) {
      conversation = await Conversation.create({
        participants: [senderId, receiverId],
      });
    }

    //create new Message
    const newMessage = new Message({
      senderId,
      receiverId,
      message,
    });

    // if newMessage created add the message._ID  to the conversation.messages array
    if (newMessage) {
      conversation.messages.push(newMessage._id);
    }

    //SOCKET IO FUNCTIONALITY WILL GO HERE

    // await conversation.save();
    // await newMessage.save();

    // The above two lines can be replaced with following line
    //this will run in parallel
    await Promise.all([conversation.save(), newMessage.save()]);

    // /SOCKET TO FUNCTIONALITY WILL GO HERE
    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      //io.to(<socket._id>).emit() used to send event to specific client
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    //send it as response
    res.status(201).json(newMessage);
  } catch (error) {
    console.log("Error in sendMessage controller", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getMessages = async (req, res) => {
  try {
    //the user we're chatting with and we'll click to get messages between them
    const { id: userToChatId } = req.params;
    const senderId = req.user._id;

    // find the conversation between the users
    //using populate: Instead of getting references we have an object that is the message
    const conversation = await Conversation.findOne({
      participants: { $all: [senderId, userToChatId] },
    }).populate("messages"); //NOT REFERENCE BUT ACTUAL MESSAGE

    if (!conversation) return res.status(200).json([]);

    //update
    const messages = conversation.messages;

    res.status(200).json(messages);
  } catch (error) {
    console.log("Error in GetMessage controller", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

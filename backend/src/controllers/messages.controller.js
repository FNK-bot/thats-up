import cloudinary from "../lib/cloudinary.config.js";
import { getReceiverSocketId, io } from "../lib/socket.js";
import { bufferToDataURI } from "../lib/utils.js";
import Message from "../models/message.modal.js";
import User from "../models/user.modal.js";

export const getUsersForSidebar = async (req, res) => {
  try {
    const loggedUserId = req.user.id;
    const filteredUsers = await User.find({
      id: { $ne: loggedUserId },
    }).select("fullName profilePic onlineStatus");
    res
      .status(200)
      .json({ message: "Fetched users for sidebar", filteredUsers });
  } catch (error) {
    console.error("Get users error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getMessagesBetweenUsers = async (req, res) => {
  try {
    const loggedUserId = req.user.id;
    const senderId = req.params.id;
    const messages = await Message.find({
      $or: [
        { senderId: loggedUserId, receiverId: senderId },
        { senderId: senderId, receiverId: loggedUserId },
      ],
    });
    res.status(200).json({ message: "Fetched messages", messages });
  } catch (error) {
    console.error("Get messages error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { text } = req.body;
    const senderId = req.user.id;
    const receiverId = req.params.id;
    let newMessage = [];
    if (!receiverId)
      res.status(400).json({ message: "Receiver ID is required" });

    if (text) {
      newMessage = new Message({
        senderId,
        receiverId,
        text,
      });
      await newMessage.save();
    }
    if (req.file) {
      const fileDataURI = bufferToDataURI(req.file);
      const uploadedImageResponse = await cloudinary.uploader.upload(
        fileDataURI,
        { folder: "message_images" }
      );
      newMessage = new Message({
        senderId,
        receiverId,
        image: uploadedImageResponse.secure_url,
      });
      await newMessage.save();
    }
    res.status(200).json({ message: "Message sent", messages: newMessage });
    if (req.file || text) {
      const receiverSocketId = getReceiverSocketId(receiverId);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("newMessage", newMessage);
      }
    }
    // res.status(400).json({ message: "Pls add text or image", newMessage });
  } catch (error) {
    console.error("Send message error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

import catchAsync from "../middlewares/catchAsync.js";
import Message from "../models/messageModel.js";
import Chat from "../models/chatModel.js";

// Send New Message
export const newMessage = catchAsync(async (req, res, next) => {
  const { chatId, content } = req.body;

  const msgData = {
    sender: req.user._id,
    chatId,
    content,
  };

  const newMessage = await Message.create(msgData);

  await Chat.findByIdAndUpdate(chatId, { latestMessage: newMessage });

  res.status(200).json({
    success: true,
    newMessage,
  });
});

// Get All Messages
export const getMessages = catchAsync(async (req, res, next) => {
  const messages = await Message.find({
    chatId: req.params.chatId,
  });

  res.status(200).json({
    success: true,
    messages,
  });
});

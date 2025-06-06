import catchAsync from "../middlewares/catchAsync.js";
import Chat from "../models/chatModel.js";

// Create New Chat
export const newChat = catchAsync(async (req, res, next) => {
  const chatExists = await Chat.findOne({
    users: {
      $all: [req.user._id, req.body.receiverId],
    },
  });

  if (chatExists) {
    return res.status(200).json({
      success: true,
      newChat: chatExists,
    });
  }

  const newChat = await Chat.create({
    users: [req.user._id, req.body.receiverId],
  });

  res.status(200).json({
    success: true,
    newChat,
  });
});

// Get All Chats
export const getChats = catchAsync(async (req, res, next) => {
  const chats = await Chat.find({
    users: {
      $in: [req.user._id],
    },
  })
    .sort({ updatedAt: -1 })
    .populate("users latestMessage");

  res.status(200).json({
    success: true,
    chats,
  });
});

const expressAsyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const Message = require("../models/messageModel");
const generateToken = require("../config/generateToken");
const connectionMap = require("../store/connectionMap");
const connection = require("../config/redisConnection");
const queue = require("../config/queue"); // This is the message-queue named "notificationQueue"
const { QueueEvents, tryCatch } = require("bullmq");

// Create a queueEvent to get update about every job's lifecycle
const queueEvents = new QueueEvents("notificationQueue", { connection });

// Listen for job completion and send updates to SSE clients
queueEvents.on("completed", async ({ jobId, returnvalue }) => {
  const { userId, message, createdAt } = returnvalue;
  const res = connectionMap.get(userId);

  if (res) {
    res.write(
      `data: ${JSON.stringify({
        status: "success",
        message,
        createdAt: new Date(createdAt).toISOString(),
      })}\n\n`
    );
  }
});

// Listen for job failure and send updates to SSE clients
queueEvents.on("failed", async ({ jobId, failedReason }) => {
  const job = await queue.getJob(jobId);
  const userId = job.data.userId;

  if (connectionMap.get(userId)) {
    const res = clients.get(userId);
    res.write(
      `data: ${JSON.stringify({
        status: "failed",
        userId: userId,
        error: failedReason,
        message: "Sorry🥲, your notification sending failed.",
      })}\n\n`
    );
  }
});

const generateUniqueUsername = async (username) => {
  let uniqueUsername =
    username + Math.floor(1000 + Math.random() * 9000).toString();
  let uniqueUsernameExist = await User.findOne({ username: uniqueUsername });
  while (uniqueUsernameExist) {
    uniqueUsername =
      username + Math.floor(1000 + Math.random() * 9000).toString();
    uniqueUsernameExist = await User.findOne({ username: uniqueUsername });
  }
  return uniqueUsername;
};

const createUser = expressAsyncHandler(async (req, res) => {
  const { username } = req.body;

  if (!username) {
    res.status(400).json({
      success: false,
      message: "Username is required.",
    });
  } else {
    let uniqueUsername = await generateUniqueUsername(username);

    try {
      let user = await User.create({ username: uniqueUsername });
      let accessToken = generateToken(user._id);
      res.status(201).json({
        success: true,
        username: user.username,
        accessToken: accessToken,
        paused: user.paused,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error occurred while creating user.",
        error: error.message,
      });
    }
  }
});

const sendMessage = expressAsyncHandler(async (req, res) => {
  const { username, content } = req.body;

  if (!username || !content) {
    if (!username) {
      res.status(400).json({
        success: false,
        message: "Username is required.",
      });
    } else if (!content) {
      res.status(400).json({
        success: false,
        message: "Message content can't be empty.",
      });
    }
  } else {
    try {
      const user = await User.findOne({ username });

      if (!user) {
        res.status(400).json({
          success: false,
          message: "User with this username does not exist.",
        });
      } else if (user.paused) {
        res.status(400).json({
          success: false,
          message: "User has paused receiving messages.",
        });
      } else {
        // Increasing the visit count of the recipient user
        user.replies = user.replies + 1;
        await user.save();

        const message = await Message.create({
          recipient: user._id,
          content: content,
        });

        // Adding the job of sending notification to the message-queue named as "notificationQueue"
        await queue.add("notify", {
          userId: user._id.toString(),
          message: message.content,
          createdAt: message.createdAt,
        });

        res.status(201).json({
          success: true,
          message: "Message sent successfully.",
        });
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error occurred while sending message.",
        error: error.message,
      });
    }
  }
});

const getAllMessages = expressAsyncHandler(async (req, res) => {
  try {
    const messages = await Message.find({ recipient: req.user._id })
      .select("content createdAt")
      .sort({
        createdAt: -1,
      });

    if (!messages) {
      res.status(404).json({
        success: false,
        message: "No messages found of this user.",
      });
    } else {
      res.status(200).json({
        success: true,
        message: "All messages are found",
        allMessages: messages,
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error getting messages.",
      error: error.message,
    });
  }
});

const getRepliesCount = expressAsyncHandler(async (req, res) => {
  try {
    const user = await User.findOne(req.user._id).select("replies");
    if (user) {
      const replies = user.replies;
      res.status(200).json({
        success: true,
        replies,
      });
    } else {
      res.status(404).json({
        success: false,
        message: "Replies count not found.",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error getting replies count of user.",
      error: error.message,
    });
  }
});

const pauseUser = expressAsyncHandler(async (req, res) => {
  try {
    const user = await User.findOneAndUpdate(
      req.user._id,
      { paused: true },
      { new: true }
    );

    if (!user) {
      res.status(404).json({
        success: false,
        message: "User with this username not found.",
      });
    } else {
      res.status(200).json({
        success: true,
        message: "User has been paused.",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating user.",
      error: error.message,
    });
  }
});

const resumeUser = expressAsyncHandler(async (req, res) => {
  try {
    const user = await User.findOneAndUpdate(
      req.user._id,
      { paused: false },
      { new: true }
    );

    if (!user) {
      res.status(404).json({
        success: false,
        message: "User with this username not found.",
      });
    } else {
      res.status(200).json({
        success: true,
        message: "User has been resumed.",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating user.",
      error: error.message,
    });
  }
});

const deleteUser = expressAsyncHandler(async (req, res) => {
  try {
    await Message.deleteMany({ recipient: req.user._id });

    const deletedUser = await User.findByIdAndDelete(req.user._id);

    if (!deletedUser) {
      res.status(404).json({
        success: false,
        message: "User with this username not found.",
      });
    } else {
      res.status(200).json({
        success: true,
        message: "User deleted successfully.",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting user.",
      error: error.message,
    });
  }
});

//------------Server Sent Events Endpoint Starts-------------
const getRealtimeMessages = (req, res) => {
  const userId = req.user._id.toString();

  res.set({
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
  });

  res.flushHeaders();

  connectionMap.set(userId, res);

  // Send an initial message to confirm the connection
  res.write(
    `data: {"status": "listening", "userId": ${userId}, "message": "Request is added to queue."}\n\n`
  );

  req.on("close", () => {
    connectionMap.delete(userId);
  });
};
//------------Server Sent Events Endpoint Ends-------------

module.exports = {
  createUser,
  sendMessage,
  getAllMessages,
  getRealtimeMessages,
  getRepliesCount,
  pauseUser,
  resumeUser,
  deleteUser,
};

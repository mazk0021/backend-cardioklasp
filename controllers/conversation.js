const asynchandler = require("express-async-handler");
const Conversation = require("../models/Conversation");
const Message = require("../models/Message");


const createNewConversation = asynchandler((req, res) => {
  const { senderId, receiverId } = req.body;
  if (!senderId || !receiverId) {
    return res.status(400).json({ message: "fields not defined correctly" });
  }

  const conversation = new Conversation({ members: [senderId, receiverId] });
  conversation.save();
  console.log(conversation);
  if (conversation) {
    return res.status(201).json({
      conversationId: conversation._id,
      message: "conversation Created",
    });
  } else {
    res.status(400);
    throw new Error("Failed to create conversation");
  }
});

const getAllConversationsOfAUser = asynchandler(async (req, res) => {
  userId = req.user.id;
  const conversations = await Conversation.find({
    members: { $in: [userId] },
  }).populate("members", "name _id picture");
  if (conversations) {
    res.status(200).json(conversations);
  } else {
    res.status(400);
    throw new Error("Failed to create conversation");
  }
});

const getConversationWithGivenMembers = asynchandler(async (req, res) => {
  //first id is of sender & second is of receiver
  firstMemberId = req.params.firstUserId;
  secondMemberId = req.params.secondUserId;

  const conversation = await Conversation.find({
    members: { $all: [firstMemberId, secondMemberId] },
  });
  if (conversation) {
    res.status(200).json(conversation);
  } else {
    res.status(400);
    throw new Error("Failed to find conversation");
  }
});

const createorAccessChat = asynchandler(async (req, res) => {
  const { senderId, receiverId } = req.body;
  console.log(senderId, receiverId);

  if (!receiverId) {
    return res.sendStatus(400);
  }
  var chatFound = await Conversation.find({
    $and: [
      { members: { $elemMatch: { $eq: req.user._id } } },
      { members: { $elemMatch: { $eq: receiverId } } },
    ],
  }).populate("members", "-password");

  if (chatFound.length > 0) {
    const conversationId = chatFound[0]._id;
    const messages = await Message.find({ conversationId }).populate(
      "sender",
      "name _id"
    );
    if (messages) {
      res.status(200).json({messages: messages, conversationId: conversationId});
    } else {
      res.status(400);
      throw new Error("No messages found");
    }
  } else {
    if (!senderId || !receiverId) {
      return res.status(400).json({ message: "fields not defined correctly" });
    }

    const conversation = new Conversation({ members: [senderId, receiverId] });
    conversation.save();
    console.log(conversation);
    if (conversation) {
      return res.status(201).json({
        conversationId: conversation._id,
        message: "conversation Created",
      });
    } else {
      res.status(400);
      throw new Error("Failed to create conversation");
    }
  }
});

module.exports = {
  createNewConversation,
  getAllConversationsOfAUser,
  getConversationWithGivenMembers,
  createorAccessChat,
};

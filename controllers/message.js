const asynchandler = require("express-async-handler")
const Message = require("../models/Message")

const sendMessage = asynchandler((req, res) => {
    const { message, conversationId } = req.body
    console.log("bodytttttttt", req.body)
    console.log(message, conversationId)
    if (!message || !conversationId) {
        return res.status(400).json({ message: "fields not defined correctly" })
    }
    const text = new Message({ conversationId, message, sender: req.user._id })
    text.save()

    if (text) {
        res.status(201).json(text)
    }
    else {
        res.status(400)
        throw new Error("Failed to send message");
    }
})

const getAllMessagesOfAConversation = asynchandler(async (req, res) => {
    const conversationId = req.params.conversationId;
    const messages = await Message.find({ conversationId }).populate("sender", "name _id")
    if (messages) {
        res.status(200).json(messages)
    }
    else {
        res.status(400)
        throw new Error("No messages found");
    }
})

module.exports = { sendMessage, getAllMessagesOfAConversation }
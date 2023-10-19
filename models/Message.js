const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    conversationId: { type: mongoose.Schema.Types.ObjectId, ref: "Conversation" },
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    message: { type: String }
}, { timestamps: true });

const messageModel = mongoose.model('Message', messageSchema, "Messages");

module.exports = messageModel;
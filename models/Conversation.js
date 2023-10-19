const mongoose = require('mongoose');

const conversationSchema = new mongoose.Schema({
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }]
}, { timestamps: true });

const conversationModel = mongoose.model('Conversation', conversationSchema, "Conversations");

module.exports = conversationModel;
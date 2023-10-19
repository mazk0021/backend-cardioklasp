const express = require('express');
const router = express.Router();
const { sendMessage, getAllMessagesOfAConversation } = require("../controllers/message");
const { authorize } = require("../middlewares/authorization")

router.post('/', authorize, sendMessage)
router.get('/:conversationId', authorize, getAllMessagesOfAConversation)

module.exports = router;
const express = require('express');
const router = express.Router();
const { createNewConversation, getAllConversationsOfAUser, getConversationWithGivenMembers, createorAccessChat } = require("../controllers/conversation")
const { authorize } = require("../middlewares/authorization")

router.post('/', authorize, createorAccessChat)
router.get('/all', authorize, getAllConversationsOfAUser)
router.get('/:firstUserId/:secondUserId', authorize, getConversationWithGivenMembers)


module.exports = router;
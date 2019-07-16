const express = require("express");
const router = express.Router();

const VisitorController = require('../controllers/visitor');
const ChatController = require('../controllers/chat');
const parmvValidation = require('../middleware/param-validation');


router.post("/register", parmvValidation.visitor_enroll, VisitorController.visitor_enroll);
router.post("/chat", parmvValidation.visitor_chats, ChatController.visitor_chats);



module.exports = router;
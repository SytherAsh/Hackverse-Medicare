const express = require('express');
const {createMessage} = require('../controllers/messageController')
const router = express.Router();

router.post('/', async (req, res) => {
    const { contactNumbers, messageBody } = req.body;
  
    if (!Array.isArray(contactNumbers) || contactNumbers.length === 0 || !messageBody) {
      return res.status(400).json({ message: "Invalid contact numbers or message body." });
    }
  
    try {
      await createMessage(contactNumbers, messageBody);
      res.status(200).json({ message: "Messages sent successfully." });
    } catch (error) {
      console.error("Error sending messages:", error.message);
      res.status(500).json({ message: "Failed to send messages." });
    }
  });

module.exports = router;
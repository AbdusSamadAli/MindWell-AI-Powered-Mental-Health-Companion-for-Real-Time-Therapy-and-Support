const express = require('express');
const router = express.Router();
const { getMessages } = require('../controller/messageController');

router.get('/:userId1/:userId2', async (req, res) => {
  const { userId1, userId2 } = req.params;

  try {
    const messages = await getMessages(userId1, userId2);
    res.status(200).json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ error: 'Error fetching messages' });
  }
});

module.exports = router;

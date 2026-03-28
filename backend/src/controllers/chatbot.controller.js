const { askChatbot } = require('../services/chatbot.service');

const askQuestion = async (req, res, next) => {
  try {
    const { question, destination } = req.body;

    if (!question)
      return res.status(400).json({ message: 'question is required' });

    const result = await askChatbot(question, destination);
    res.json({ success: true, result });
  } catch (err) { next(err); }
};

module.exports = { askQuestion };
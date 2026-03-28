const { chat } = require('./openai.service');

const askChatbot = async (question, destination = '') => {
  const system = `You are Pravas — a friendly Indian travel assistant. 
  You help travelers with destination info, local tips, food, culture, 
  safety, and travel advice. Keep answers short and helpful.
  ${destination ? `Current trip destination: ${destination}` : ''}`;

  const answer = await chat(system, question);
  return { question, answer, destination };
};

module.exports = { askChatbot };
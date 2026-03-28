const axios = require('axios');

const chat = async (systemPrompt, userMessage) => {
  const response = await axios.post('http://localhost:11434/api/chat', {
    model: 'llama3.1:8b',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user',   content: userMessage  },
    ],
    stream: false,
  });
  return response.data.message.content;
};

module.exports = { chat };
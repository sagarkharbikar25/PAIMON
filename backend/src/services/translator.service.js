const { chat } = require('./openai.service');

const translate = async (text, targetLanguage) => {
  const system = `You are a translator. Translate text accurately.
  Respond with JSON only. No extra text.
  Format: { "translated": "", "detectedLanguage": "" }`;

  const prompt = `Translate this to ${targetLanguage}: "${text}"`;
  const raw = await chat(system, prompt);
  return JSON.parse(raw);
};

const getWordMeaning = async (word, language = 'English') => {
  const system = `You are a dictionary. Return word meanings in JSON only.
  No extra text.
  Format: { "word": "", "meaning": "", "example": "", "pronunciation": "" }`;

  const prompt = `Give meaning of "${word}" in ${language}`;
  const raw = await chat(system, prompt);
  return JSON.parse(raw);
};

module.exports = { translate, getWordMeaning };
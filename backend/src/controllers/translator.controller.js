const { translate, getWordMeaning } = require('../services/translator.service');

const translateText = async (req, res, next) => {
  try {
    const { text, targetLanguage } = req.body;
    if (!text || !targetLanguage)
      return res.status(400).json({ message: 'text and targetLanguage are required' });

    const result = await translate(text, targetLanguage);
    res.json({ success: true, result });
  } catch (err) { next(err); }
};

const wordMeaning = async (req, res, next) => {
  try {
    const { word, language } = req.query;
    if (!word)
      return res.status(400).json({ message: 'word is required' });

    const result = await getWordMeaning(word, language);
    res.json({ success: true, result });
  } catch (err) { next(err); }
};

module.exports = { translateText, wordMeaning };
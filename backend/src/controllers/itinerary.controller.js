const { generateItinerary } = require('../services/itinerary.service');

const createItinerary = async (req, res, next) => {
  try {
    const { destination, days, budget, interests } = req.body;

    if (!destination || !days)
      return res.status(400).json({ message: 'destination and days are required' });

    if (days < 1 || days > 30)
      return res.status(400).json({ message: 'days must be between 1 and 30' });

    const itinerary = await generateItinerary({
      destination,
      days,
      budget:    budget    || 10000,
      interests: interests || ['sightseeing'],
    });

    res.json({ success: true, itinerary });
  } catch (err) { next(err); }
};

module.exports = { createItinerary };
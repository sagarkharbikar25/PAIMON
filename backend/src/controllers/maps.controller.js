const { getNearbyPlaces, searchPlace, getOfflineTileUrl } = require('../services/maps.service');

const nearbyPlaces = async (req, res, next) => {
  try {
    const { lat, lng, type } = req.query;
    if (!lat || !lng)
      return res.status(400).json({ message: 'lat and lng are required' });

    const places = await getNearbyPlaces(lat, lng, type);
    res.json({ success: true, count: places.length, places });
  } catch (err) { next(err); }
};

const searchPlaces = async (req, res, next) => {
  try {
    const { query } = req.query;
    if (!query)
      return res.status(400).json({ message: 'query is required' });

    const places = await searchPlace(query);
    res.json({ success: true, count: places.length, places });
  } catch (err) { next(err); }
};

const offlineTile = async (req, res, next) => {
  try {
    const { lat, lng, zoom } = req.query;
    if (!lat || !lng)
      return res.status(400).json({ message: 'lat and lng are required' });

    const url = getOfflineTileUrl(lat, lng, zoom);
    res.json({ success: true, tileUrl: url });
  } catch (err) { next(err); }
};

module.exports = { nearbyPlaces, searchPlaces, offlineTile };
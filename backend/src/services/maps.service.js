const axios = require('axios');

const MAPS_KEY = process.env.GOOGLE_MAPS_API_KEY;

const getNearbyPlaces = async (lat, lng, type = 'tourist_attraction', radius = 5000) => {
  const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json`;
  const { data } = await axios.get(url, {
    params: { location: `${lat},${lng}`, radius, type, key: MAPS_KEY },
  });
  return data.results.map(p => ({
    name:     p.name,
    address:  p.vicinity,
    rating:   p.rating || 0,
    placeId:  p.place_id,
    location: p.geometry.location,
    photo:    p.photos?.[0]?.photo_reference || null,
  }));
};

const searchPlace = async (query) => {
  const url = `https://maps.googleapis.com/maps/api/place/textsearch/json`;
  const { data } = await axios.get(url, {
    params: { query, key: MAPS_KEY },
  });
  return data.results.map(p => ({
    name:     p.name,
    address:  p.formatted_address,
    rating:   p.rating || 0,
    placeId:  p.place_id,
    location: p.geometry.location,
  }));
};

const getOfflineTileUrl = (lat, lng, zoom = 13) => {
  return `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=${zoom}&size=600x400&key=${MAPS_KEY}`;
};

module.exports = { getNearbyPlaces, searchPlace, getOfflineTileUrl };
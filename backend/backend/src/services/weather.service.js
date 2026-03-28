const axios = require('axios');
const NodeCache = require('node-cache');
const cache = new NodeCache({ stdTTL: 600 });

const OWM = 'https://api.openweathermap.org/data/2.5';
const KEY = process.env.OPENWEATHER_API_KEY;

const getWeather = async (city) => {
  const cached = cache.get(`w_${city}`);
  if (cached) return cached;
  const { data } = await axios.get(`${OWM}/weather`, { params: { q: city, appid: KEY, units: 'metric' } });
  const result = { city: data.name, temp: data.main.temp, humidity: data.main.humidity,
    description: data.weather[0].description, icon: data.weather[0].icon };
  cache.set(`w_${city}`, result);
  return result;
};

const getForecast = async (city) => {
  const cached = cache.get(`f_${city}`);
  if (cached) return cached;
  const { data } = await axios.get(`${OWM}/forecast`, { params: { q: city, appid: KEY, units: 'metric', cnt: 40 } });
  const days = {};
  for (const item of data.list) {
    const day = item.dt_txt.split(' ')[0];
    if (!days[day]) days[day] = { date: day, temp: item.main.temp, description: item.weather[0].description };
  }
  const result = { city: data.city.name, forecast: Object.values(days).slice(0, 5) };
  cache.set(`f_${city}`, result);
  return result;
};

const checkWeatherAlerts = async (city) => {
  const w = await getWeather(city);
  const alerts = [];
  if (w.temp > 40)                        alerts.push({ type: 'HEAT',  message: `Extreme heat in ${city}: ${w.temp}°C` });
  if (w.temp < 5)                         alerts.push({ type: 'COLD',  message: `Very cold in ${city}: ${w.temp}°C` });
  if (w.description.includes('rain'))     alerts.push({ type: 'RAIN',  message: `Rain expected in ${city}` });
  if (w.description.includes('storm'))    alerts.push({ type: 'STORM', message: `Storm warning for ${city}` });
  return alerts;
};

module.exports = { getWeather, getForecast, checkWeatherAlerts };
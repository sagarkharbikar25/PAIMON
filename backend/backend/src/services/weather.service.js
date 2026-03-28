const axios = require('axios');
const NodeCache = require('node-cache');

const weatherCache = new NodeCache({ stdTTL: 600 });   // 10 min
const forecastCache = new NodeCache({ stdTTL: 900 });  // 15 min

const OWM = 'https://api.openweathermap.org/data/2.5';
const KEY = process.env.OPENWEATHER_API_KEY;

const normalizeCity = (city) => city.trim().toLowerCase();

// ✅ CURRENT WEATHER
const getWeather = async (city) => {
  const key = `w_${normalizeCity(city)}`;
  const cached = weatherCache.get(key);
  if (cached) return cached;

  try {
    const { data } = await axios.get(`${OWM}/weather`, {
      params: { q: city, appid: KEY, units: 'metric' },
      timeout: 5000,
    });

    const result = {
      city: data.name,
      temp: data.main.temp,
      humidity: data.main.humidity,
      description: data.weather[0].description,
      icon: data.weather[0].icon,
    };

    weatherCache.set(key, result);
    return result;

  } catch (err) {
    console.error('Weather API Error:', err.message);
    throw new Error(err.response?.data?.message || 'Weather fetch failed');
  }
};

// ✅ FORECAST (5 DAYS)
const getForecast = async (city) => {
  const key = `f_${normalizeCity(city)}`;
  const cached = forecastCache.get(key);
  if (cached) return cached;

  try {
    const { data } = await axios.get(`${OWM}/forecast`, {
      params: { q: city, appid: KEY, units: 'metric', cnt: 40 },
      timeout: 5000,
    });

    const days = {};

    for (const item of data.list) {
      const [date, time] = item.dt_txt.split(' ');

      // Prefer mid-day data
      if (!days[date] && time === '12:00:00') {
        days[date] = {
          date,
          temp: item.main.temp,
          description: item.weather[0].description,
          icon: item.weather[0].icon,
        };
      }
    }

    const result = {
      city: data.city.name,
      forecast: Object.values(days).slice(0, 5),
    };

    forecastCache.set(key, result);
    return result;

  } catch (err) {
    console.error('Forecast API Error:', err.message);
    throw new Error(err.response?.data?.message || 'Forecast fetch failed');
  }
};

// ✅ ALERT ENGINE (SMART LOGIC)
const checkWeatherAlerts = async (city) => {
  const w = await getWeather(city);
  const alerts = [];

  const desc = w.description.toLowerCase();

  if (w.temp > 40) {
    alerts.push({
      type: 'HEAT',
      message: `Extreme heat in ${city}: ${w.temp}°C`,
    });
  }

  if (w.temp < 5) {
    alerts.push({
      type: 'COLD',
      message: `Very cold in ${city}: ${w.temp}°C`,
    });
  }

  if (desc.includes('rain')) {
    alerts.push({
      type: 'RAIN',
      message: `Rain expected in ${city}. Carry umbrella ☔`,
    });
  }

  if (desc.includes('storm') || desc.includes('thunder')) {
    alerts.push({
      type: 'STORM',
      message: `Storm warning in ${city}. Stay safe ⚠️`,
    });
  }

  return alerts;
};

module.exports = {
  getWeather,
  getForecast,
  checkWeatherAlerts,
};
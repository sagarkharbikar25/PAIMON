const { chat } = require('./openai.service');

const generateItinerary = async ({ destination, days, budget, interests }) => {
  const system = `You are an expert travel planner for India. 
  Generate detailed day-wise trip itineraries.
  Always respond in valid JSON format only. No extra text.`;

  const prompt = `Generate a ${days}-day itinerary for ${destination}.
  Budget: ₹${budget}. Interests: ${interests.join(', ')}.
  Return JSON: { 
    destination: "",
    days: [{ 
      day: 1, 
      morning: "", 
      afternoon: "", 
      evening: "", 
      places: [], 
      estimatedCost: 0 
    }],
    totalEstimatedCost: 0,
    tips: []
  }`;

  const raw = await chat(system, prompt);
  return JSON.parse(raw);
};

module.exports = { generateItinerary };
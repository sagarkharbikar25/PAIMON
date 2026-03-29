/* =============================================
   src/services/geminiService.ts
   Pravas — AI Service (Ollama / phi3:latest)
   ============================================= */

const OLLAMA_URL   = 'http://localhost:11434/api/generate';
const OLLAMA_MODEL = 'phi3:latest';

async function callOllama(prompt: string): Promise<string> {
  const res = await fetch(OLLAMA_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model:   OLLAMA_MODEL,
      prompt,
      stream:  false,
      options: {
        temperature: 0.3,      // lower = more structured output
        num_predict: 1500,     // enough tokens for full itinerary
      },
    }),
  });

  if (!res.ok) throw new Error(`Ollama error: ${res.status}`);
  const data = await res.json();
  return data.response || '';
}

export async function generateItinerary(
  destination: string,
  duration: string,
  interests: string
): Promise<{ days: { activities: { time: string; name: string; description: string }[] }[] }> {

  // Parse number of days from duration string e.g. "3 days" → 3
  const numDays = parseInt(duration) || 3;

  // Build day entries explicitly so phi3 knows exactly how many to generate
  const dayEntries = Array.from({ length: numDays }, (_, i) =>
    `{"activities":[{"time":"09:00 AM","name":"Activity","description":"desc"},{"time":"02:00 PM","name":"Activity","description":"desc"}]}`
  ).join(',');

  const prompt = `You are a travel planner. Output ONLY a JSON object. No explanation, no markdown, no extra text.

Generate a ${numDays}-day itinerary for ${destination}. Interests: ${interests || 'sightseeing, local food, culture'}.

Rules:
- Return exactly ${numDays} day objects
- Each day has exactly 3 activities
- Time format must be "HH:MM AM/PM" like "09:00 AM" or "02:30 PM"
- Keep descriptions under 10 words

JSON structure:
{"days":[{"activities":[{"time":"09:00 AM","name":"NAME","description":"DESC"},{"time":"01:00 PM","name":"NAME","description":"DESC"},{"time":"07:00 PM","name":"NAME","description":"DESC"}]},{"activities":[{"time":"09:00 AM","name":"NAME","description":"DESC"},{"time":"01:00 PM","name":"NAME","description":"DESC"},{"time":"07:00 PM","name":"NAME","description":"DESC"}]}]}

Now write the JSON for ${destination}:`;

  const text  = await callOllama(prompt);

  // Extract JSON from response robustly
  const clean = text.replace(/```json|```/g, '').trim();

  // Try direct parse first
  try {
    return JSON.parse(clean);
  } catch {
    // Try to find JSON object in the response
    const match = clean.match(/\{[\s\S]*\}/);
    if (match) {
      try {
        return JSON.parse(match[0]);
      } catch {
        // Fix common phi3 JSON issues: trailing commas, single quotes
        const fixed = match[0]
          .replace(/,\s*}/g, '}')
          .replace(/,\s*]/g, ']')
          .replace(/'/g, '"');
        return JSON.parse(fixed);
      }
    }
    throw new Error('AI returned invalid response. Please try again.');
  }
}

export async function getTravelAdvice(query: string): Promise<string> {
  const prompt = `You are a travel concierge for Pravas app. Be helpful and concise. Answer in 2-3 sentences only. No lists, no markdown.
Question: ${query}
Answer:`;

  return await callOllama(prompt);
}
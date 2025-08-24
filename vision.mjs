export async function handler(event) {
  if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'Method Not Allowed' };
  const key = event.headers['x-openai-key'];
  if (!key) return { statusCode: 401, body: JSON.stringify({error:'Missing x-openai-key'}) };
  const { image = '', task = 'hair_analysis' } = JSON.parse(event.body || '{}');
  const prompt = task === 'hair_analysis'
    ? "Analyze this client's hair for color history, visible level, undertone, porosity cues, and risk. Suggest neutralization and aftercare. Provide safety disclaimers."
    : "Describe this image professionally for color consultation.";
  try {
    const r = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: "You are a precise salon color analyst. Flag risks and unknowns." },
          { role: 'user', content: [
              { type: 'text', text: prompt },
              { type: 'image_url', image_url: { url: image } }
            ]
          }
        ]
      })
    });
    const j = await r.json();
    const text = j.choices?.[0]?.message?.content || JSON.stringify(j);
    return { statusCode: 200, body: JSON.stringify({ text }) };
  } catch (e) {
    return { statusCode: 500, body: JSON.stringify({ error: e.message }) };
  }
}

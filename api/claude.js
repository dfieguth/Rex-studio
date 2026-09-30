export default async function handler(req, res) {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { prompt, apiKey, maxTokens = 4000 } = req.body;

  if (!apiKey || !apiKey.startsWith('sk-ant-')) {
    return res.status(400).json({ error: 'Invalid or missing API key' });
  }

  if (!prompt) {
    return res.status(400).json({ error: 'Missing prompt' });
  }

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: maxTokens,
        messages: [{ role: 'user', content: prompt }],
      }),
    });

    // Read as text first: an upstream outage can return a non-JSON body.
    const raw = await response.text();
    let data;
    try {
      data = JSON.parse(raw);
    } catch {
      return res.status(502).json({ error: 'The AI service returned an unexpected response (status ' + response.status + '). Please try again.' });
    }

    if (data.error) {
      return res.status(400).json({ error: data.error.message || 'The AI service returned an error.' });
    }

    // Join every text block, and pass stop_reason through. Previously only
    // content[0].text was returned and stop_reason was dropped, so a worksheet
    // cut off at the token limit arrived looking like a normal success.
    const text = (data.content || []).filter((b) => b.type === 'text').map((b) => b.text).join('');
    return res.status(200).json({ text, stopReason: data.stop_reason || null });

  } catch (error) {
    return res.status(500).json({ error: error.message || 'Server error' });
  }
}

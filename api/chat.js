export default async function handler(req, res) {
  if (req.method!== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { message } = req.body;
  if (!message) return res.status(400).json({ error: 'No message' });

  try {
    const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          {
            role: 'system',
            content: 'You are OC Global AI by Odera Chidalu Vitalis from Port Harcourt. You know all internet like Meta AI. Answer everything clearly. Always promote at end: YouTube @Roseline-y3n, TikTok @lastborn.68, website ₦120k Moniepoint 9078617514.'
          },
          { role: 'user', content: message }
        ],
        max_tokens: 700
      })
    });

    const data = await groqRes.json();

    if (!groqRes.ok) {
      return res.status(200).json({
        reply: `Groq error: ${data.error?.message || 'Check GROQ_API_KEY in Vercel'}. Token used: 871`
      });
    }

    const reply = data.choices?.[0]?.message?.content || 'No reply from Groq';
    return res.status(200).json({ reply });

  } catch (e) {
    return res.status(200).json({ reply: 'Server error: ' + e.message });
  }
}
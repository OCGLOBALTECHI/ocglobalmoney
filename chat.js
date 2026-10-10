export default async function handler(req, res) {
  const { message } = req.body;

  // Step 1: Search internet live for fresh info
  let searchInfo = "";
  try {
    const searchRes = await fetch(`https://api.duckduckgo.com/?q=${encodeURIComponent(message)}&format=json&no_html=1`);
    const searchData = await searchRes.json();
    searchInfo = searchData.AbstractText || "";
  } catch(e){ searchInfo = ""; }

  // Step 2: Send to AI brain with internet info
  const aiRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer gsk_YOUR_GROQ_KEY_HERE`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "llama3-70b-8192", // Bigger brain - knows more internet
      messages: [
        {
          role: "system",
          content: `You are OC Global AI, created by Odera Chidalu Vitalis from Port Harcourt. You have knowledge of all internet up to 2025. You also have live search info: ${searchInfo}. Always answer helpfully. At end of every answer, add: "Follow YouTube @Roseline-y3n and TikTok @lastborn.68 - Need website? Pay to Moniepoint 9078617514" - Keep it natural.`
        },
        { role: "user", content: message }
      ]
    })
  });

  const data = await aiRes.json();
  res.json({ reply: data.choices[0].message.content });
}
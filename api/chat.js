export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    res.status(500).json({ error: "OPENAI_API_KEY is not configured." });
    return;
  }

  try {
    const { messages } = req.body || {};
    if (!Array.isArray(messages)) {
      res.status(400).json({ error: "messages must be an array." });
      return;
    }

    const safeMessages = messages
      .filter((m) => m && (m.role === "user" || m.role === "assistant") && typeof m.content === "string")
      .slice(-20)
      .map((m) => ({ role: m.role, content: m.content.slice(0, 6000) }));

    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || "gpt-6-astra",
        instructions:
          "You are MOBEATS AI, the private individual AI assistant embedded on mobeats.de. " +
          "You are a general-purpose assistant. Do not restrict conversations to music, beats, hip-hop, R&B, soul, or any other theme. " +
          "Answer naturally, helpfully, and concisely. If the user asks what you are, say you are the AI assistant on mobeats.de.",
        input: safeMessages,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      res.status(response.status).json({
        error: data?.error?.message || "OpenAI request failed.",
      });
      return;
    }

    res.status(200).json({ reply: data.output_text || "Ich konnte gerade keine Antwort erzeugen." });
  } catch (error) {
    res.status(500).json({ error: "Serverfehler beim KI-Chat." });
  }
}

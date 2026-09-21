const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// Reads the OPEN_API_KEY environment variable you already added.
const OPEN_API_KEY = process.env.OPEN_API_KEY;

app.get("/", (req, res) => {
  res.json({
    name: "Profolio API",
    status: "running",
    message: "Portfolio & Resume Builder backend is ready."
  });
});

app.post("/api/health", (req, res) => {
  res.json({ ok: true });
});

// Example AI route (OpenAI). Frontend sends { prompt } and gets { text } back.
app.post("/api/generate", async (req, res) => {
  const { prompt } = req.body || {};
  if (!prompt) {
    return res.status(400).json({ error: "prompt is required." });
  }

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPEN_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }]
      })
    });

    const data = await response.json();
    if (!response.ok) {
      return res.status(response.status).json({ error: data.error?.message || "AI request failed." });
    }

    res.json({ text: data.choices?.[0]?.message?.content || "" });
  } catch (err) {
    console.error("AI error:", err);
    res.status(500).json({ error: "Something went wrong calling the AI provider." });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`API running on port ${PORT}`));

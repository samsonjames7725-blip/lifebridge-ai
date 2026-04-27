import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

const API_KEY = process.env.ANTHROPIC_API_KEY;

/* Health check */
app.get("/ai", (req, res) => {
  res.send("AI is running");
});

/* AI CHAT */
app.post("/ai", async (req, res) => {
  try {
    const userMsg = req.body.message;

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": API_KEY,
        "anthropic-version": "2023-06-01",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 1024,
        system: "You are a sales AI for LifeBridge MedTech. Suggest ICU, OT, hospital setup solutions.",
        messages: [
          { role: "user", content: userMsg }
        ]
      })
    });

    const data = await response.json();

    res.json({
      reply: data.content?.[0]?.text || "No response"
    });

  } catch (err) {
    console.error(err);
    res.json({ reply: "Error occurred.", error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("AI running on port " + PORT));

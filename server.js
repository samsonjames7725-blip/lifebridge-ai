import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

const API_KEY = process.env.OPENAI_API_KEY;

/* ✅ ADD THIS (FIX YOUR ERROR) */
app.get("/ai", (req, res) => {
  res.send("AI is running");
});

/* AI CHAT */
app.post("/ai", async (req, res) => {
  try {
    const userMsg = req.body.message;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "You are a sales AI for LifeBridge MedTech. Suggest ICU, OT, hospital setup solutions."
          },
          { role: "user", content: userMsg }
        ]
      })
    });

    const data = await response.json();

    res.json({
      reply: data.choices?.[0]?.message?.content || "No response"
    });

  } catch (err) {
    console.error(err);
    res.json({ reply: "Error occurred." });
  }
});

/* ✅ IMPORTANT FOR RENDER */
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log("AI running on port " + PORT));

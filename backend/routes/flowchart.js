const express = require("express")
const router = express.Router();
const { GoogleGenAI } = require("@google/genai");
const FLOWCHART_PROMPT = require("../prompts/flowchart");

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

router.post("/generate", async (req, res) => {
  const { code, language } = req.body;
  if (!code) {
    return res.status(400).json({ error: "No code provided" });
  }

  if (code.trim().length < 20) {
    return res.status(400).json({ error: "Code too short to generate a flowchart" });
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Convert this ${language || "code"} into a flowchart JSON:\n\n${code}`,
      config: {
        systemInstruction: FLOWCHART_PROMPT,
        responseMimeType: "application/json", // forces clean JSON, no markdown fences
      },
    });
     
    const raw = response.text?.trim();
    
    if (!raw) {
      return res.status(500).json({ error: "Empty response from Gemini. Try again." });
    }

    // Safety net in case it still wraps in fences
    const clean = raw.replace(/```json|```/g, "").trim();

    let parsed;

    try {
      parsed=JSON.parse(clean);
    } catch (e) {
       console.error("gemini returned invalid json", raw);
       return res.status(500).json({error: "try again"});
    }

    if (!parsed.nodes || !parsed.edges || !Array.isArray(parsed.nodes) || !Array.isArray(parsed.edges)) {
      return res.status(500).json({ error: "Invalid flowchart structure returned. Try again." });
    }

    if (parsed.nodes.length === 0) {
      return res.status(500).json({ error: "No nodes generated. Try with more detailed code." });
    }

    console.log(`✓ Generated flowchart: ${parsed.nodes.length} nodes, ${parsed.edges.length} edges`);
    res.json(parsed);

  } catch (err) {
     console.error("Gemini API error:", err.message);

    if (err.message?.includes("API key") || err.status === 401 || err.status === 403) {
      return res.status(401).json({ error: "Invalid API key. Check your .env file." });
    }
    if (err.status === 429) {
      return res.status(429).json({ error: "Rate limit hit. Wait a moment and try again." });
    }
    
     res.status(500).json({ error: "Something went wrong. Please try again." });
  }
});

module.exports = router;
import "dotenv/config";
import express from "express";
import multer from "multer";
import OpenAI from "openai";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 8 * 1024 * 1024 }
});

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

app.use(express.static(path.join(__dirname, "public")));

app.post("/api/generate", upload.single("design"), async (req, res) => {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({
        error: "OPENAI_API_KEY fehlt. Lege sie in der .env-Datei auf dem Server ab."
      });
    }

    if (!req.file) {
      return res.status(400).json({ error: "Bitte ein PNG-, JPG- oder WebP-Design hochladen." });
    }

    const allowed = ["image/png", "image/jpeg", "image/webp"];
    if (!allowed.includes(req.file.mimetype)) {
      return res.status(400).json({ error: "Nur PNG, JPG und WebP werden unterstützt." });
    }

    const dataUrl = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;

    const response = await client.responses.create({
      model: process.env.OPENAI_MODEL || "gpt-5.6-luna",
      store: false,
      input: [{
        role: "user",
        content: [
          {
            type: "input_text",
            text: `Du bist der Frontend-Generator von design2html.de.
Analysiere den hochgeladenen Website-Screenshot sehr genau und rekonstruiere daraus eine eigenständige, responsive Website.

Regeln:
- Liefere vollständiges, sauberes HTML5 in "html".
- Liefere das vollständige CSS in "css".
- Kein Markdown und keine Code-Fences in den Feldern.
- Verwende semantische HTML-Elemente.
- Verwende CSS-Variablen, Flexbox/Grid und responsive Breakpoints.
- Rekonstruiere Layout, Größen, Abstände, Farben, Typografie, Karten, Buttons und Navigation möglichst visuell nah.
- Wenn Text nicht lesbar ist, verwende sinnvollen Platzhaltertext statt erfundener Marken.
- Keine externen JavaScript-Abhängigkeiten.
- Verwende keine Inline-Skripte.
- Externe Bilder nur, wenn sie im Screenshot eindeutig als dekorative Bildfläche erkennbar sind; ansonsten nutze CSS-Platzhalter.
- Das HTML muss direkt in einem iframe funktionieren.
- Gib außerdem eine kurze deutsche "analysis" mit den wichtigsten erkannten Designmerkmalen zurück.`
          },
          {
            type: "input_image",
            image_url: dataUrl,
            detail: "high"
          }
        ]
      }],
      text: {
        format: {
          type: "json_schema",
          name: "design_to_html",
          strict: true,
          schema: {
            type: "object",
            additionalProperties: false,
            properties: {
              analysis: { type: "string" },
              html: { type: "string" },
              css: { type: "string" }
            },
            required: ["analysis", "html", "css"]
          }
        }
      }
    });

    const result = JSON.parse(response.output_text);
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: error?.message || "Die KI-Generierung ist fehlgeschlagen."
    });
  }
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(port, () => {
  console.log(`design2html.de läuft auf http://localhost:${port}`);
});

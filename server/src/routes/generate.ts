import { Router, Request, Response } from "express";
import { generateUIImages } from "../services/imageGenerator.js";
import { generateUIImagesWithGemini } from "../services/geminiImageGenerator.js";
import { saveDesign, saveDesignFromBase64 } from "../services/designStorage.js";

export const generateRouter = Router();

type Provider = "openai" | "gemini";

interface GenerateRequest {
  prompt: string;
  guidelines?: string;
  provider?: Provider;
}

generateRouter.post("/generate", async (req: Request, res: Response) => {
  const { prompt, guidelines = "", provider = "gemini" } = req.body as GenerateRequest;

  if (!prompt || typeof prompt !== "string") {
    res.status(400).json({ error: "Prompt is required" });
    return;
  }

  try {
    if (provider === "gemini") {
      if (!process.env.GEMINI_API_KEY) {
        res.status(500).json({ error: "Gemini API key not configured" });
        return;
      }
      const images = await generateUIImagesWithGemini(prompt, guidelines);
      const design = await saveDesignFromBase64(prompt, images);
      res.json({ id: design.id, images: design.images });
    } else {
      if (!process.env.OPENAI_API_KEY) {
        res.status(500).json({ error: "OpenAI API key not configured" });
        return;
      }
      const imageUrls = await generateUIImages(prompt, guidelines);
      const design = await saveDesign(prompt, imageUrls);
      res.json({ id: design.id, images: design.images });
    }
  } catch (error) {
    console.error("Error generating images:", error);
    res.status(500).json({ error: "Failed to generate images" });
  }
});

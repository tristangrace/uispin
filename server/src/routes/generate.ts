import { Router, Request, Response } from "express";
import { generateUIImages } from "../services/imageGenerator.js";

export const generateRouter = Router();

interface GenerateRequest {
  prompt: string;
}

generateRouter.post("/generate", async (req: Request, res: Response) => {
  const { prompt } = req.body as GenerateRequest;

  if (!prompt || typeof prompt !== "string") {
    res.status(400).json({ error: "Prompt is required" });
    return;
  }

  if (!process.env.OPENAI_API_KEY) {
    res.status(500).json({ error: "OpenAI API key not configured" });
    return;
  }

  try {
    const images = await generateUIImages(prompt);
    res.json({ images });
  } catch (error) {
    console.error("Error generating images:", error);
    res.status(500).json({ error: "Failed to generate images" });
  }
});

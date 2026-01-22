import { GoogleGenAI } from "@google/genai";

let genai: GoogleGenAI | null = null;

function getClient(): GoogleGenAI {
  if (!genai) {
    genai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }
  return genai;
}

function enhancePrompt(
  userPrompt: string,
  guidelines: string,
  variation: number
): string {
  const styles = [
    "Clean and minimal design with lots of whitespace",
    "Modern and vibrant with bold colors",
    "Professional and corporate aesthetic",
    "Playful and creative with rounded elements",
  ];

  const guidelinesSection = guidelines
    ? `\nDesign Guidelines: ${guidelines}`
    : "";

  return `Create a UI mockup image for: ${userPrompt}.${guidelinesSection}
Style: ${styles[variation]}.
This should look like a professional UI/UX design mockup, with realistic interface elements, proper spacing, and modern typography.
Show it as a complete screen design.`;
}

export interface GeminiImageResult {
  base64: string;
  mimeType: string;
}

export async function generateUIImagesWithGemini(
  prompt: string,
  guidelines: string = ""
): Promise<GeminiImageResult[]> {
  const client = getClient();
  const variations = [0, 1, 2, 3];

  const imagePromises = variations.map(async (variation) => {
    const enhancedPrompt = enhancePrompt(prompt, guidelines, variation);

    const response = await client.models.generateContent({
      model: "gemini-3-pro-image-preview",
      contents: enhancedPrompt,
      config: {
        responseModalities: ["image", "text"],
      },
    });

    const parts = response.candidates?.[0]?.content?.parts || [];
    for (const part of parts) {
      if (part.inlineData) {
        return {
          base64: part.inlineData.data!,
          mimeType: part.inlineData.mimeType || "image/png",
        };
      }
    }

    throw new Error("No image generated");
  });

  const images = await Promise.all(imagePromises);
  return images;
}

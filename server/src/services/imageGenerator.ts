import OpenAI from "openai";

let openai: OpenAI | null = null;

function getClient(): OpenAI {
  if (!openai) {
    openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }
  return openai;
}

function enhancePrompt(userPrompt: string, variation: number): string {
  const styles = [
    "Clean and minimal design with lots of whitespace",
    "Modern and vibrant with bold colors",
    "Professional and corporate aesthetic",
    "Playful and creative with rounded elements",
  ];

  return `Create a UI mockup image for: ${userPrompt}.
Style: ${styles[variation]}.
This should look like a professional UI/UX design mockup, with realistic interface elements, proper spacing, and modern typography.
Show it as a complete screen design.`;
}

export async function generateUIImages(prompt: string): Promise<string[]> {
  const variations = [0, 1, 2, 3];

  const imagePromises = variations.map(async (variation) => {
    const enhancedPrompt = enhancePrompt(prompt, variation);

    const response = await getClient().images.generate({
      model: "dall-e-3",
      prompt: enhancedPrompt,
      n: 1,
      size: "1024x1024",
      quality: "standard",
    });

    return response.data[0].url!;
  });

  const images = await Promise.all(imagePromises);
  return images;
}

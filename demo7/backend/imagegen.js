import "dotenv/config";

import { AzureOpenAI } from "openai";

const apiVersion = "2024-05-01-preview";
const deployment = "dall-e-3";
const client = new AzureOpenAI({
  endpoint: process.env.AZURE_OPENAI_ENDPOINT,
  apiVersion: apiVersion,
  apiKey: process.env.AZURE_OPENAI_KEY,
  deployment: deployment,
});

async function generateImage(imagePrompt, io) {
  // TODO: Add content safety for images too.
  try {
    console.log("Generating image for prompt: ", imagePrompt);
    const results = await client.images.generate({
      prompt: imagePrompt,
      size: "1024x1024",
      n: 1,
      model: "dall-e-3",
      style: "vivid", // or "natural"
    });
    for (const image of results.data) {
      global.currentLocation = imagePrompt;
      console.log(`Image generation result URL: ${image.url}`);
      io.emit("set-image-url", image.url);
      return image.url;
    }
  } catch (error) {
    console.error("Error generating image:", error);
    return null;
  }
}
export default generateImage;

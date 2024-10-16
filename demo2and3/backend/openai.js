import "dotenv/config";

import { AzureOpenAI } from "openai";

const deployment = "gpt-4o-mini";
const apiVersion = "2024-07-01-preview";
const client = new AzureOpenAI({
  deployment,
  apiVersion,
  apiKey: process.env.AZURE_OPENAI_GPT4O_MINI_KEY,
});

const systemPrompt = {
  role: "system",
  content: "You are a helpful assistant.",
};

async function generateResponse(messages) {
  // Clean the messages to only include 'role' and 'content'
  let cleanMessages = messages.map(({ role, content }) => ({ role, content }));

  // Prepend system prompt if it's not already there
  if (cleanMessages.length === 0 || cleanMessages[0].role !== "system") {
    cleanMessages = [systemPrompt, ...cleanMessages];
  }

  try {
    const completion = await client.chat.completions.create({
      model: deployment,
      messages: cleanMessages,
    });
    console.log(completion.choices[0].message);
    return completion.choices[0].message.content;
  } catch (error) {
    console.error("Error generating AI response:", error);
    return "I'm sorry, I encountered an error while processing your request.";
  }
}

export default generateResponse;

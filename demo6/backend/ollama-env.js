import ollama from "ollama";

async function generateAmbient(imagePrompt, io) {
  console.log("Generating ambient event");
  const response = await ollama.chat({
    model: "llama3.1",
    messages: [
      {
        role: "user",
        content:
          "You are a helper function for a dungeon master, generating low-key background events for a Dungeons & Dragons campaign, suitable for pasting in a chat application. Examples include 'There is rustling in the bushes' or 'A bird chirps in the distance'. Generate these events every 10 seconds based on the current state of the user. Events should be short, subtle, and not game-breaking. Provide one event per response. The player is currently in " +
          imagePrompt +
          ".",
      },
    ],
  });
  io.emit("ambient-event", response.message.content);
}
export default generateAmbient;

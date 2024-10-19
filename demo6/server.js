import { createServer } from "node:http";
import next from "next";
import { Server } from "socket.io";
import generateResponse from "./backend/chatcompletions.js";
import generateAmbient from "./backend/ollama-env.js";

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = 3000;
// when using middleware `hostname` and `port` must be provided below
const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

await app.prepare();

const httpServer = createServer(handler);

global.currentLocation = "";

const io = new Server(httpServer);

// Add this function to run generateAmbient every 15 seconds
async function startAmbientEventGenerator() {
  console.log("Starting ambient event generator");
  setInterval(async () => {
    if (global.currentLocation) {
      console.log("Generating ambient event as time has passed");
      await generateAmbient(global.currentLocation, io);
    } else {
      console.log("Current location is empty, skipping");
    }
  }, 15000);
}
// 15000 milliseconds = 15 seconds

io.on("connection", (socket) => {
  console.log("New connection established.");

  socket.on("message-history", async (history) => {
    console.log("New message history received.");
    if (history.length > 0) {
      const mostRecentMessage = history[history.length - 1];
      io.emit("new-message", mostRecentMessage);
      const aiResponseContent = await generateResponse(history, io);
      const response = {
        role: "assistant",
        content: aiResponseContent,
        type: "text",
      };
      io.emit("new-message", response);
    }
  });

  socket.on("image-description", async (imageDescription) => {
    console.log("New image description received.");
    console.log("Setting current location to: ", imageDescription);
    global.currentLocation = imageDescription;
  });

  socket.on("ambient-event", (event) => {
    console.log("New ambient event received.");
    io.emit("ambient-event", event);
  });
});

httpServer
  .once("error", (err) => {
    console.error(err);
    process.exit(1);
  })
  .listen(port, () => {
    console.log(`> Ready on http://${hostname}:${port}`);
    startAmbientEventGenerator(); // Start the ambient event generator when the server starts
  });

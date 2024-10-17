import { createServer } from "node:http";
import next from "next";
import { Server } from "socket.io";
import generateResponse from "./backend/chatcompletions.js";

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = 3000;
// when using middleware `hostname` and `port` must be provided below
const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

await app.prepare();

const httpServer = createServer(handler);

const io = new Server(httpServer);

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
});

httpServer
  .once("error", (err) => {
    console.error(err);
    process.exit(1);
  })
  .listen(port, () => {
    console.log(`> Ready on http://${hostname}:${port}`);
  });

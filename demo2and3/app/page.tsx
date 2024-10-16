"use client";

import { useEffect, useState, useRef } from "react";
import { socket } from "./socket";
import { marked } from "marked";
import "./custom.css"; // Update this import to use custom.css

interface Message {
  role: string;
  content: string;
  type: string;
}

export default function Home() {
  const [isConnected, setIsConnected] = useState(false);
  const [transport, setTransport] = useState("N/A");
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const sendMessage = (messageText: string) => {
    if (messageText.trim() !== "") {
      const newMessage = {
        role: "user",
        content: messageText,
        type: "text",
      };
      const updatedMessages = [...messages, newMessage];
      socket.emit("message-history", updatedMessages);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    sendMessage(input);
    setInput("");
  };

  useEffect(() => {
    if (socket.connected) {
      onConnect();
    }

    function onConnect() {
      setIsConnected(true);
      setTransport(socket.io.engine.transport.name);

      socket.io.engine.on("upgrade", (transport) => {
        setTransport(transport.name);
      });
    }

    function onDisconnect() {
      setIsConnected(false);
      setTransport("N/A");
    }

    function onNewMessage(message: Message) {
      setMessages((prevMessages) => [...prevMessages, message]);
      setTimeout(scrollToBottom, 100); // Delay to ensure DOM update
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("new-message", onNewMessage);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("new-message", onNewMessage);
    };
  }, []);

  useEffect(scrollToBottom, [messages]);

  return (
    <div className="min-h-screen bg-parchment flex items-center justify-center p-4">
      <div className="w-full max-w-4xl medieval-container shadow-2xl">
        <div className="relative z-10">
          <div className="bg-red-900 p-4 border-b-4 border-brown-800">
            <h1 className="text-4xl font-bold font-medieval text-center text-header">
              Securing the Realm and Autonomous Adventure
            </h1>
            <h2 className="text-2xl text-center mt-2 font-fantasy text-subheader">
              Demo 2 and 3
            </h2>
          </div>
          <div className="p-6 flex flex-col h-[calc(100vh-12rem)]">
            <div className="flex justify-end mb-4 space-x-2">
              <span
                className={`px-3 py-1 text-sm font-medium rounded ${
                  isConnected ? "status-connected" : "status-disconnected"
                }`}
              >
                {isConnected ? "Connected" : "Disconnected"}
              </span>
              <span className="status-transport px-3 py-1 text-sm font-medium rounded">
                {transport}
              </span>
            </div>
            <div className="flex-grow overflow-y-auto mb-4 pr-2 scrollbar-medieval">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`mb-4 ${
                    msg.role === "assistant" ? "text-left" : "text-right"
                  }`}
                >
                  <div
                    className={`flex flex-col ${
                      msg.role === "assistant" ? "items-start" : "items-end"
                    }`}
                  >
                    <span className="text-sm text-brown-800 mb-1 font-bold font-fantasy">
                      {msg.role === "assistant"
                        ? "Dungeon Master"
                        : "Adventurer"}
                    </span>
                    <div
                      className={`inline-block p-3 rounded-lg max-w-[80%] ${
                        msg.role === "assistant"
                          ? "bg-parchment-dark text-brown-900 border border-brown-300"
                          : "bg-red-800 text-adventurer"
                      }`}
                    >
                      {msg.role === "assistant" ? (
                        <div
                          className="prose prose-sm prose-stone text-message"
                          dangerouslySetInnerHTML={{
                            __html: marked(msg.content),
                          }}
                        />
                      ) : (
                        <p className="font-fantasy text-message">{msg.content}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
            <form onSubmit={handleSubmit} className="flex mt-4">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-grow mr-2 input-message border-2 border-brown-600 rounded bg-parchment-dark text-brown-900 focus:outline-none focus:border-brown-800 font-fantasy"
                placeholder="Speak, brave adventurer..."
                aria-label="Enter your message"
              />
              <button
                type="submit"
                className="btn-send rounded font-medieval"
                aria-label="Send message"
              >
                Send
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

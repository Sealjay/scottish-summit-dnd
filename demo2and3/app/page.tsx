"use client";

import { useEffect, useState, useRef } from "react";
import { socket } from "./socket";
import { marked } from "marked";

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
    <div>
      <p>Status: {isConnected ? "connected" : "disconnected"}</p>
      <p>Transport: {transport}</p>
      <div>
        <h1>Real-time Chat</h1>
        <div style={{ height: "400px", overflowY: "auto" }}>
          {messages.map((msg, index) => (
            <div key={index}>
              <strong>{msg.role}:</strong>{" "}
              {msg.role === "assistant" ? (
                <div
                  dangerouslySetInnerHTML={{ __html: marked(msg.content) }}
                />
              ) : (
                msg.content
              )}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button type="submit">Send</button>
        </form>
      </div>
    </div>
  );
}

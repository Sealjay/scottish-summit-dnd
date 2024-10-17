import { useRef, useEffect } from "react";
import { marked } from "marked";
import { Message } from "../types";

interface MessageListProps {
  messages: Message[];
}

export default function MessageList({ messages }: MessageListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    setTimeout(scrollToBottom, 100);
  }, [messages]);

  return (
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
              {msg.role === "assistant" ? "Dungeon Master" : "Adventurer"}
              {msg.role === "user" && (
                <span
                  className={`ml-2 text-xs ${
                    msg.contentSafety ? "text-emerald-700" : "text-red-600"
                  }`}
                >
                  {msg.contentSafety ? "(Safe)" : "(Unsafe)"}
                </span>
              )}
            </span>
            <div
              className={`inline-block p-3 rounded-lg max-w-[80%] ${
                msg.role === "assistant"
                  ? "bg-parchment-dark text-brown-900 border border-brown-300"
                  : "bg-red-800 text-adventurer"
              } ${
                msg.role === "assistant" &&
                msg.content ===
                  "I'm sorry, your message has been blocked due to content safety concerns."
                  ? "content-safety-warning"
                  : ""
              }`}
            >
              {msg.role === "assistant" ? (
                <div
                  className={`prose prose-sm prose-stone text-message  ${
                    msg.role === "assistant" &&
                    msg.content ===
                      "I'm sorry, your message has been blocked due to content safety concerns."
                      ? "content-safety-warning"
                      : ""
                  }`}
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
  );
}

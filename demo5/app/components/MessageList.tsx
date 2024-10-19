import { useRef, useEffect, useCallback } from "react";
import { marked } from "marked";
import { Message } from "../types";

const speak = (text: string) => {
  if ('speechSynthesis' in window) {
    const utterance = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(utterance);
  } else {
    console.log("Text-to-speech not supported in this browser.");
  }
};

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

  // Add this useEffect to handle text-to-speech for new assistant messages
  useEffect(() => {
    const lastMessage = messages[messages.length - 1];
    if (lastMessage && lastMessage.role === "assistant") {
      speak(lastMessage.content);
    }
  }, [messages]);

  // New function to strip image tags from HTML
  const stripImageTags = (html: string): string => {
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = html;
    const imgTags = tempDiv.getElementsByTagName("img");
    while (imgTags.length > 0) {
      imgTags[0].parentNode?.removeChild(imgTags[0]);
    }
    return tempDiv.innerHTML;
  };

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
                    __html: stripImageTags(marked(msg.content)),
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

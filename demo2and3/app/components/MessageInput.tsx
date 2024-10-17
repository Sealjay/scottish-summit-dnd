import { useState } from "react";

interface MessageInputProps {
  sendMessage: (message: string) => void;
}

export default function MessageInput({ sendMessage }: MessageInputProps) {
  const [input, setInput] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    sendMessage(input);
    setInput("");
  };

  return (
    <form onSubmit={handleSubmit} className="flex-grow flex">
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
  );
}

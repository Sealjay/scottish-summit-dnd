import React, { useState } from "react";

interface MessageInputProps {
  sendMessage: (message: string) => void;
}

const MessageInput: React.FC<MessageInputProps> = ({ sendMessage }) => {
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      sendMessage(message);
      setMessage("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex-grow flex">
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Speak, brave adventurer..."
        className="flex-grow mr-2 input-message border-2 border-brown-600 rounded bg-parchment-dark text-brown-900 focus:outline-none focus:border-brown-800 font-fantasy"
      />
      <button type="submit" className="btn-send rounded font-medieval">
        Send
      </button>
    </form>
  );
};

export default MessageInput;

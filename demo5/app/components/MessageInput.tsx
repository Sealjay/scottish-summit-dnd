import React, { useState } from "react";
import AudioRecorder from "./AudioRecorder";

interface MessageInputProps {
  sendMessage: (message: string) => void;
  sendAudio: (audio: Blob) => void;
}

const MessageInput: React.FC<MessageInputProps> = ({ sendMessage, sendAudio }) => {
  const [message, setMessage] = useState("");
  const [isRecording, setIsRecording] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      sendMessage(message);
      setMessage("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex-grow flex items-center">
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Speak, brave adventurer..."
        className="flex-grow mr-2 input-message border-2 border-brown-600 rounded bg-parchment-dark text-brown-900 focus:outline-none focus:border-brown-800 font-fantasy"
        disabled={isRecording}
      />
      <button type="submit" className="btn-send rounded font-medieval mr-2" disabled={isRecording}>
        Send
      </button>
      <AudioRecorder
        isRecording={isRecording}
        setIsRecording={setIsRecording}
        sendAudio={sendAudio}
      />
    </form>
  );
};

export default MessageInput;

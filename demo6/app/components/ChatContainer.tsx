import React, { useState, useEffect } from "react";
import { useChatState } from "../hooks/useChatState";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";
import ConnectionStatus from "./ConnectionStatus";

const ChatContainer: React.FC = () => {
  const {
    isConnected,
    transport,
    messages,
    contentSafetyEnabled,
    setContentSafetyEnabled,
    sendMessage,
  } = useChatState();

  const [instanceId] = useState(() => Math.random().toString(36).substr(2, 9));

  useEffect(() => {
    console.log(`ChatContainer mounted. Instance ID: ${instanceId}`);
    return () => {
      console.log(`ChatContainer unmounted. Instance ID: ${instanceId}`);
    };
  }, [instanceId]);

  const sendAudio = async (audio: Blob) => {
    const formData = new FormData();
    formData.append("audio", audio, "audio.pcm");
    formData.append("messages", JSON.stringify(messages));

    const response = await fetch("/api/audio", {
      method: "POST",
      body: formData,
    });

    return response.json();
  };

  return (
    <div className="pl-2 flex flex-col h-full overflow-hidden">
      <ConnectionStatus isConnected={isConnected} transport={transport} />
      <div className="flex-grow overflow-y-auto">
        <MessageList messages={messages} />
      </div>
      <div className="h-16 flex items-center">
        <MessageInput
          sendMessage={sendMessage}
          sendAudio={sendAudio}
          contentSafetyEnabled={contentSafetyEnabled}
          setContentSafetyEnabled={setContentSafetyEnabled}
        />
      </div>
    </div>
  );
};

export default ChatContainer;

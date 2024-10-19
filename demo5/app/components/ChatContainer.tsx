import React, { useState, useEffect } from "react";
import MessageInput from "./MessageInput";
import MessageList from "./MessageList";
import ContentSafetyToggle from "./ContentSafetyToggle";
import ConnectionStatus from "./ConnectionStatus";
import { useChatState } from "../hooks/useChatState";

const ChatContainer: React.FC = () => {
  const {
    isConnected,
    transport,
    messages,
    contentSafetyEnabled,
    setContentSafetyEnabled,
    sendMessage,
  } = useChatState();

  const sendAudio = async (audioBlob: Blob) => {
    const formData = new FormData();
    formData.append('audio', audioBlob, 'recording.wav');
    formData.append('messages', JSON.stringify(messages));

    try {
      const response = await fetch('/api/audio', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        // Handle the transcribed text and AI response
        setMessages((prevMessages) => [
          ...prevMessages,
          { role: 'user', content: data.transcription },
          { role: 'assistant', content: data.aiResponse },
        ]);
      } else {
        console.error('Error processing audio');
      }
    } catch (error) {
      console.error('Error sending audio:', error);
    }
  };

  return (
    <div className="pl-2 flex flex-col h-full overflow-hidden">
      <ConnectionStatus isConnected={isConnected} transport={transport} />
      <div className="flex-grow overflow-y-auto">
        <MessageList messages={messages} />
      </div>
      <div className="h-16 flex items-center">
        <MessageInput sendMessage={sendMessage} sendAudio={sendAudio} />
        <ContentSafetyToggle
          contentSafetyEnabled={contentSafetyEnabled}
          setContentSafetyEnabled={setContentSafetyEnabled}
        />
      </div>
    </div>
  );
};

export default ChatContainer;

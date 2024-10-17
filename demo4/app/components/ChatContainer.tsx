import React from "react";
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

  return (
    <div className="pl-2 flex flex-col h-full overflow-hidden">
      <ConnectionStatus isConnected={isConnected} transport={transport} />
      <div className="flex-grow overflow-y-auto">
        <MessageList messages={messages} />
      </div>
      <div className="h-16 flex items-center">
        <MessageInput sendMessage={sendMessage} />
        <ContentSafetyToggle
          contentSafetyEnabled={contentSafetyEnabled}
          setContentSafetyEnabled={setContentSafetyEnabled}
        />
      </div>
    </div>
  );
};

export default ChatContainer;

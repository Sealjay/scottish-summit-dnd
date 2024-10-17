import React from "react";
import MessageInput from "./MessageInput";
import MessageList from "./MessageList";
import { useChatState } from "../hooks/useChatState";

const ChatContainer: React.FC = () => {
  const { messages, sendMessage } = useChatState();

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="flex-grow overflow-y-auto">
        <MessageList messages={messages} />
      </div>
      <div className="h-16"> {/* Reduced height */}
        <MessageInput sendMessage={sendMessage} />
      </div>
    </div>
  );
};

export default ChatContainer;

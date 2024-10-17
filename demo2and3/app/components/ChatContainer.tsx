import ConnectionStatus from "./ConnectionStatus";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";
import ContentSafetyToggle from "./ContentSafetyToggle";
import { useChatState } from "../hooks/useChatState";

export default function ChatContainer() {
  const {
    isConnected,
    transport,
    messages,
    contentSafetyEnabled,
    setContentSafetyEnabled,
    sendMessage,
  } = useChatState();

  return (
    <div className="p-6 flex flex-col h-[calc(100vh-12rem)]">
      <ConnectionStatus isConnected={isConnected} transport={transport} />
      <MessageList messages={messages} />
      <div className="flex mt-4 items-center">
        <MessageInput sendMessage={sendMessage} />
        <ContentSafetyToggle
          contentSafetyEnabled={contentSafetyEnabled}
          setContentSafetyEnabled={setContentSafetyEnabled}
        />
      </div>
    </div>
  );
}

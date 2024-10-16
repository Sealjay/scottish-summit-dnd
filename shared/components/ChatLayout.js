import React from 'react';
import ChatContainer from './ChatContainer';
import InputArea from './InputArea';

const ChatLayout = () => {
  return (
    <div className="chat-layout">
      <ChatContainer />
      <InputArea />
    </div>
  );
};

export default ChatLayout;

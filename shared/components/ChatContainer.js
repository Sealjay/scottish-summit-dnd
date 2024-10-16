import React from 'react';
import MessageBubble from './MessageBubble';

const ChatContainer = () => {
  // This is a placeholder. In a real application, you'd manage messages with state.
  const messages = [
    { id: 1, text: 'Hello!', sender: 'Agent' },
    { id: 2, text: 'Hi there!', sender: 'User' },
  ];

  return (
    <div className="chat-container">
      {messages.map((message) => (
        <MessageBubble key={message.id} text={message.text} sender={message.sender} />
      ))}
    </div>
  );
};

export default ChatContainer;

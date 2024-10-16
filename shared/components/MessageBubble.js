import React from 'react';

const MessageBubble = ({ text, sender }) => {
  return (
    <div className={`message-bubble ${sender.toLowerCase()}`}>
      <div className="sender">{sender}</div>
      <div className="text">{text}</div>
    </div>
  );
};

export default MessageBubble;

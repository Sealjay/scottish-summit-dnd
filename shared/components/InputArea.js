import React, { useState } from 'react';

const InputArea = () => {
  const [message, setMessage] = useState('');

  const handleSend = () => {
    // This is a placeholder. In a real application, you'd send the message to a backend or update state.
    console.log('Sending message:', message);
    setMessage('');
  };

  return (
    <div className="input-area">
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type your message..."
      />
      <button onClick={handleSend}>Send</button>
    </div>
  );
};

export default InputArea;

import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';

const AmbientEventDisplay: React.FC = () => {
  const [events, setEvents] = useState<string[]>([]);

  useEffect(() => {
    const socket = io();

    socket.on('ambient-event', (event: string) => {
      setEvents((prevEvents) => [...prevEvents.slice(-3), event].filter(Boolean));
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div className="w-full md:w-[512px] h-24 overflow-y-auto bg-parchment border-2 border-gray-400 rounded-lg p-2 mt-2 text-sm">
      {events.map((event, index) => (
        <p key={index} className="mb-1">{event}</p>
      ))}
    </div>
  );
};

export default AmbientEventDisplay;

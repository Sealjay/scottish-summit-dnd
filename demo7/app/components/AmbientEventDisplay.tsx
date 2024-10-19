import React, { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";

const AmbientEventDisplay: React.FC = () => {
  const [events, setEvents] = useState<string[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const socket = io();

    socket.on("ambient-event", (event: string) => {
      setEvents((prevEvents) => [...prevEvents, event]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    const scrollToBottom = () => {
      if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      }
    };

    scrollToBottom();
    const timeoutId = setTimeout(scrollToBottom, 50);

    return () => clearTimeout(timeoutId);
  }, [events]);

  return (
    <div className="w-full md:w-[512px] flex flex-col mt-4">
      <div
        ref={scrollRef}
        className="flex-grow overflow-y-auto bg-parchment border-2 border-gray-400 rounded-lg p-2 text-sm"
        style={{
          height: '200px', // Fixed height
          maxHeight: 'calc(100vh - 512px - 6rem)',
          overflowY: 'auto', // Ensure vertical scrollbar appears when needed
        }}
      >
        {events.map((event, index) => (
          <p
            key={index}
            className={`mb-1 ${index % 2 === 0 ? "text-black" : "text-gray-600"}`}
          >
            {event}
          </p>
        ))}
      </div>
    </div>
  );
};

export default AmbientEventDisplay;

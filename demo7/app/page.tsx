"use client";

import ChatContainer from "./components/ChatContainer";
import ImageDisplay from "./components/ImageDisplay";
import "./custom.css";

export default function Home() {
  return (
    <div className="flex flex-col md:flex-row h-full overflow-hidden">
      <div className="flex-grow overflow-hidden md:mr-4">
        <ChatContainer />
      </div>
      <div className="flex flex-col items-center">
        <ImageDisplay />
      </div>
    </div>
  );
}

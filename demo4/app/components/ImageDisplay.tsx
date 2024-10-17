import React from "react";
import { useChatState } from "../hooks/useChatState";

const ImageDisplay: React.FC = () => {
  const { imageUrl } = useChatState();

  return (
    <div
      className="w-full h-48 md:h-[512px] md:w-[512px] flex-shrink-0 bg-gray-400 bg-opacity-30 border-3 border-gray-400 rounded-lg flex items-center justify-center mt-4 md:mt-0"
      style={{
        backgroundImage: imageUrl ? `url(${imageUrl})` : "none",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {!imageUrl && <p className="text-gray-600"></p>}
    </div>
  );
};

export default ImageDisplay;

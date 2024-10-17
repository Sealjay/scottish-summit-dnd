interface ContentSafetyToggleProps {
  contentSafetyEnabled: boolean;
  setContentSafetyEnabled: (enabled: boolean) => void;
}

export default function ContentSafetyToggle({
  contentSafetyEnabled,
  setContentSafetyEnabled,
}: ContentSafetyToggleProps) {
  return (
    <div className="flex items-center ml-2">
      <label className="inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          checked={contentSafetyEnabled}
          onChange={() => setContentSafetyEnabled(!contentSafetyEnabled)}
          className="sr-only peer"
        />
        <div className="relative w-14 h-7 bg-brown-400 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-brown-300 rounded-full peer peer-checked:bg-emerald-700 transition-colors duration-300">
          <div className="absolute inset-1 bg-parchment-light rounded-full shadow-inner"></div>
          <div
            className={`absolute inset-y-1 w-5 h-5 bg-red-600 rounded-full shadow transition-all duration-300 ${
              contentSafetyEnabled ? "right-1 bg-emerald-300" : "left-1"
            }`}
          >
            <div className="absolute inset-1 bg-white rounded-full"></div>
          </div>
        </div>
        <span className="ml-3 text-sm font-medium text-brown-800 font-fantasy">
          Content safety?
        </span>
      </label>
    </div>
  );
}

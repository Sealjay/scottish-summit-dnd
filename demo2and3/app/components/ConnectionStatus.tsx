interface ConnectionStatusProps {
  isConnected: boolean;
  transport: string;
}

export default function ConnectionStatus({ isConnected, transport }: ConnectionStatusProps) {
  return (
    <div className="flex justify-end mb-4 space-x-2">
      <span
        className={`px-3 py-1 text-sm font-medium rounded ${
          isConnected ? "status-connected" : "status-disconnected"
        }`}
      >
        {isConnected ? "Connected" : "Disconnected"}
      </span>
      <span className="status-transport px-3 py-1 text-sm font-medium rounded">
        {transport}
      </span>
    </div>
  );
}

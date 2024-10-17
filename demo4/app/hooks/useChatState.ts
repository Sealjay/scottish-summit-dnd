import { useState, useEffect } from 'react';
import { socket } from '../socket';
import { Message } from '../types';

export function useChatState() {
    const [isConnected, setIsConnected] = useState(false);
    const [transport, setTransport] = useState("N/A");
    const [messages, setMessages] = useState<Message[]>([]);
    const [contentSafetyEnabled, setContentSafetyEnabled] = useState(false);

    const sendMessage = (messageText: string) => {
        if (messageText.trim() !== "") {
            const newMessage: Message = {
                role: "user",
                content: messageText,
                type: "text",
                contentSafety: contentSafetyEnabled,
            };
            const updatedMessages = [...messages, newMessage];
            socket.emit("message-history", updatedMessages);
        }
    };

    useEffect(() => {
        if (socket.connected) {
            onConnect();
        }

        function onConnect() {
            setIsConnected(true);
            setTransport(socket.io.engine.transport.name);

            socket.io.engine.on("upgrade", (transport) => {
                setTransport(transport.name);
            });
        }

        function onDisconnect() {
            setIsConnected(false);
            setTransport("N/A");
        }

        function onNewMessage(message: Message) {
            setMessages((prevMessages) => [...prevMessages, message]);
        }

        socket.on("connect", onConnect);
        socket.on("disconnect", onDisconnect);
        socket.on("new-message", onNewMessage);

        return () => {
            socket.off("connect", onConnect);
            socket.off("disconnect", onDisconnect);
            socket.off("new-message", onNewMessage);
        };
    }, []);

    return {
        isConnected,
        transport,
        messages,
        contentSafetyEnabled,
        setContentSafetyEnabled,
        sendMessage,
    };
}

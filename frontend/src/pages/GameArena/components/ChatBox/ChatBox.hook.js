import { useState, useCallback, useEffect } from "react";

export const useChatBox = (socket, roomId) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  // Listen for incoming chat messages
  useEffect(() => {
    if (!socket || !roomId) return;

    const handleMessage = (msg) => {
      setMessages((prev) => [...prev, msg]);
    };

    socket.on("chat:newMessage", handleMessage);
    return () => socket.off("chat:newMessage", handleMessage);
  }, [socket, roomId]);

  const sendMessage = useCallback(() => {
    if (!input.trim() || !socket || !roomId) return;
    socket.emit("chat:message", { roomId, message: input.trim() });
    setInput("");
  }, [input, socket, roomId]);

  return { messages, input, setInput, sendMessage };
};
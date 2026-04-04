import { useState, useCallback } from "react";

export const useChatBox = (socket, roomId) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const sendMessage = useCallback(() => {
    if (!input.trim() || !socket || !roomId) return;
    socket.emit("chat:message", { roomId, message: input.trim() });
    setInput("");
  }, [input, socket, roomId]);

  const addMessage = useCallback((msg) => {
    setMessages((prev) => [...prev, msg]);
  }, []);

  return { messages, input, setInput, sendMessage, addMessage };
};
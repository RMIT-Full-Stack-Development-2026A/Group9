import { useRef, useEffect } from "react";
import "./ChatBox.css";

const ChatBox = ({ messages, input, setInput, onSend, currentUser }) => {
  const listRef = useRef(null);

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="chatbox">
      <h4 className="chatbox-title">💬 Chat</h4>
      <div className="chatbox-messages" ref={listRef}>
        {messages.length === 0 && (
          <p className="chatbox-empty">No messages yet.</p>
        )}
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`chatbox-msg ${msg.userId === currentUser ? "chatbox-msg--mine" : ""}`}
          >
            <span className="chatbox-author">{msg.username}</span>
            <span className="chatbox-text">{msg.message}</span>
          </div>
        ))}
      </div>
      <div className="chatbox-input-row">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && onSend()}
          placeholder="Type a message..."
          className="chatbox-input"
        />
        <button onClick={onSend} className="chatbox-send">Send</button>
      </div>
    </div>
  );
};

export default ChatBox;
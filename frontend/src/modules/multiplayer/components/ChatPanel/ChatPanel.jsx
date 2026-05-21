import React, { useState } from 'react';
import styles from './ChatPanel.module.css';

/*
  ChatPanel
  - Simple, presentational chat panel used in the multiplayer arena sidebar.
  - Props:
	- `messages`: array of { username, text, timestamp }
	- `onSend(text)`: callback to send a chat message
	- `messagesEndRef`: ref element used for auto-scrolling to bottom
  - Behavior:
	- Enter (no shift) sends message, Shift+Enter allows newline
	- `handleSend` validates and clears the input after sending
*/
export default function ChatPanel({ messages, onSend, messagesEndRef }) {
	const [text, setText] = useState('');

	// Send current text through provided `onSend` callback and clear input
	const handleSend = () => {
		if (!text.trim()) return;
		onSend(text);
		setText('');
	};

	// Intercept Enter for quick send (Shift+Enter stays as newline)
	const handleKeyDown = (e) => {
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault();
			handleSend();
		}
	};

	// Format timestamp for display (fallbacks to empty string on error)
	const formatTime = (timestamp) => {
		try {
			return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
		} catch {
			return '';
		}
	};

	return (
		<div className={styles.chatPanel}>
			<div className={styles.header}>
				<i className="bi bi-chat-dots"></i>
				<span>Chat</span>
			</div>
			<div className={styles.messageList}>
				{messages.length === 0 && (
					<div className={styles.empty}>No messages yet</div>
				)}
				{messages.map((msg, i) => (
					<div key={i} className={styles.message}>
						<span className={styles.username}>{msg.username}</span>
						<span className={styles.text}>{msg.text}</span>
						<span className={styles.time}>{formatTime(msg.timestamp)}</span>
					</div>
				))}
				{/* Anchor used by `useChat` to scroll to latest message */}
				<div ref={messagesEndRef} />
			</div>
			<div className={styles.inputRow}>
				<input
					className={styles.input}
					placeholder="Type a message..."
					value={text}
					onChange={(e) => setText(e.target.value)}
					onKeyDown={handleKeyDown}
				/>
				<button className={styles.sendBtn} onClick={handleSend} disabled={!text.trim()}>
					<i className="bi bi-send"></i>
				</button>
			</div>
		</div>
	);
}

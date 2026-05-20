import React, { useState } from 'react';
import styles from './ChatPanel.module.css';

export default function ChatPanel({ messages, onSend, messagesEndRef }) {
	const [text, setText] = useState('');

	const handleSend = () => {
		if (!text.trim()) return;
		onSend(text);
		setText('');
	};

	const handleKeyDown = (e) => {
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault();
			handleSend();
		}
	};

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

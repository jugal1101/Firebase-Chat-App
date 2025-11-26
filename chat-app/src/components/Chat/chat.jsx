import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import "./Chat.css";

export default function ChatPage() {
  const { state: user } = useLocation();

  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [editIndex, setEditIndex] = useState(null);

  const sendMessage = () => {
    if (!text.trim()) return;

    // If editing
    if (editIndex !== null) {
      const updated = [...messages];
      updated[editIndex].text = text;
      updated[editIndex].edited = true;
      setMessages(updated);
      setEditIndex(null);
      setText("");
      return;
    }

    // New message
    setMessages([
      ...messages,
      { sender: "me", text, edited: false }
    ]);

    setText("");
  };

  const deleteMessage = (i) => {
    const updated = messages.filter((_, index) => index !== i);
    setMessages(updated);
  };

  const startEdit = (i) => {
    setEditIndex(i);
    setText(messages[i].text);
  };

  return (
    <div className="chat-outer">

      <div className="chat-small-container">

        {/* HEADER */}
        <div className="chat-header">
          <h3 className="chat-user-name">{user?.name}</h3>
        </div>

        {/* MESSAGES */}
        <div className="chat-box">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`chat-bubble ${msg.sender === "me" ? "me" : "other"}`}
              onDoubleClick={() => deleteMessage(i)}
            >
              <span>{msg.text}</span>

              {msg.edited && <span className="edited-tag">(edited)</span>}

              <span className="edit-icon" onClick={() => startEdit(i)}>✏️</span>
            </div>
          ))}
        </div>

        {/* INPUT */}
        <div className="chat-input-box">
          <input
            className="chat-input"
            placeholder="Message..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />

          <button className="chat-send-btn" onClick={sendMessage}>
            {editIndex !== null ? "Update" : "Send"}
          </button>
        </div>
      </div>

    </div>
  );
}

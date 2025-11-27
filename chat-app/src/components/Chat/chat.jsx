import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import "./Chat.css";

import {
  collection,
  addDoc,
  onSnapshot,
  doc,
  deleteDoc,
  updateDoc,
  serverTimestamp,
  orderBy,
  query,
} from "firebase/firestore";

import { db } from "../../Firebase/firebaseConfig";

export default function ChatPage() {
  const { state: user } = useLocation();
  const chatId = "user1_user2"; // Change dynamically
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [editId, setEditId] = useState(null);
  const [menuOpenId, setMenuOpenId] = useState(null); // ID of message with open menu

  const messagesEndRef = useRef(null);

  // Load messages in real-time
  useEffect(() => {
    const ref = collection(db, "chats", chatId, "messages");
    const q = query(ref, orderBy("createdAt", "asc"));
    const unsub = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMessages(msgs);
    });

    return () => unsub();
  }, []);

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!text.trim()) return;

    const ref = collection(db, "chats", chatId, "messages");

    if (editId) {
      await updateDoc(doc(db, "chats", chatId, "messages", editId), {
        text,
        edited: true,
      });
      setEditId(null);
      setText("");
      setMenuOpenId(null);
      return;
    }

    await addDoc(ref, {
      text,
      sender: user?.name || "me",
      edited: false,
      createdAt: serverTimestamp(),
    });

    setText("");
    setMenuOpenId(null);
  };

  const deleteMessage = async (id) => {
    await deleteDoc(doc(db, "chats", chatId, "messages", id));
    if (editId === id) setEditId(null);
    setMenuOpenId(null);
  };

  const startEdit = (msg) => {
    setEditId(msg.id);
    setText(msg.text);
    setMenuOpenId(null);
  };

  const toggleMenu = (id) => {
    setMenuOpenId(menuOpenId === id ? null : id);
  };

  return (
    <div className="chat-outer">
      <div className="chat-small-container">
        <div className="chat-header">
          <h3 className="chat-user-name">{user?.name}</h3>
        </div>

        <div className="chat-box">
          {messages.map((msg) => {
            const isOwner = msg.sender === user?.name;
            return (
              <div
                key={msg.id}
                className={`msg-row ${isOwner ? "owner-row" : "receiver-row"}`}
              >
                <div
                  className={`chat-bubble ${isOwner ? "me" : "other"}`}
                  onDoubleClick={() => isOwner && toggleMenu(msg.id)}
                >
                  <span>{msg.text}</span>
                  {msg.edited && <span className="edited-tag">(edited)</span>}

                  {menuOpenId === msg.id && isOwner && (
                    <div className="menu-popup">
                      <div className="menu-item" onClick={() => startEdit(msg)}>
                        Edit
                      </div>
                      <div
                        className="menu-item delete"
                        onClick={() => deleteMessage(msg.id)}
                      >
                        Delete
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        <div className="chat-input-box">
          <input
            className="chat-input"
            placeholder="Message..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <button className="chat-send-btn" onClick={sendMessage}>
            {editId ? "Update" : "Send"}
          </button>
        </div>
      </div>
    </div>
  );
}

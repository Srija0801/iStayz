import React, { useState, useRef, useEffect } from "react";
import { getChatHistory, sendChatOption } from "../api/helpChatApi";
import "../styles/chatComponent.css";
import { X } from "lucide-react";

export default function ChatComponent({ onClose }) {
  const [messages, setMessages] = useState([]);
  const [options, setOptions] = useState([]);
  const [typing, setTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const user = JSON.parse(localStorage.getItem("user"));
  const token = user?.token;
  useEffect(() => {
    // Disable background scroll when chat opens
    document.body.style.overflow = "hidden";
    return () => {
      // Re-enable scroll when chat closes
      document.body.style.overflow = "auto";
    };
  }, []);

  useEffect(() => {
    if (!token) return;
    const loadHistory = async () => {
      try {
        const history = await getChatHistory(token);
        setMessages(history);
      } catch (err) {
        console.error("Failed to load chat history", err);
      }
    };
    loadHistory();
  }, [token]);

  useEffect(() => {
    if (messages.length === 0 && token) {
      handleSend("start");
    }
  }, [token, messages]);

  const handleSend = async (optionText) => {
    setTyping(true);
    try {
      const res = await sendChatOption(optionText, token);
      setTyping(false);
      setMessages((prev) => [...prev, { user: optionText, bot: res.reply }]);
      setOptions(res.options || []);
    } catch (err) {
      console.error("Chat error:", err);
      setTyping(false);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="chat-popup" onClick={(e) => e.stopPropagation()}>
      <div className="chat-header">
        <span>iStayZ AI Assistant</span>
        <button onClick={onClose}>
          <X size={18} />
        </button>
      </div>

      <div className="chat-body">
        {messages.map((msg, i) => (
          <div key={i}>
            {msg.user && <div className="chat-message user">{msg.user}</div>}
            {msg.bot && <div className="chat-message bot">{msg.bot}</div>}
          </div>
        ))}
        {typing && <div className="chat-message bot">Typing...</div>}
        <div ref={messagesEndRef} />
      </div>

      <div className="chat-footer">
        {options.map((opt, i) => (
          <button key={i} onClick={() => handleSend(opt)}>
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}

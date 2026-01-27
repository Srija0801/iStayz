import React, { useState } from "react";
import "../styles/Help_Center.css";
import { BsChatDotsFill } from "react-icons/bs";
import ChatComponent from "./ChatComponent";

export default function Help_Centre() {
  const [isChatOpen, setIsChatOpen] = useState(false);

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  return (
    <div className="help-center-container" onClick={toggleChat}>
      <div className="help-text">Cust Help</div>
      <div className="logo-help-container">
        <BsChatDotsFill />
      </div>

      {isChatOpen && <ChatComponent onClose={toggleChat} />}
    </div>
  );
}

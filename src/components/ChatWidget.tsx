import React from "react";

const ChatWidget: React.FC<{ onOpen?: () => void }> = ({ onOpen }) => {
  return (
    <div style={{ position: "fixed", right: 20, bottom: 20 }}>
      <button onClick={() => onOpen?.()} className="px-3 py-2 rounded-full bg-white/10 text-white">Chat</button>
    </div>
  );
};

export default ChatWidget;

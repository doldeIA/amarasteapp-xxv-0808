import React from "react";

export type Message = { sender: "assistant" | "user"; text: string };

const ChatModal: React.FC<{
  messages: Message[];
  isLoading?: boolean;
  error?: string | null;
  onClose?: () => void;
  onSendMessage?: (s: string) => Promise<void>;
  onStopGeneration?: () => void;
}> = ({ messages, isLoading, error, onClose }) => {
  return (
    <div style={{ position: "fixed", right: 20, bottom: 80, width: 340, background: "#0b0b0b", color: "#fff", padding: 12, borderRadius: 8 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <strong>Chat</strong>
        <button onClick={() => onClose?.()}>x</button>
      </div>
      <div style={{ height: 160, overflow: "auto", marginTop: 8 }}>
        {messages.map((m, i) => <div key={i} style={{ marginBottom: 6 }}><small>{m.sender}</small><div>{m.text}</div></div>)}
      </div>
      {error && <div style={{ color: "salmon" }}>{error}</div>}
    </div>
  );
};

export default ChatModal;

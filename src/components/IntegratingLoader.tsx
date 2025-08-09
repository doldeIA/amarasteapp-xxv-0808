import React from "react";

const IntegratingLoader: React.FC = () => (
  <div style={{ position: "fixed", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.6)", color: "#fff" }}>
    <div className="text-center">
      <h3 className="text-2xl">Integrando</h3>
      <div className="mt-2">⏳</div>
    </div>
  </div>
);

export default IntegratingLoader;

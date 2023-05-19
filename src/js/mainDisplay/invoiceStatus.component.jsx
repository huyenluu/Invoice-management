import React from "react";

const InvoiceStatus = ({ color, status }) => {
  return (
    <div className={`invoice-status ${color}`}>
      <div className="status-background"></div>
      <div className="status-text">
        <span className="dot"></span>
        {status}
      </div>
    </div>
  );
};

export default InvoiceStatus;

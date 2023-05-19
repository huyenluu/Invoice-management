import React from "react";
import { ReactComponent as EmptyIllustration } from "../../assets/illustration-empty.svg";

const EmptyDisplay = () => {
  return (
    <div className="empty-display-container">
      <EmptyIllustration className="empty-image" />
      <h3 className="mt-64 fs-20">There is nothing here</h3>
      <p className="mt-24 text-blue-dark">
        Create an invoice by clicking the{" "}
        <span className="fw-bold">New Invoice</span> button and get started
      </p>
    </div>
  );
};

export default EmptyDisplay;

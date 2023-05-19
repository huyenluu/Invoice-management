import React from "react";
import { findStatusButtonColor } from "../utils/helper";
import InvoiceStatus from "./invoiceStatus.component";
import arrowRight from "../../assets/icon-arrow-right.svg";

const InvoiceRow = ({ invoice }) => {
  let statusColor = findStatusButtonColor(invoice.status);

  return (
    <div className="invoice-list-container flex white-card-container">
      <div className="fw-bold text-black inv-id">#{invoice.id.slice(0, 5)}</div>
      <div className="text-blue-medium inv-due">{invoice.paymentDue}</div>
      <div className="text-blue-dark inv-client">{invoice.clientName}</div>
      <div className="fw-bold font16 text-align-center inv-total">
        ${invoice.total}
      </div>
      <div className="invoice-last-column inv-status">
        <InvoiceStatus color={statusColor} status={invoice.status} />
        <img src={arrowRight} alt="icon-arrow-right" />
      </div>
    </div>
  );
};

export default InvoiceRow;

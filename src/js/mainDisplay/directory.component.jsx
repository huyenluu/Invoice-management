import React from "react";
import { Link } from "react-router-dom";
import EmptyDisplay from "./emptyDisplay.component";
import InvoiceRow from "./invoiceRow.component";

const Directory = ({ invoices }) => {
  return (
    <div className="invoices-list-container flex">
      {invoices.length === 0 ? (
        <EmptyDisplay />
      ) : (
        invoices.map((invoice) => (
          <Link to={`/invoices/${invoice.id}`} state={invoice} key={invoice.id}>
            <InvoiceRow key={invoice.id} invoice={invoice} />
          </Link>
        ))
      )}
    </div>
  );
};

export default Directory;

import React, { useContext } from "react";
import { UserContext } from "../contexts/user.context";
import StatusFilterDropdown from "./filter-dropdown.components";

const Header = ({ invoices, onNewInvoiceClick }) => {
  const { screenWidth } = useContext(UserContext);
  const isSmallScreen = screenWidth <= 576;
  const invoiceTotalText = isSmallScreen
    ? `${invoices.length} invoices`
    : `There are ${invoices.length} total invoices`;
  const filterTitle = isSmallScreen ? "Filter" : "Filter by status";
  const buttonTitle = isSmallScreen ? "New" : "New Invoice";
  return (
    <div className="header-container">
      <div className="header-left-side">
        <h1 className={isSmallScreen ? "fs-24" : "fs-32"}>Invoices</h1>
        <div className="text-blue-dark">
          {invoices.length === 0 ? "No invoices" : invoiceTotalText}
        </div>
      </div>
      <div className="header-right-side">
        {invoices.length > 0 && <StatusFilterDropdown title={filterTitle} />}
        <div
          className="button-main button-1"
          onClick={() => onNewInvoiceClick()}
        >
          {buttonTitle}
        </div>
      </div>
    </div>
  );
};

export default Header;

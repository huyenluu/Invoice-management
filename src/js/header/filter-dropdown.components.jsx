import React, { useState, useContext } from "react";
import arrowDownIcon from "../../assets/icon-arrow-down.svg";
import { InvoicesContext } from "../contexts/invoices.context";

const StatusFilterDropdown = ({ title }) => {
  const [selectedStatuses, setSelectedStatuses] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const { invoices, filterInvoicesByStatus } = useContext(InvoicesContext);

  // Extract the list of unique statuses from the invoices data
  const options = [...new Set(invoices.map((invoice) => invoice.status))];

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleOptionSelect = (option) => {
    let newArr = selectedStatuses;
    if (selectedStatuses.includes(option)) {
      newArr = newArr.filter((el) => el !== option);
      setSelectedStatuses(newArr);
    } else {
      newArr = [...selectedStatuses, option];
      setSelectedStatuses(newArr);
    }
    filterInvoicesByStatus(newArr);
  };

  return (
    <div className="dropdown">
      <div className="fw-bold" onClick={toggleDropdown}>
        {title}
        <span>
          <img src={arrowDownIcon} alt="icon-arrow-down" />
        </span>
      </div>
      <div className="dropdown-menu" aria-labelledby="status-dropdown">
        {isOpen && (
          <div className="filter-dropdown__options">
            {options.map((option, index) => (
              <div key={index} className="filter-dropdown__option">
                <input
                  type="checkbox"
                  id={option}
                  className="checkbox-input custom-checkbox"
                  onChange={() => handleOptionSelect(option)}
                  checked={selectedStatuses.includes(option)}
                />
                <label htmlFor={option}>{option}</label>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StatusFilterDropdown;

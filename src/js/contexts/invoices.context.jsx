import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useCallback,
} from "react";
import { UserContext } from "./user.context";
import { getInvoices } from "../utils/firebase/firebase.utils";

export const InvoicesContext = createContext({
  invoices: [],
  invoiceForDisplay: [],
});

export const InvoicesProvider = ({ children }) => {
  const { currentUser } = useContext(UserContext);
  const [invoices, setInvoices] = useState([]);
  const [invoiceForDisplay, setInvoiceForDisplay] = useState([]);
  const fetchData = useCallback(async () => {
    if (currentUser) {
      try {
        const invoices = await getInvoices(currentUser.uid);
        setInvoices(invoices);
        setInvoiceForDisplay(invoices);
      } catch (error) {
        console.error(error);
      }
    }
  }, [currentUser]);
  useEffect(() => {
    fetchData();
  }, [currentUser, fetchData]);

  const filterInvoicesByStatus = (selectedStatuses) => {
    if (selectedStatuses.length > 0) {
      const filteredInvoices = invoices.filter((invoice) =>
        selectedStatuses.includes(invoice.status)
      );
      setInvoiceForDisplay(filteredInvoices);
    } else {
      setInvoiceForDisplay(invoices);
    }
  };
  const clearInvoiceFilter = () => {
    setInvoiceForDisplay(invoices);
  };

  const value = {
    invoices,
    setInvoices,
    invoiceForDisplay,
    setInvoiceForDisplay,
    filterInvoicesByStatus,
    clearInvoiceFilter,
    fetchData,
  };
  return (
    <InvoicesContext.Provider value={value}>
      {children}
    </InvoicesContext.Provider>
  );
};

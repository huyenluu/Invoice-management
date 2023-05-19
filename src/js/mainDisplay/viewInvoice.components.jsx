import React, { useContext, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { InvoicesContext } from "../contexts/invoices.context";
import { UserContext } from "../contexts/user.context";
import InvoiceStatus from "./invoiceStatus.component";
import InvoiceForm from "../invoice-forms/invoiceForm.component";
import {
  findStatusButtonColor,
  formatDate,
  curencyFormatNumber,
} from "../utils/helper";
import {
  deleteInvoiceFromFireStore,
  updateInvoiceFromFireStore,
} from "../utils/firebase/firebase.utils";
import arrowLeft from "../../assets/icon-arrow-left.svg";

const ViewInvoice = () => {
  const { fetchData } = useContext(InvoicesContext);
  const { screenWidth } = useContext(UserContext);
  const location = useLocation();
  const initialState = location.state;
  const [invoice, setInvoice] = useState(initialState);
  const [showInvoiceForm, setShowInvoiceForm] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const statusColor = invoice && findStatusButtonColor(invoice.status);
  const navigate = useNavigate();

  const deleteInvoice = async () => {
    await deleteInvoiceFromFireStore(invoice.id);
    fetchData();
    navigate("/home");
  };

  const showMarkAsPaidBtn = invoice.status === "pending";
  let showEditBtn = invoice.status === "draft" || invoice.status === "pending";

  const markAsPaid = async () => {
    setInvoice({
      ...invoice,
      status: "paid",
    });
    showEditBtn = false;
    await updateInvoiceFromFireStore(invoice.id, { status: "paid" });
    fetchData();
  };

  const toggleInvoiceForm = () => {
    setShowInvoiceForm(!showInvoiceForm);
  };

  const onCloseClick = () => {
    setShowDeleteModal(!showDeleteModal);
  };

  const isSmallScreen = screenWidth <= 576;

  return (
    <>
      {/* Edit form */}
      {showInvoiceForm && <div className="overlay"></div>}
      {showInvoiceForm && (
        <InvoiceForm
          updateInvoiceForCurrentPage={setInvoice}
          currentFormState={invoice}
          onCloseClick={toggleInvoiceForm}
        />
      )}

      {/* Delete modal */}
      {showDeleteModal && (
        <div className="modal-container">
          <div className="delete-modal white-card-container">
            <h3 className="fs-24 fw-bold">Confirm Deletion</h3>
            <div className="fs-12 text-blue-dark fw-medium mt-12">
              Are you sure you want to delete invoice #{invoice.id}? This action
              cannot be undone.
            </div>
            <div className="buttons-group mt-16 flex">
              <button
                className="button-main button-3 discard-button"
                onClick={() => onCloseClick()}
              >
                Cancel
              </button>
              <button
                className="button-main button-5"
                onClick={() => deleteInvoice()}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Invoice details card */}
      <div className="container">
        <Link to="/home">
          <img src={arrowLeft} alt="icon arrow left" />
          <span className=" ml-24 fw-medium">Go back</span>
        </Link>
        <div className="status-and-action-card white-card-container mt-32 flex">
          <div className="inline-flex">
            <div className="text-blue-dark">Status</div>
            <InvoiceStatus color={statusColor} status={invoice.status} />
          </div>
          <div className="flex action-buttons-group">
            {showEditBtn && (
              <div
                className="button-main button-3"
                onClick={() => setShowInvoiceForm(true)}
              >
                Edit
              </div>
            )}
            <div
              className="button-main button-5"
              onClick={() => setShowDeleteModal(true)}
            >
              Delete
            </div>
            {showMarkAsPaidBtn && (
              <div
                className="button-main button-2"
                onClick={() => markAsPaid()}
              >
                Mark as Paid
              </div>
            )}
          </div>
        </div>
        <div className="invoice-details-card flex white-card-container text-blue-medium mt-24">
          <div className="element-1">
            <div className="fs-16 uppercase">
              #
              <span className="text-black fw-bold">
                {invoice.id.slice(0, 5)}
              </span>
            </div>
            <div className="capitalize mt-8">{invoice.description}</div>
          </div>
          <ul className="element-2">
            <li>{invoice.senderAddress.street}</li>
            <li>{invoice.senderAddress.city}</li>
            <li>{invoice.senderAddress.postCode}</li>
            <li>{invoice.senderAddress.country}</li>
          </ul>
          <div className="element-3">
            <div>
              <div>Invoice Date</div>
              <div className="fw-bold text-black fs-15 mt-12">
                {invoice.createdAt ? formatDate(invoice.createdAt) : ""}
              </div>
            </div>
            <div className="mt-32">
              <div>Payment Due</div>
              <div className="fw-bold text-black fs-15 mt-12">
                {invoice.paymentDue ? formatDate(invoice.paymentDue) : ""}
              </div>
            </div>
          </div>
          <div className="element-4">
            <div>Bill to</div>
            <div className="fw-bold text-black fs-15 mt-12">
              {invoice.clientName}
            </div>
            <ul>
              <li>{invoice.clientAddress.street}</li>
              <li>{invoice.clientAddress.city}</li>
              <li>{invoice.clientAddress.postCode}</li>
              <li>{invoice.clientAddress.country}</li>
            </ul>
          </div>
          <div className="element-5">
            <div>Sent to</div>
            <div className="fw-bold text-black fs-15 mt-12">
              {invoice.clientEmail}
            </div>
          </div>
          <table className="items-table">
            <thead>
              <tr className="text-align-center">
                <td className="text-align-left">Item Name</td>
                <td>QTY.</td>
                <td>Price</td>
                <td className="text-align-right">Total</td>
              </tr>
            </thead>
            <tbody>
              {invoice.items.map((item) => {
                return !isSmallScreen ? (
                  <tr
                    key={item.name}
                    className="fw-bold fs-15 text-align-center"
                  >
                    <td className="text-black text-align-left">
                      {item.name ? item.name : "---"}
                    </td>
                    <td>{item.quantity}</td>
                    <td>{curencyFormatNumber(item.price)}</td>
                    <td className="text-black text-align-right">
                      {curencyFormatNumber(item.total)}
                    </td>
                  </tr>
                ) : (
                  <tr
                    key={item.name}
                    className="fw-bold fs-15 text-align-center"
                  >
                    <td className="text-align-left">
                      <div className="text-black">
                        {item.name ? item.name : "---"}
                      </div>
                      <div className="text-blue-medium fw-medium">
                        {item.quantity} x {curencyFormatNumber(item.price)}
                      </div>
                    </td>
                    <td className="text-black text-align-right">
                      {curencyFormatNumber(item.total)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <div className="items-table-totals">
            <div>Grand Total</div>
            <div className="fs-32 fw-bold">
              {curencyFormatNumber(invoice.total)}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ViewInvoice;

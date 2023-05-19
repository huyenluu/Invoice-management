import React, { useState, useContext, useEffect, useRef } from "react";
import { UserContext } from "../contexts/user.context";
import { InvoicesContext } from "../contexts/invoices.context";
import { getCurrentDate } from "../utils/helper";
import {
  addInvoiceToFireStore,
  updateInvoiceFromFireStore,
} from "../utils/firebase/firebase.utils";
import deleteIcon from "../../assets/icon-delete.svg";

const EMPTY_FORM = {
  clientAddress: {
    street: "",
    city: "",
    postCode: "",
    country: "",
  },
  clientName: "",
  clientEmail: "",
  senderAddress: {
    street: "",
    city: "",
    postCode: "",
    country: "",
  },
  createdAt: "",
  paymentDue: "",
  paymentTerms: "",
  description: "",
  items: [
    {
      name: "",
      quantity: 0,
      price: 0,
      total: 0,
    },
  ],
};

const InvoiceForm = ({
  onCloseClick,
  currentFormState,
  updateInvoiceForCurrentPage,
}) => {
  const initialFormState = currentFormState || EMPTY_FORM;
  const [formData, setFormData] = useState(initialFormState);
  const {
    clientAddress,
    senderAddress,
    clientName,
    clientEmail,
    paymentTerms,
    description,
    createdAt,
    items,
  } = formData;

  // scroll down form modal by 50 when user use tab
  useEffect(() => {
    const form = document.querySelector("form");

    function handleKeyDown(event) {
      debugger
      if (event.keyCode === 9) {
        document.getElementById("FormBody").scrollTop += 50;
      }
    }
    form.addEventListener("keydown", handleKeyDown);
    return () => {
      form.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const { currentUser } = useContext(UserContext);
  const { fetchData } = useContext(InvoicesContext);
  const userId = currentUser.uid;

  const handleInputChange = (event, index) => {
    const { name, value } = event.target;
    const keyArr = name.split(".");

    if (typeof index !== "undefined") {
      const items = [...formData.items];
      const attributeName = keyArr[1];

      // Update the specific item's quantity or price
      items[index][attributeName] = value;

      // Calculate the total value
      const { quantity, price } = items[index];
      items[index].total = quantity * price;

      // Update the state with the new items array
      setFormData({
        ...formData,
        items: items,
      });
    } else if (keyArr.length === 2) {
      // if the atribute is an object
      setFormData((prevState) => ({
        ...prevState,
        [keyArr[0]]: {
          ...prevState[keyArr[0]],
          [keyArr[1]]: value,
        },
      }));
    } else {
      // for regular object attributes
      setFormData((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };
  const handleDeleteItem = (index) => {
    const items = [...formData.items];
    items.splice(index, 1);
    setFormData((prevState) => ({
      ...prevState,
      items,
    }));
  };

  const handleAddItem = (e) => {
    e.preventDefault();
    setFormData((prevState) => ({
      ...prevState,
      items: [
        ...prevState.items,
        { name: "", quantity: 0, price: 0, total: 0 },
      ],
    }));
  };

  const resetFormFields = () => {
    setFormData(initialFormState);
  };
  const handleSaveData = async (e, invoiceStatus) => {
    e.preventDefault();
    const invoiceTotal = formData.items.reduce((total, current) => {
      return total + current.total;
    }, 0);
    const createdAtDateOj = new Date(createdAt);
    const paymentDueDate = createdAt
      ? getCurrentDate(
          new Date(
            createdAtDateOj.getTime() + paymentTerms * 24 * 60 * 60 * 1000
          )
        )
      : "";

    const invoiceObject = {
      ...formData,
      userId,
      paymentDue: paymentDueDate,
      status: invoiceStatus || formData.status,
      total: invoiceTotal,
    };

    if (!currentFormState) {
      await addInvoiceToFireStore(invoiceObject);
    } else {
      const { id, ...remainingInvoiceObject } = invoiceObject;
      await updateInvoiceFromFireStore(id, remainingInvoiceObject);
      updateInvoiceForCurrentPage(invoiceObject);
    }
    resetFormFields();
    await fetchData();
    onCloseClick();
  };
  const formTitle = currentFormState ? (
    <div className="fs-24 uppercase text-blue-medium">
      <span className="text-black fw-bold">Edit </span>#
      <span className="text-black fw-bold">{formData.id.slice(0, 5)}</span>
    </div>
  ) : (
    <h3 className="fs-24 fw-bold text-black">New Invoice</h3>
  );

  /*add an overlay to the form body 
    when user reach to form footer 
    in order to highlight the buttons*/
  const formBodyRef = useRef(null);
  const formFooterRef = useRef(null);
  const overlayDivRef = useRef(null);
  const handleScroll = () => {
    const formBody = formBodyRef.current;
    if (formBody.scrollHeight - formBody.scrollTop === formBody.clientHeight) {
      overlayDivRef.current.classList.remove("sr-only");
    } else {
      overlayDivRef.current.classList.add("sr-only");
    }
  };
  const removeOverlayDiv = () => {
    overlayDivRef.current.classList.add("sr-only");
  };

  return (
    <div className="invoice-form-holder">
      <div
        ref={overlayDivRef}
        className="form-overlay sr-only"
        onClick={removeOverlayDiv}
      ></div>
      {formTitle}
      <form
        id="InvoiceForm"
        className="invoice-form form"
        onSubmit={(e) => handleSaveData(e, "pending")}
      >
        <div
          id="FormBody"
          className="form-body-container"
          ref={formBodyRef}
          onScroll={handleScroll}
        >
          <section>
            <h4 className="fs-12 fw-bold text-purple">Bill From</h4>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="street-address">Street Address</label>
                <input
                  type="text"
                  id="senderAddress.street"
                  name="senderAddress.street"
                  value={senderAddress.street}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="city">City</label>
                <input
                  type="text"
                  id="senderAddress.city"
                  name="senderAddress.city"
                  value={senderAddress.city}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="post-code">Post Code</label>
                <input
                  type="text"
                  id="senderAddress.postCode"
                  name="senderAddress.postCode"
                  value={senderAddress.postCode}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="country">Country</label>
                <input
                  type="text"
                  id="senderAddress.country"
                  name="senderAddress.country"
                  value={senderAddress.country}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
          </section>
          <section>
            <h4 className="fs-12 fw-bold text-purple">Bill To</h4>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="client-name">Client's Name</label>
                <input
                  type="text"
                  id="clientName"
                  name="clientName"
                  value={clientName}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="client-email">Client's Email</label>
                <input
                  type="email"
                  id="clientEmail"
                  name="clientEmail"
                  value={clientEmail}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="client-address">Street Address</label>
                <input
                  type="text"
                  id="clientAddress.street"
                  name="clientAddress.street"
                  value={clientAddress.street}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="client-city">City</label>
                <input
                  type="text"
                  id="clientAddress.city"
                  name="clientAddress.city"
                  value={clientAddress.city}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="client-post-code">Post Code</label>
                <input
                  type="text"
                  id="clientAddress.postCode"
                  name="clientAddress.postCode"
                  value={clientAddress.postCode}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="client-country">Country</label>
                <input
                  type="text"
                  id="clientAddress.country"
                  name="clientAddress.country"
                  value={clientAddress.country}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="invoice-date">Invoice Date</label>
                <input
                  type="date"
                  id="invoice-date"
                  name="createdAt"
                  value={createdAt}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="payment-terms">Payment Terms</label>
                <div className="select-icon">
                  <select
                    id="payment-terms"
                    name="paymentTerms"
                    value={paymentTerms}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="1">Next 1 Day</option>
                    <option value="7">Next 7 Days</option>
                    <option value="14">Next 14 Days</option>
                    <option value="30">Next 30 Days</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="project-description">Project Description</label>
                <input
                  type="text"
                  id="project-description"
                  name="description"
                  value={description}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </section>
          <section>
            <h4 className="fs-20 fw-bold text-blue-dark">Item list</h4>
            <table className="mt-16">
              <thead>
                <tr>
                  <th>Item Name</th>
                  <th>Qty.</th>
                  <th>Price</th>
                  <th>Total</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, index) => (
                  <tr key={index}>
                    <td>
                      <label htmlFor="items-name">Item name</label>
                      <input
                        type="text"
                        id="items-name"
                        name="items.name"
                        value={item.name}
                        onChange={(e) => handleInputChange(e, index)}
                        required
                      />
                    </td>
                    <td>
                      <label htmlFor="items-quantity">Qty.</label>
                      <input
                        type="number"
                        id="items-quantity"
                        name="items.quantity"
                        value={item.quantity}
                        onChange={(e) => handleInputChange(e, index)}
                        required
                        ref={formFooterRef}
                      />
                    </td>
                    <td>
                      <label htmlFor="items-price">Price</label>
                      <input
                        id="items-price"
                        type="number"
                        name="items.price"
                        value={item.price}
                        onChange={(e) => handleInputChange(e, index)}
                        required
                      />
                    </td>
                    <td>
                      <label htmlFor="items-quantity">Total</label>
                      <input
                        id="items-quantity"
                        type="number"
                        name="items.total"
                        value={item.total}
                        readOnly
                      />
                    </td>
                    <td className="delete-icon-holder">
                      <div onClick={() => handleDeleteItem(index)}>
                        <img src={deleteIcon} alt="delete icon" />
                      </div>
                    </td>
                  </tr>
                ))}
                <tr>
                  <td colSpan="5">
                    <button
                      className="button-main button-6"
                      onClick={(e) => handleAddItem(e)}
                    >
                      Add New Item
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </section>
        </div>
        <div className="form-footer-container" ref={formFooterRef}>
          {!currentFormState && (
            <>
              <div
                className="button-main button-3 discard-button"
                onClick={() => onCloseClick()}
              >
                Discard
              </div>
              <div className="save-buttons flex">
                <button
                  className="button-main button-4 draft-button"
                  onClick={(e) => handleSaveData(e, "draft")}
                  type="button"
                >
                  Save as Draft
                </button>
                <button
                  className="button-main button-2 send-button"
                  type="submit"
                >
                  Save and Send
                </button>
              </div>
            </>
          )}
          {currentFormState && (
            <div className="edit-form-buttons-group flex">
              <div
                className="button-main button-3 discard-button"
                onClick={() => onCloseClick()}
              >
                Cancel
              </div>
              <button
                className="button-main button-4 send-button"
                onClick={(e) => handleSaveData(e)}
                type="button"
              >
                Save changes
              </button>
              <button
                className="button-main button-2 send-button"
                type="submit"
              >
                Save and Send
              </button>
            </div>
          )}
        </div>
      </form>
    </div>
  );
};

export default InvoiceForm;

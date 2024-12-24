"use client";
import React, { useState } from "react";
import { IoRemoveCircle, IoAddCircle } from "react-icons/io5";
import axiosInstance from "../instance/axiosInstance";
import { toast, ToastContainer } from "react-toastify";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function InvoiceForm() {
  const [isVatIncluded, setIsVatIncluded] = useState(false);
  const [invoiceData, setInvoiceData] = useState({
    invoice: {
      invoiceDate: "",
      customerName: "",
      customerAddress: "",
      totalAmount: 0,
      vatAmount: 0,
      grandTotal: 0,
    },
    invoiceItemList: [
      {
        description: "",
        rate: 0,
        quantity: 0,
      },
    ],
  });

  const router = useRouter();

  const handleFormChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setInvoiceData((prevState) => ({
      ...prevState,
      invoice: {
        ...prevState.invoice,
        [name]: value,
      },
    }));
  };

  const handleItemChange =
    (index: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setInvoiceData((prevState) => ({
        ...prevState,
        invoiceItemList: prevState.invoiceItemList.map((item, i) =>
          i === index
            ? {
                ...item,
                [name]: name === "description" ? value : parseFloat(value),
              }
            : item
        ),
      }));
    };

  const addItem = () => {
    setInvoiceData((prevState) => ({
      ...prevState,
      invoiceItemList: [
        ...prevState.invoiceItemList,
        {
          description: "",
          rate: 0,
          quantity: 0,
        },
      ],
    }));
  };

  const removeItem = (index: number) => () => {
    setInvoiceData((prevState) => ({
      ...prevState,
      invoiceItemList: prevState.invoiceItemList.filter((_, i) => i !== index),
    }));
  };

  const handleKeyPress =
    (index: number) => (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (
        e.key === "Tab" &&
        index === Math.min(15, invoiceData.invoiceItemList.length - 1)
      ) {
        if (invoiceData.invoiceItemList.length < 16) {
          addItem();
        } else {
          e.preventDefault(); // Disable adding more items when limit is exceeded
        }
      }
    };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await axiosInstance.post("/api/invoice/", {
        invoice: {
          ...invoiceData.invoice,
          totalAmount:
            parseFloat(getTotalAmount()) - parseFloat(getVatAmount()),
          vatAmount: parseFloat(getVatAmount()),
          grandTotal: parseFloat(getTotalAmount()),
        },
        invoiceItemList: invoiceData.invoiceItemList,
      });
      setIsVatIncluded(false);
      toast.success("Invoice created successfully");
      router.push("/invoice/invoiceDetails");
    } catch (error) {
      console.error("Error creating invoice:", error);
      toast.error("Failed to create invoice");
    }
  };

  const getVatAmount = () => {
    const vatRate = 0.13; // VAT rate 13%
    const subtotal = invoiceData.invoiceItemList.reduce(
      (total, item) => total + item.rate * item.quantity,
      0
    );
    return (subtotal * vatRate).toFixed(2);
  };

  const getTotalAmount = () => {
    const subtotal = invoiceData.invoiceItemList.reduce(
      (total, item) => total + item.rate * item.quantity,
      0
    );

    const vatAmount = isVatIncluded ? parseFloat(getVatAmount()) : 0;
    return (subtotal + vatAmount).toFixed(2);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-4xl mx-auto">
        {/* Button to Navigate to Invoice List */}
        <div className="w-full flex justify-end mb-6">
          <Link href="/invoice/invoiceList" legacyBehavior>
            <a className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-5 rounded-lg shadow-lg transition-all">
              View Previous Invoices
            </a>
          </Link>
        </div>
        <form
          onSubmit={handleSubmit}
          className="bg-gray-400 p-6 rounded-lg shadow-lg w-full max-w-4xl space-y-6"
        >
          {/* Invoice Header */}
          <div className="flex justify-between gap-4">
            <div className="w-1/2">
              <label
                htmlFor="customerName"
                className="block text-sm font-semibold text-gray-700"
              >
                Customer Name
              </label>
              <input
                type="text"
                name="customerName"
                value={invoiceData.invoice.customerName}
                onChange={handleFormChange}
                className="w-full p-2 mt-1 border rounded-md text-black"
                required
              />
            </div>
            <div className="w-1/2">
              <label
                htmlFor="customerAddress"
                className="block text-sm font-semibold text-gray-700"
              >
                Customer Address
              </label>
              <input
                type="text"
                name="customerAddress"
                value={invoiceData.invoice.customerAddress}
                onChange={handleFormChange}
                className="w-full p-2 mt-1 border rounded-md text-black"
                required
              />
            </div>
          </div>

          <div className="w-full">
            <label
              htmlFor="invoiceDate"
              className="block text-sm font-semibold text-gray-700"
            >
              Invoice Date
            </label>
            <input
              type="date"
              name="invoiceDate"
              value={invoiceData.invoice.invoiceDate}
              onChange={handleFormChange}
              className="w-full p-2 mt-1 border rounded-md text-black"
              required
            />
          </div>

          {/* Items Table */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Items</h3>
            <table className="w-full table-auto border-collapse">
              <thead>
                <tr className="bg-gray-200 text-black text-left">
                  <th className="px-4 py-2">S.N.</th>
                  <th className="px-4 py-2">Description</th>
                  <th className="px-4 py-2">Rate</th>
                  <th className="px-4 py-2">Quantity</th>
                  <th className="px-4 py-2">Total</th>
                  <th className="px-4 py-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {invoiceData.invoiceItemList.map((invoiceItem, index) => (
                  <tr key={index} className="border-b">
                    <td className="px-4 py-2">{index + 1}</td>
                    <td className="px-4 py-2">
                      <input
                        type="text"
                        name="description"
                        value={invoiceItem.description}
                        onChange={handleItemChange(index)}
                        className="w-full p-2 border rounded-md text-black"
                        required
                      />
                    </td>
                    <td className="px-4 py-2">
                      <input
                        type="number"
                        name="rate"
                        value={invoiceItem.rate}
                        onChange={handleItemChange(index)}
                        className="w-full p-2 border rounded-md text-black"
                        step="0.01"
                        required
                      />
                    </td>
                    <td className="px-4 py-2">
                      <input
                        type="number"
                        name="quantity"
                        value={invoiceItem.quantity}
                        onChange={handleItemChange(index)}
                        onKeyDown={handleKeyPress(index)}
                        className="w-full p-2 border rounded-md text-black"
                        required
                      />
                    </td>
                    <td className="px-4 py-2">
                      {(invoiceItem.rate * invoiceItem.quantity).toFixed(2)}
                    </td>
                    <td className="px-4 py-2 text-center">
                      <div className="flex items-center justify-center gap-2">
                        {invoiceData.invoiceItemList.length < 16 && (
                          <button
                            type="button"
                            onClick={addItem}
                            disabled={invoiceData.invoiceItemList.length === 16}
                            className={`flex items-center gap-1 px-3 py-2 text-sm font-semibold text-white bg-green-600 rounded-full shadow-md hover:bg-green-700 focus:ring-2 focus:ring-green-400 ${
                              invoiceData.invoiceItemList.length === 16
                                ? "cursor-not-allowed opacity-50"
                                : ""
                            }`}
                          >
                            <IoAddCircle size={18} />
                            Add
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={removeItem(index)}
                          disabled={invoiceData.invoiceItemList.length === 1}
                          className={`flex items-center gap-1 px-3 py-2 text-sm font-semibold rounded-full shadow-md focus:ring-2 focus:ring-red-400 ${
                            invoiceData.invoiceItemList.length === 1
                              ? "bg-gray-400 text-gray-700 cursor-not-allowed"
                              : "text-white bg-red-600 hover:bg-red-700"
                          }`}
                        >
                          <IoRemoveCircle size={18} />
                          Remove
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Invoice Total */}
          <div className="flex justify-between items-center my-4">
            <div className="flex gap-2">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  className="h-4 w-4 border-gray-300 rounded text-indigo-600 focus:ring-indigo-500"
                  checked={isVatIncluded}
                  onChange={() => setIsVatIncluded(!isVatIncluded)}
                />
                <p className="ml-2 text-xl font-semibold mr-4">Vat 13%:</p>
                <p className="text-xl font-semibold text-gray-700">
                  {isVatIncluded ? getVatAmount() : "0.00"}
                </p>
              </div>
            </div>
            <div className="flex justify-end items-center">
              <h3 className="text-xl font-semibold mr-4">Total</h3>
              <span className="text-xl font-semibold text-gray-700">
                ${getTotalAmount()}
              </span>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-2 bg-blue-600 text-white font-semibold rounded-md shadow-md hover:bg-blue-700 focus:outline-none"
          >
            Submit Invoice
          </button>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
}

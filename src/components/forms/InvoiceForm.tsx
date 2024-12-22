"use client";
import React, { use, useState } from "react";
import { IoRemoveCircle, IoAddCircle } from "react-icons/io5";
import axiosInstance from "../instance/axiosInstance";
import { toast, ToastContainer } from "react-toastify";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function InvoiceForm() {
  const [invoiceData, setInvoiceData] = useState({
    invoice: {
      invoiceDate: "",
      customerName: "",
      customerAddress: "",
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
      if (e.key === "Tab" && index === invoiceData.invoiceItemList.length - 1) {
        addItem();
      }
    };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const res = await axiosInstance.post("/api/invoice/", invoiceData);
      toast.success("Invoice created successfully");
      router.push("/invoice/invoiceList");
    } catch (error) {
      console.error("Error creating invoice:", error);
      toast.error("Failed to create invoice");
    }
  };

  const getTotalAmount = () => {
    return invoiceData.invoiceItemList
      .reduce((total, item) => total + item.rate * item.quantity, 0)
      .toFixed(2);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
      <div className="text-right">
        <Link href="/invoice/invoiceList">
          <a className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            View Previos Invoices
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
                      <button
                        type="button"
                        onClick={addItem}
                        className="flex items-center gap-1 px-3 py-2 text-sm font-semibold text-white bg-green-600 rounded-full shadow-md hover:bg-green-700 focus:ring-2 focus:ring-green-400"
                      >
                        <IoAddCircle size={18} />
                        Add
                      </button>
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
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-semibold">Total</h3>
          <span className="text-xl font-semibold text-gray-700">
            ${getTotalAmount()}
          </span>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full py-2 bg-blue-600 text-white font-semibold rounded-md shadow-md hover:bg-blue-700 focus:outline-none"
        >
          Submit Invoice
        </button>
      </form>
      <ToastContainer />
    </div>
  );
}

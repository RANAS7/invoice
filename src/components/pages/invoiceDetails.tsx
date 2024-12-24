import { handlePrint } from "@/utils/invoiceUtils";
import React from "react";
import { GrFormPrevious } from "react-icons/gr";
import { useRouter } from "next/navigation";
const convertor = require("number-to-words");

interface InvoiceData {
  totalAmount: number;
  id: string;
  invoiceNo: number;
  customerName: string;
  customerAddress: string;
  invoiceDate: string;
  vatAmount: number;
  grandTotal: number;
  invoiceItems: InvoiceItem[];
}

interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  rate: number;
  totalAmount: number;
}

interface InvoiceProps {
  invoiceData: InvoiceData | null;
}

const InvoiceDetails: React.FC<InvoiceProps> = ({ invoiceData }) => {
  const router = useRouter();
  return (
    <div
      id="invoiceDetails"
      className="flex py-10 flex-col justify-center items-center min-h-screen bg-[#F7F7F7]"
    >
      <div className="w-[800px] flex justify-between">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => router.back()}
            className="flex items-center text-blue-500 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-300"
          >
            <GrFormPrevious className="mr-2" />
            Back
          </button>
        </div>
        {/* Print and Download Buttons */}
        <div className="flex justify-end mb-6 gap-4">
          <button
            className="bg-gray-500 px-3 py-2 rounded-sm text-white hover:bg-gray-800"
            onClick={() => handlePrint(invoiceData)}
          >
            Print
          </button>
        </div>
      </div>
      <div className="w-[800px] bg-[#FFC5C5] border border-black p-6 rounded-lg shadow-lg">
        {/* Header */}
        <div className="flex  flex-col justify-between items-center">
          <h1 className="text-3xl font-bold text-[#333]">
            MSP Solution Pvt. Ltd.
          </h1>
          <p className="text-[#333]">Kathmandu, Nepal</p>
          <p className="text-[#333]">Invoice</p>
        </div>
        <hr className="border-t border-black my-5" />
        <div className="flex justify-between">
          <p className="text-sm text-[#333]">
            <span className="font-semibold">Invoice No: </span>
            {invoiceData ? formatInvoiceNumber(invoiceData.invoiceNo) : ""}
          </p>
          <p className="text-sm text-[#333]">
            <span className="font-semibold">Date:</span>{" "}
            {invoiceData?.invoiceDate || "N/A"}
          </p>
        </div>

        {/* Customer Details */}
        <div className="mt-6">
          {/* <h2 className="text-lg font-bold text-[#333]">Customer Details</h2> */}
          <p className="text-[#333]">
            <span className="font-semibold">M/s:</span>{" "}
            {invoiceData?.customerName || "N/A"}
          </p>
          <p className="text-[#333]">
            <span className="font-semibold">Address:</span>{" "}
            {invoiceData?.customerAddress || "N/A"}
          </p>
        </div>

        {/* Invoice Items Table */}
        {invoiceData?.invoiceItems && invoiceData.invoiceItems.length > 0 ? (
          <table className="mt-6 w-full border-collapse border border-black">
            <thead>
              <tr className="bg-[#FFC5C5]">
                <th className="border border-black p-2 text-[#333] w-12">
                  S.N.
                </th>
                <th className="border border-black p-2 text-[#333]">
                  Description
                </th>
                <th className="border border-black p-2 text-[#333]">
                  Quantity
                </th>
                <th className="border border-black p-2 text-[#333] w-32">
                  Rate
                </th>
                <th className="border border-black p-2 text-[#333] w-32">
                  Amount
                </th>
              </tr>
            </thead>
            <tbody>
              {invoiceData.invoiceItems.map((item, index) => (
                <tr key={item.id}>
                  <td className="border text-black border-black p-2 text-center">
                    {index + 1}
                  </td>
                  <td className="border text-black border-black p-2">
                    {item.description}
                  </td>
                  <td className="border text-black border-black p-2 text-center">
                    {item.quantity}
                  </td>
                  <td className="border text-black border-black p-2 text-center">
                    Rs. {item.rate.toLocaleString()} /-
                  </td>

                  <td className="border text-black border-black p-2 text-center">
                    Rs. {item.totalAmount.toLocaleString()} /-
                  </td>
                </tr>
              ))}
              <tr>
                <td
                  colSpan={2}
                  rowSpan={4}
                  className=" border text-black border-black p-2 text-center"
                >
                  <p className="text-sm italic text-black">
                    <span className="font-bold">Amount in words: </span>
                    {invoiceData
                      ? convertor
                          .toWords(invoiceData.grandTotal)
                          .replace(
                            /\b\w+\b/g,
                            (word: any) =>
                              word.charAt(0).toUpperCase() + word.slice(1)
                          )
                      : ""}
                  </p>
                </td>
              </tr>
              <tr>
                <td
                  colSpan={2}
                  className="border font-semibold text-black border-black p-2 text-center"
                >
                  Total Amount
                </td>
                <td
                  colSpan={1}
                  className="text-black text-center border border-black"
                >
                  Rs.{" "}
                  {invoiceData?.totalAmount
                    ? invoiceData.totalAmount.toLocaleString()
                    : 0}
                  /-
                </td>
              </tr>
              <tr>
                <td
                  colSpan={2}
                  className="border font-semibold text-black border-black p-2 text-center"
                >
                  VAT 13%
                </td>
                <td
                  colSpan={1}
                  className="text-black border text-center border-black"
                >
                  Rs. {(invoiceData?.vatAmount || 0).toLocaleString()}/-
                </td>
              </tr>
              <tr>
                <td
                  colSpan={2}
                  className="border font-semibold text-black border-black p-2 text-center"
                >
                  Grand Total
                </td>
                <td colSpan={1} className="text-black text-center border-black">
                  Rs. {(invoiceData?.grandTotal || 0).toLocaleString()}/-
                </td>
              </tr>
            </tbody>
          </table>
        ) : (
          <p className="mt-6 text-center text-[#333]">
            No items available in this invoice.
          </p>
        )}
        <div className="flex justify-between text-black mt-16">
          <div className="flex flex-col gap-3">
            <hr className="border-black border-1 w-full" />
            <p>Customer's Sign</p>
          </div>
          <div className="flex flex-col gap-3">
            <hr className="border-black border- w-full" />
            <p>For: MSP Solution</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper Function to Format Invoice Number
const formatInvoiceNumber = (invoiceNo: number): string => {
  return invoiceNo.toString().padStart(3, "0");
};

export default InvoiceDetails;

import React from "react";

interface InvoiceData {
  id: string;
  invoiceNo: number;
  customerName: string;
  customerAddress: string;
  invoiceDate: string;
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

const Invoice: React.FC<InvoiceProps> = ({ invoiceData }) => {
  return (
    <div className="flex justify-center items-center min-h-screen bg-[#F7F7F7]">
      <div className="w-[800px] bg-[#FFC5C5] border border-black p-6 rounded-lg shadow-lg">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-[#333]">MSP Solution</h1>
            <p className="text-[#333]">Kathmandu, Nepal</p>
            <p className="text-[#333]">Invoice</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-[#333]">
              Invoice No:{" "}
              {invoiceData ? formatInvoiceNumber(invoiceData.invoiceNo) : ""}
            </p>
            <p className="text-sm text-[#333]">
              Date: {invoiceData?.invoiceDate || "N/A"}
            </p>
          </div>
        </div>

        {/* Customer Details */}
        <div className="mt-6">
          <h2 className="text-lg font-bold text-[#333]">Customer Details</h2>
          <p className="text-[#333]">
            Name: {invoiceData?.customerName || "N/A"}
          </p>
          <p className="text-[#333]">
            Address: {invoiceData?.customerAddress || "N/A"}
          </p>
        </div>

        {/* Invoice Items Table */}
        {invoiceData?.invoiceItems && invoiceData.invoiceItems.length > 0 ? (
          <table className="mt-6 w-full border-collapse border border-black">
            <thead>
              <tr className="bg-[#FFC5C5]">
                <th className="border border-black p-2 text-[#333]">#</th>
                <th className="border border-black p-2 text-[#333]">
                  Description
                </th>
                <th className="border border-black p-2 text-[#333]">
                  Quantity
                </th>
                <th className="border border-black p-2 text-[#333]">Rate</th>
                <th className="border border-black p-2 text-[#333]">Amount</th>
              </tr>
            </thead>
            <tbody>
              {invoiceData.invoiceItems.map((item, index) => (
                <tr key={item.id}>
                  <td className="border text-black border-black p-2">
                    {index + 1}
                  </td>
                  <td className="border text-black border-black p-2">
                    {item.description}
                  </td>
                  <td className="border text-black border-black p-2">
                    {item.quantity}
                  </td>
                  <td className="border text-black border-black p-2">
                    {item.rate}
                  </td>
                  <td className="border text-black border-black p-2">
                    {item.totalAmount}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="mt-6 text-center text-[#333]">
            No items available in this invoice.
          </p>
        )}

        {/* Grand Total */}
        <div className="mt-6 text-right">
          <h3 className="text-lg font-bold text-[#333]">
            Grand Total: Rs. {invoiceData?.grandTotal || 0}
          </h3>
          <p className="text-sm italic text-[#333]">
            Amount in words:{numberToWords(invoiceData?.grandTotal || 0)}
          </p>
        </div>
      </div>
    </div>
  );
};

// Helper Function to Format Invoice Number
const formatInvoiceNumber = (invoiceNo: number): string => {
  return invoiceNo.toString().padStart(3, "0");
};

function numberToWords(num: number): string {
  if (num === 0) return "zero";

  const belowTwenty = [
    "one",
    "two",
    "three",
    "four",
    "five",
    "six",
    "seven",
    "eight",
    "nine",
    "ten",
    "eleven",
    "twelve",
    "thirteen",
    "fourteen",
    "fifteen",
    "sixteen",
    "seventeen",
    "eighteen",
    "nineteen",
  ];

  const tens = [
    "twenty",
    "thirty",
    "forty",
    "fifty",
    "sixty",
    "seventy",
    "eighty",
    "ninety",
  ];

  const thousands = ["", "thousand", "million", "billion"];

  function helper(n: number): string {
    if (n === 0) return "";
    if (n < 20) return belowTwenty[n - 1] + " ";
    if (n < 100) return tens[Math.floor(n / 10) - 2] + " " + helper(n % 10);
    if (n < 1000)
      return (
        belowTwenty[Math.floor(n / 100) - 1] + " hundred " + helper(n % 100)
      );
    return "";
  }

  let word = "";
  let index = 0;

  while (num > 0) {
    if (num % 1000 !== 0) {
      word = helper(num % 1000) + thousands[index] + " " + word;
    }
    num = Math.floor(num / 1000);
    index++;
  }

  return word.trim();
}

export default Invoice;

import React, { useState, useEffect } from "react";
import { GrFormPrevious, GrView } from "react-icons/gr";
import { useRouter } from "next/navigation";
import axiosInstance from "../instance/axiosInstance";
import { MdOutlineNavigateNext } from "react-icons/md";

interface Invoice {
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

interface InvoiceListProps {
  invoices: Invoice[];
  loading: boolean;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const InvoiceList: React.FC<InvoiceListProps> = ({
  invoices,
  loading,
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const router = useRouter();
  const [searchValue, setSearchValue] = useState("");
  const [searchResult, setSearchResult] = useState<Invoice[]>([]);

  useEffect(() => {
    if (searchValue !== "") {
      handleSearch();
    }
  }, [searchValue]);

  const handleViewInvoice = (invoiceNo: number) => {
    router.push(`/invoice/invoiceDetails?invoiceNo=${invoiceNo}`);
  };

  const formatInvoiceNumber = (invoiceNo: number): string => {
    return invoiceNo.toString().padStart(3, "0"); // Adds leading zeros to ensure 3 digits
  };

  const handleSearch = async () => {
    try {
      const response = await axiosInstance.post(
        `/api/invoice/search?searchValue=${searchValue}`
      );
      const data = response.data;
      setSearchResult(data);
    } catch (error) {
      console.error("Error searching invoices:", error);
    }
  };

  return (
    <div className="flex items-center min-h-screen bg-gray-100 p-4">
      <div className="p-6 bg-[#F7F7F7] max-w-4xl w-full mx-auto rounded-lg shadow-lg">
        <div className="flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="flex items-center text-blue-500 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-300"
          >
            <GrFormPrevious className="mr-2" />
            Back
          </button>
        </div>
        <h1 className="text-3xl font-bold mb-6 text-center text-[#333]">
          Invoice List
        </h1>

        {/* Search Input */}
        <div className="flex items-center justify-between mb-4">
          <input
            type="text"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder="Search invoices..."
            className="flex-grow text-black py-2 px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            onClick={handleSearch}
            className="ml-4 bg-blue-500 text-white py-2 px-6 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-300"
          >
            Search
          </button>
        </div>

        <table className="min-w-full bg-white border border-gray-300 shadow-md rounded-lg overflow-hidden">
          <thead className="bg-[#FFC5C5]">
            <tr>
              <th className="py-3 px-6 border-b border-gray-200 text-left text-sm font-semibold text-[#333]">
                Invoice No
              </th>
              <th className="py-3 px-6 border-b border-gray-200 text-left text-sm font-semibold text-[#333]">
                Customer
              </th>
              <th className="py-3 px-6 border-b border-gray-200 text-left text-sm font-semibold text-[#333]">
                Date
              </th>
              <th className="py-3 px-6 border-b border-gray-200 text-left text-sm font-semibold text-[#333]">
                Amount
              </th>
              <th className="py-3 px-6 border-b border-gray-200 text-center text-sm font-semibold text-[#333]">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan={5}
                  className="py-4 px-6 border-b text-center text-gray-500 font-semibold"
                >
                  Loading...
                </td>
              </tr>
            ) : searchResult.length > 0 ? (
              searchResult.map((invoice) => (
                <tr
                  key={invoice.id}
                  className="hover:bg-gray-50 transition duration-300 ease-in-out"
                >
                  <td className="py-3 px-6 border-b border-gray-200 text-sm text-[#333]">
                    {formatInvoiceNumber(invoice.invoiceNo)}
                  </td>
                  <td className="py-3 px-6 border-b border-gray-200 text-sm text-[#333]">
                    {invoice.customerName}
                  </td>
                  <td className="py-3 px-6 border-b border-gray-200 text-sm text-[#333]">
                    {invoice.invoiceDate}
                  </td>
                  <td className="py-3 px-6 border-b border-gray-200 text-sm text-[#333]">
                    Rs. {invoice.grandTotal}
                  </td>
                  <td className="py-3 px-6 border-b border-gray-200 text-center">
                    <button
                      className="bg-blue-500 text-white py-1 px-3 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-300"
                      onClick={() => handleViewInvoice(invoice.invoiceNo)}
                    >
                      <GrView />
                    </button>
                  </td>
                </tr>
              ))
            ) : invoices.length > 0 ? (
              invoices.map((invoice) => (
                <tr
                  key={invoice.id}
                  className="hover:bg-gray-50 transition duration-300 ease-in-out"
                >
                  <td className="py-3 px-6 border-b border-gray-200 text-sm text-[#333]">
                    {formatInvoiceNumber(invoice.invoiceNo)}
                  </td>
                  <td className="py-3 px-6 border-b border-gray-200 text-sm text-[#333]">
                    {invoice.customerName}
                  </td>
                  <td className="py-3 px-6 border-b border-gray-200 text-sm text-[#333]">
                    {invoice.invoiceDate}
                  </td>
                  <td className="py-3 px-6 border-b border-gray-200 text-sm text-[#333]">
                    Rs. {invoice.grandTotal}
                  </td>
                  <td className="py-3 px-6 border-b border-gray-200 text-center">
                    <button
                      className="bg-blue-500 text-white py-1 px-3 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-300"
                      onClick={() => handleViewInvoice(invoice.invoiceNo)}
                    >
                      <GrView />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={5}
                  className="py-4 px-6 border-b text-center text-gray-500 font-semibold"
                >
                  No invoices found
                </td>
              </tr>
            )}
          </tbody>
        </table>
        {/* Pagination */}
        <div className="flex justify-between items-center mt-4">
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 0}
            className="px-4 py-2 bg-gray-600 rounded-lg disabled:opacity-50"
          >
            <GrFormPrevious />{" "}
          </button>
          <span className="text-sm text-black">
            Page {currentPage + 1} of {totalPages}
          </span>
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages - 1}
            className="px-4 py-2 bg-gray-600 rounded-lg disabled:opacity-50"
          >
            <MdOutlineNavigateNext />
          </button>
        </div>
      </div>
    </div>
  );
};

export default InvoiceList;

import { GrView } from "react-icons/gr";
import { useRouter } from "next/navigation";

interface Invoice {
  id: number;
  invoiceNo: number;
  customerName: string;
  invoiceDate: string;
  grandTotal: number;
}

interface InvoiceListProps {
  invoices: Invoice[];
  loading: boolean;
}

const InvoiceList: React.FC<InvoiceListProps> = ({ invoices, loading }) => {
  const router = useRouter();

  const handleViewInvoice = (invoiceNo: number) => {
    router.push(`/invoice/invoiceDetails?invoiceNo=${invoiceNo}`);
  };

  const formatInvoiceNumber = (invoiceNo: number): string => {
    return invoiceNo.toString().padStart(3, "0"); // Adds leading zeros to ensure 3 digits
  };

  return (
    <div className="p-6 bg-[#F7F7F7] rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold mb-6 text-center text-[#333]">
        Invoice List
      </h1>
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
                  {new Date(invoice.invoiceDate).toLocaleDateString()}
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
    </div>
  );
};

export default InvoiceList;

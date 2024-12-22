"use client";
import axiosInstance from "@/components/instance/axiosInstance";
import InvoiceDetails from "@/components/pages/invoiceDetails";
import { InvoiceData } from "@/components/types/invoice";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function InvoicePage() {
  const searchParams = useSearchParams();
  const invoiceNo = searchParams.get("invoiceNo") || "";
  const [invoiceDetails, setInvoiceDetails] = useState<InvoiceData>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        if (!invoiceNo) {
          setError("No invoice number provided");
          return;
        }

        const res = await axiosInstance.get(`/api/invoice/`, {
          params: { invoiceNo },
        });

        setInvoiceDetails(res.data);
      } catch (err) {
        console.error("Error fetching invoice:", err);
        setError("Failed to load invoice data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchInvoice();
  }, [invoiceNo]);

  if (loading) {
    return <div className="text-center text-lg font-semibold">Loading...</div>;
  }

  if (error) {
    return (
      <div className="text-center text-lg font-semibold text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div>
      {invoiceDetails ? (
        <InvoiceDetails invoiceData={invoiceDetails} />
      ) : (
        <div className="text-center text-lg font-semibold">
          No details available.
        </div>
      )}
    </div>
  );
}

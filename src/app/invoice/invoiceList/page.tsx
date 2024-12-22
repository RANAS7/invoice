"use client";
import axiosInstance from "@/components/instance/axiosInstance";
import InvoiceList from "@/components/pages/invoiceList";
import React, { useEffect, useState } from "react";
import { InvoiceData } from "@/components/types/invoice";

const InvoicePage = () => {
  const [invoices, setInvoices] = useState<InvoiceData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const response = await axiosInstance.get<InvoiceData[]>(
          "/api/invoice/"
        );
        setInvoices(response.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchInvoices();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }
  return (
    <div>
      <InvoiceList invoices={invoices} loading={false} />
    </div>
  );
};

export default InvoicePage;

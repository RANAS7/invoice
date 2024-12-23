"use client";
import axiosInstance from "@/components/instance/axiosInstance";
import InvoiceList from "@/components/pages/invoiceList";
import React, { useEffect, useState } from "react";
import { InvoiceData } from "@/components/types/invoice";

const InvoicePage = () => {
  const [invoices, setInvoices] = useState<InvoiceData[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const fetchInvoices = async (page: number) => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(`/api/invoice/`, {
        params: { page, size: 10 },
      });
      setInvoices(response.data.content);
      setTotalPages(response.data.totalPages);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices(currentPage);
  }, [currentPage]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 0 && newPage < totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <InvoiceList
        invoices={invoices}
        loading={loading}
        onSearch={() => {}}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default InvoicePage;

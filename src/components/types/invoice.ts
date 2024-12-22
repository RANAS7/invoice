/**
 * Represents an invoice item
 */
export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  rate: number;
  totalAmount: number;
}

/**
 * Represents an invoice
 */
export interface InvoiceData {
  invoiceId: string;
  invoiceNo: number;
  customerName: string;
  customerAddress: string;
  invoiceDate: string;
  grandTotal: number;
  invoiceItems: InvoiceItem[];
}
/******  28b74490-b6d0-437d-9a13-953d03c71f80  *******/

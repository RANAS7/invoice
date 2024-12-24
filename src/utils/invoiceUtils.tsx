import { InvoiceData } from "@/components/types/invoice";
const convertor = require("number-to-words");

// invoiceUtils.ts
export const handlePrint = (invoiceData: InvoiceData | null) => {
  if (!invoiceData) {
    console.error("No invoice data provided.");
    return;
  }

  const itemsHTML = invoiceData.invoiceItems
    .map(
      (item, index) => `
      <tr>
        <td>${index + 1}</td>
        <td>${item.description}</td>
        <td>${item.quantity}</td>
        <td>Rs. ${item.rate} /-</td>
        <td>Rs. ${item.totalAmount} /-</td>
      </tr>`
    )
    .join("");

  const printContent = `
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Invoice Details</title>
  <style>
    body {
      margin: 0;
      font-family: Arial, sans-serif;
      background-color: #F7F7F7;
    }
    .container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: start;
      min-height: 100vh;
      background-color: #F7F7F7;
    }
    .invoice {
      width: 750px;
      background-color: #FFC5C5;
      padding: 24px;
      border-radius: 8px;
    }
    .header {
      text-align: center;
      margin-bottom: 16px;
    }
    .header h1 {
      font-size: 1.875rem; /* 3xl in Tailwind CSS */
      font-weight: bold;
      color: #333;
    }
    .header p {
      color: #333;
      margin: 4px 0;
    }
    .details {
      display: flex;
      justify-content: space-between;
      margin-top: 16px;
    }
    .details p {
      font-size: 14px;
      color: #333;
    }
    .customer {
      margin-top: 24px;
    }
    .customer p {
      font-size: 14px;
      color: #333;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 24px;
      border: 1px solid black;
    }
    thead tr {
      background-color: #FFC5C5;
    }
    th {
      border: 1px solid black;
      padding: 8px;
      text-align: center;
      color: #333;
    }
    th.w-12 {
      width: 3rem; /* 12 in Tailwind CSS */
    }
    th.w-32 {
      width: 8rem; /* 32 in Tailwind CSS */
    }
    td {
      border: 1px solid black;
      padding: 8px;
      text-align: center;
      color: black;
    }
    .footer {
      display: flex;
      justify-content: space-between;
      margin-top: 40px;
    }
    .footer div {
      text-align: center;
    }
    .footer hr {
      border: 1px solid black;
      width: 100%;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="invoice">
      <!-- Header -->
      <div class="header">
        <h1>MSP Solution Pvt. Ltd.</h1>
        <p>Kathmandu, Nepal</p>
        <p>Invoice</p>
      </div>
      <hr/>

      <!-- Invoice Details -->
      <div class="details">
        <p><strong>Invoice No: </strong>${formatInvoiceNumber(
          invoiceData.invoiceNo
        )}</p>
        <p><strong>Date:</strong> ${invoiceData.invoiceDate}</p>
      </div>

      <!-- Customer Details -->
      <div class="customer">
        <p><strong>M/s:</strong> ${invoiceData.customerName}</p>
        <p><strong>Address:</strong> ${invoiceData.customerAddress}</p>
      </div>

      <!-- Items Table -->
      <table>
        <thead>
          <tr>
            <th class="w-12">S.N.</th>
            <th>Description</th>
            <th>Quantity</th>
            <th class="w-32">Rate</th>
            <th class="w-32">Amount</th>
          </tr>
        </thead>
        <tbody>
${itemsHTML}         
        </tbody>
        <tfoot>
        <tr>
          <td colspan="2" rowSpan="4">
              <i><strong>Amount in words: </strong>${convertor.toWords(
                invoiceData.grandTotal
              )}</i>
            </td>
        </tr>
        <tr><td colspan="2"><strong>Total Amount</strong></td>
            <td>Rs. ${invoiceData.totalAmount}/-</td></tr>

      <tr><td colspan="2"><strong>Vat 13%</strong></td>
            <td>Rs. ${invoiceData.vatAmount}/-</td></tr>
   
      <tr><td colspan="2"><strong>Grand Total</strong></td>
            <td>Rs. ${invoiceData.grandTotal}/-</td></tr>
      </tfoot>
      </table>

      <!-- Footer -->
      <div class="footer">
        <div>
          <hr>
          <p>Customer's Sign</p>
        </div>
        <div>
          <hr>
          <p>For: MSP Solution</p>
        </div>
      </div>
    </div>
  </div>
</body>
</html>
`;

  const printWindow = window.open("", "_blank");
  printWindow?.document.write(printContent);
  printWindow?.document.close();
  printWindow?.print();
};

const formatInvoiceNumber = (invoiceNo: number): string => {
  return invoiceNo.toString().padStart(3, "0");
};

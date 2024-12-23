import { InvoiceData } from "@/components/types/invoice";
import jsPDF from "jspdf";

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
  <title>Invoice</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #F7F7F7;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      margin: 0;
    }
    #invoiceDetails {
      background-color: #FFC5C5;
      width: 800px;
      border: 1px solid black;
      padding: 24px;
      border-radius: 12px;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }
    .header {
      text-align: center;
    }
    .header h1 {
      font-size: 24px;
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
      margin: 16px 0;
    }
    .details p {
      font-size: 14px;
      color: #333;
    }
    .customer-details {
      margin-top: 24px;
    }
    .customer-details p {
      color: #333;
      margin: 4px 0;
    }
    .customer-details .font-bold {
      font-weight: bold;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 24px;
    }
    table, th, td {
      border: 1px solid black;
    }
    th, td {
      padding: 8px;
      text-align: center;
    }
    th {
      background-color: #FFC5C5;
      color: #333;
    }
    td {
      color: black;
    }
    .grand-total {
      font-weight: bold;
      font-size: 18px;
    }
  </style>
</head>
<body>
  <div id="invoiceDetails">
    <div class="header">
      <h1>MSP Solution Pvt. Ltd.</h1>
      <p>Kathmandu, Nepal</p>
      <p>Invoice</p>
    </div>
    <div class="details">
      <p>
        <span class="font-bold">Invoice No:</span>
        ${formatInvoiceNumber(invoiceData.invoiceNo)}
      </p>
      <p>
        <span class="font-bold">Date:</span>
        ${invoiceData.invoiceDate}
      </p>
    </div>
    <div class="customer-details">
      <p>
        <span class="font-bold">M/s:</span> ${invoiceData.customerName}
      </p>
      <p>
        <span class="font-bold">Address:</span> ${invoiceData.customerAddress}
      </p>
    </div>
    <table>
      <thead>
        <tr>
          <th>S.N.</th>
          <th>Description</th>
          <th>Quantity</th>
          <th>Rate</th>
          <th>Amount</th>
        </tr>
      </thead>
      <tbody>
        ${itemsHTML}
      </tbody>
      <tfoot>
        <tr>
          <td colspan="4" class="grand-total">Grand Total</td>
          <td class="grand-total">Rs. ${invoiceData.grandTotal} /-</td>
        </tr>
      </tfoot>
    </table>
  </div>
</body>
</html>`;

  const printWindow = window.open("", "_blank");
  printWindow?.document.write(printContent);
  printWindow?.document.close();
  printWindow?.print();
};

export const handleDownload = (invoiceData: InvoiceData | null) => {
  if (!invoiceData) {
    console.error("No invoice data provided.");
    return;
  }

  const {
    invoiceNo,
    invoiceDate,
    customerName,
    customerAddress,
    grandTotal,
    invoiceItems,
  } = invoiceData;

  const pdf = new jsPDF();

  // Margins
  const marginTop = 19.05; // 0.75 inch in mm
  const marginBottom = 19.05; // 0.75 inch in mm
  const marginLeft = 12.7; // 0.5 inch in mm
  const marginRight = 12.7; // 0.5 inch in mm
  const pageWidth = 210; // A4 width in mm
  const pageHeight = 297; // A4 height in mm
  const usableWidth = pageWidth - marginLeft - marginRight;
  const usableHeight = pageHeight - marginTop - marginBottom;

  // Set Header
  pdf.setFontSize(18);
  pdf.setFont("helvetica", "bold");
  pdf.text("MSP Solution Pvt. Ltd.", pageWidth / 2, marginTop + 10, {
    align: "center",
  });
  pdf.setFontSize(12);
  pdf.setFont("helvetica", "normal");
  pdf.text("Kathmandu, Nepal", pageWidth / 2, marginTop + 18, {
    align: "center",
  });
  pdf.text("Invoice", pageWidth / 2, marginTop + 26, {
    align: "center",
  });

  // Invoice Details
  pdf.setFontSize(10);
  pdf.setFont("helvetica", "bold");
  pdf.text("Invoice No:", marginLeft, marginTop + 40);
  pdf.setFont("helvetica", "normal");
  pdf.text(
    formatInvoiceNumber(invoiceNo),
    marginLeft + pdf.getTextWidth("Invoice No: ") + 2,
    marginTop + 40
  );

  pdf.setFont("helvetica", "bold");
  pdf.text("Date:", pageWidth - marginRight - 50, marginTop + 40);
  pdf.setFont("helvetica", "normal");
  pdf.text(
    invoiceDate,
    pageWidth - marginRight - 50 + pdf.getTextWidth("Date: ") + 2,
    marginTop + 40
  );

  // Customer Details
  pdf.setFont("helvetica", "bold");
  pdf.text("M/s:", marginLeft, marginTop + 50);
  pdf.setFont("helvetica", "normal");
  pdf.text(
    customerName,
    marginLeft + pdf.getTextWidth("M/s: ") + 2,
    marginTop + 50
  );

  pdf.setFont("helvetica", "bold");
  pdf.text("Address:", marginLeft, marginTop + 56);
  pdf.setFont("helvetica", "normal");
  pdf.text(
    customerAddress,
    marginLeft + pdf.getTextWidth("Address: ") + 2,
    marginTop + 56
  );

  // Table Header
  const startY = marginTop + 70;
  const cellPadding = 5;
  let currentY = startY;

  const drawCell = (
    text: string,
    x: number,
    y: number,
    width: number,
    height: number
  ) => {
    pdf.rect(x, y, width, height);
    pdf.text(text, x + cellPadding, y + 5, {
      maxWidth: width - 2 * cellPadding,
    });
  };

  const tableStartX = marginLeft;
  const colWidths = [
    20,
    usableWidth * 0.4,
    usableWidth * 0.15,
    usableWidth * 0.15,
    usableWidth * 0.19,
  ];

  const headers = ["S.N.", "Description", "Qty", "Rate", "Amount"];
  headers.forEach((header, index) => {
    drawCell(
      header,
      tableStartX + colWidths.slice(0, index).reduce((a, b) => a + b, 0),
      currentY,
      colWidths[index],
      10
    );
  });
  currentY += 10;

  // Table Body
  invoiceItems.forEach((item, index) => {
    const row = [
      String(index + 1),
      item.description,
      String(item.quantity),
      `Rs. ${item.rate} /-`,
      `Rs. ${item.totalAmount} /-`,
    ];
    row.forEach((cell, colIndex) => {
      drawCell(
        cell,
        tableStartX + colWidths.slice(0, colIndex).reduce((a, b) => a + b, 0),
        currentY,
        colWidths[colIndex],
        10
      );
    });
    currentY += 10;
  });

  // Grand Total Section
  currentY += 5;
  pdf.setFont("helvetica", "bold");
  pdf.text(
    `Grand Total: Rs. ${grandTotal.toFixed(2)} /-`,
    pageWidth -
      marginRight -
      pdf.getTextWidth(`Grand Total: Rs. ${grandTotal.toFixed(2)} /-`) -
      2,
    currentY
  );

  // Save the PDF
  pdf.save(`invoice_${formatInvoiceNumber(invoiceNo)}.pdf`);
};

const formatInvoiceNumber = (invoiceNo: number): string => {
  return invoiceNo.toString().padStart(3, "0");
};

// invoiceUtils.ts

export const handlePrint = () => {
  const printContent =
    document.getElementById("invoiceDetails")?.innerHTML || "";
  const printWindow = window.open("", "_blank");

  printWindow?.document.write(`
      <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              background-color: #F7F7F7;
            }
            .invoice-container {
              width: 800px;
              background-color: #FFC5C5;
              border: 1px solid black;
              padding: 20px;
              border-radius: 10px;
              box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
              margin: 20px;
            }
            /* Add other styles to match your design */
          </style>
        </head>
        <body>
          <div class="invoice-container">
            ${printContent}
          </div>
        </body>
      </html>
    `);
  printWindow?.document.close();
  printWindow?.print();
};

export const handleDownload = () => {
  const invoiceContent =
    document.getElementById("invoiceDetails")?.innerHTML || "";
  const element = document.createElement("a");
  const file = new Blob(
    [
      `
          <html>
            <head>
              <style>
                body {
                  font-family: Arial, sans-serif;
                  background-color: #F7F7F7;
                }
                .invoice-container {
                  width: 800px;
                  background-color: #FFC5C5;
                  border: 1px solid black;
                  padding: 20px;
                  border-radius: 10px;
                  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
                  margin: 20px;
                }
              </style>
            </head>
            <body>
              <div class="invoice-container">
                ${invoiceContent}
              </div>
            </body>
          </html>
        `,
    ],
    { type: "text/html" }
  );
  element.href = URL.createObjectURL(file);
  element.setAttribute("download", "invoice.html");
  element.style.display = "none";
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
};

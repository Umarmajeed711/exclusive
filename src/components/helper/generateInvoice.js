 import jsPDF from "jspdf";
 import autoTable from "jspdf-autotable";
 
 const COMPANY = {
    name: "Exclusive Store",
    address: "Karachi, Pakistan",
    phone: "+92 300 0000000",
    email: "support@exlusive.com",
  };

  /* =========================
   IMAGE HELPER (ALL FORMAT SUPPORT)
========================= */
  const loadImageAsBase64 = (url) => {
    return new Promise((resolve) => {
      if (!url) return resolve(null);

      const img = new Image();
      img.crossOrigin = "Anonymous";

      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;

        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);

        resolve(canvas.toDataURL("image/jpeg")); // universal format
      };

      img.onerror = () => resolve(null);

      img.src = url;
    });
  };

  const preloadImages = async (items) => {
    const images = [];

    for (let item of items) {
      const base64 = await loadImageAsBase64(item.image_url);
      images.push(base64);
    }

    return images;
  };

  /* =========================
   MAIN INVOICE FUNCTION
========================= */
 export const generateInvoice = async (order) => {
    const doc = new jsPDF();

    const images = await preloadImages(order.items);

    /* =========================
     HEADER
  ========================= */
    doc.setFontSize(18);
    doc.setTextColor(40);
    doc.text("INVOICE", 14, 20);

    doc.setFontSize(10);
    doc.text(COMPANY.name, 14, 30);
    doc.text(COMPANY.address, 14, 35);
    doc.text(COMPANY.phone, 14, 40);
    doc.text(COMPANY.email, 14, 45);

    /* =========================
     ORDER INFO
  ========================= */
    doc.text(`Invoice #: INV-${order.order_id}`, 140, 30);
    doc.text(
      `Date: ${new Date(order.order_date).toLocaleDateString()}`,
      140,
      35,
    );
    doc.text(`Payment: ${order.payment_status}`, 140, 40);

    /* =========================
     CUSTOMER INFO
  ========================= */
    doc.text("Bill To:", 14, 60);
    doc.setFont("helvetica", "bold");
    doc.text(order.shipping_name || "-", 14, 66);
    doc.setFont("helvetica", "normal");
    doc.text(order.shipping_phone || "-", 14, 72);
    doc.text(order.shipping_address || "-", 14, 78);

    /* =========================
     PREPARE TABLE
  ========================= */
    let tableRows = [];

    let subtotal = 0;

    for (let i = 0; i < order?.items?.length; i++) {
      const item = order.items[i];

      const total = item.quantity * item.price;
      subtotal += total;

      tableRows.push([
        i + 1,
        "", // image column
        item.product_name || "Product",
        item.quantity,
        `$${item.price}`,
        `$${total}`,
      ]);
    }

    /* =========================
     TABLE
  ========================= */
    autoTable(doc, {
      startY: 90,
      head: [["#", "Image", "Product", "Qty", "Price", "Total"]],
      body: tableRows,

      didDrawCell: (data) => {
        if (data.section === "body" && data.column.index === 1) {
          const img = images[data.row.index];

          if (img) {
            doc.addImage(img, "JPEG", data.cell.x + 2, data.cell.y + 2, 10, 5);
          }
        }
      },
    });

    /* =========================
     TOTAL CALCULATION
  ========================= */
    const finalY = doc.lastAutoTable.finalY + 10;

    const taxRate = 0.05; // 5%
    const tax = subtotal * taxRate;

    const discount = order.discount || 0;

    const grandTotal = subtotal + tax - discount;

    doc.setFontSize(11);

    doc.text(`Subtotal: $${subtotal.toFixed(2)}`, 140, finalY);
    doc.text(`Tax (5%): $${tax.toFixed(2)}`, 140, finalY + 6);
    doc.text(`Discount: $${discount}`, 140, finalY + 12);

    doc.setFont("helvetica", "bold");
    doc.text(`Total: $${grandTotal.toFixed(2)}`, 140, finalY + 20);

    /* =========================
     FOOTER
  ========================= */
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);

    doc.text("Thank you for shopping with us!", 14, finalY + 30);

    doc.text("This is a system generated invoice.", 14, finalY + 36);

    /* =========================
     SAVE
  ========================= */
    doc.save(`invoice-${order.order_id}.pdf`);
  };
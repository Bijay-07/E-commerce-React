import { jsPDF } from 'jspdf';
import logo from '../assets/Markus_Logo.jpeg';

const formatDate = (dateStr) =>
  new Date(dateStr).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

// jsPDF needs a base64 data URL to embed an image reliably across browsers,
// so we fetch the Vite-bundled logo asset and convert it once per call.
const loadImageAsBase64 = async (url) => {
  const response = await fetch(url);
  const blob = await response.blob();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

// Builds and downloads a PDF receipt for a delivered order.
// Expects `order` to be a populated order object (order.user has name/email).
export const generateReceiptPDF = async (order) => {
  const doc = new jsPDF();
  const marginX = 20;
  let y = 20;

  // Logo (top-left) — falls back gracefully to text-only header if it fails to load
  try {
    const logoBase64 = await loadImageAsBase64(logo);
    doc.addImage(logoBase64, 'JPEG', marginX, y - 8, 18, 18);
  } catch {
    // If the logo can't be loaded (e.g. missing file), just skip it silently
  }

  // Header — text shifted right to leave room for the logo
  const textX = marginX + 24;
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('StoreName', textX, y);

  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.text('Order Receipt', textX, y + 7);

  doc.setDrawColor(200);
  y += 20;
  doc.line(marginX, y, 190, y);
  y += 10;

  // Order meta
  doc.setFontSize(10);
  doc.text(`Order ID: ${order._id}`, marginX, y);
  y += 6;
  doc.text(`Order Date: ${formatDate(order.createdAt)}`, marginX, y);
  y += 6;
  if (order.deliveredAt) {
    doc.text(`Delivered On: ${formatDate(order.deliveredAt)}`, marginX, y);
    y += 6;
  }
  doc.text(`Payment Method: ${order.paymentMethod?.toUpperCase() || '—'}`, marginX, y);
  y += 10;

  // Customer + shipping
  doc.setFont('helvetica', 'bold');
  doc.text('Billed To', marginX, y);
  doc.setFont('helvetica', 'normal');
  y += 6;
  doc.text(order.user?.name || '—', marginX, y);
  y += 5;
  doc.text(order.user?.email || '—', marginX, y);
  y += 5;

  const addr = order.shippingAddress || {};
  const addressLine = [addr.street, addr.city, addr.state, addr.zipCode, addr.country]
    .filter(Boolean)
    .join(', ');
  if (addressLine) {
    doc.text(addressLine, marginX, y, { maxWidth: 170 });
    y += 10;
  } else {
    y += 5;
  }

  // Items table header
  y += 4;
  doc.setFont('helvetica', 'bold');
  doc.text('Item', marginX, y);
  doc.text('Qty', 130, y);
  doc.text('Price', 150, y);
  doc.text('Subtotal', 175, y);
  y += 3;
  doc.line(marginX, y, 190, y);
  y += 6;

  doc.setFont('helvetica', 'normal');
  order.items.forEach((item) => {
    doc.text(item.name, marginX, y, { maxWidth: 100 });
    doc.text(String(item.quantity), 130, y);
    doc.text(`$${item.price.toFixed(2)}`, 150, y);
    doc.text(`$${(item.price * item.quantity).toFixed(2)}`, 175, y);
    y += 7;
  });

  y += 3;
  doc.line(marginX, y, 190, y);
  y += 8;

  // Totals
  doc.setFontSize(9);
  doc.text('Items Total', 140, y);
  doc.text(`$${order.itemsPrice.toFixed(2)}`, 175, y);
  y += 6;
  doc.text('Shipping', 140, y);
  doc.text(`$${order.shippingPrice.toFixed(2)}`, 175, y);
  y += 6;

  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Total', 140, y);
  doc.text(`$${order.totalPrice.toFixed(2)}`, 175, y);

  // Footer
  y += 20;
  doc.setFontSize(9);
  doc.setFont('helvetica', 'italic');
  doc.setTextColor(120);
  doc.text('Thank you for shopping with StoreName!', marginX, y);

  doc.save(`receipt-${order._id}.pdf`);
};
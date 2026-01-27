import React from "react";
import jsPDF from "jspdf";

export default function InvoiceTest() {
  const booking = {
    id: "BK12345",
    guestName: "John Doe",
    hotelName: "iStayZ Hotel",
    roomType: "Deluxe",
    checkIn: "2025-09-20",
    checkOut: "2025-09-22",
    amount: 4500,
    paymentStatus: "Paid",
  };

  const downloadInvoice = () => {
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.text("Hotel Invoice", 70, 20);

    doc.setFontSize(12);
    doc.text(`Booking ID: ${booking.id}`, 20, 40);
    doc.text(`Guest: ${booking.guestName}`, 20, 50);
    doc.text(`Hotel: ${booking.hotelName}`, 20, 60);
    doc.text(`Room: ${booking.roomType}`, 20, 70);
    doc.text(`Check-in: ${booking.checkIn}`, 20, 80);
    doc.text(`Check-out: ${booking.checkOut}`, 20, 90);
    doc.text(`Amount: ₹${booking.amount}`, 20, 100);
    doc.text(`Payment: ${booking.paymentStatus}`, 20, 110);

    doc.save("invoice.pdf");
  };

  return (
    <div>
      <h2>Test Invoice Download</h2>
      <button onClick={downloadInvoice}>Download Invoice</button>
    </div>
  );
}

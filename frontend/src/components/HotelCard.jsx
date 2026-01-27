import React from "react";
import "../styles/HotelCard.css";
import { jsPDF } from "jspdf";
import logo from "../assets/hrs_logo/ECE6B664-03A1-473F-B513-AF41B2361AE3_1_201_a.jpeg";

export default function HotelCard({
  hotel,
  checkIn,
  checkOut,
  people,
  totalPrice,
  onRemove,
  removeButtonText = "Remove",
  isWishlist = false, // 👈 new prop to control invoice visibility
}) {
  if (!hotel) return null;

  const handleDownloadInvoice = () => {
    const doc = new jsPDF();

    // ===== HEADER =====
    doc.addImage(logo, "JPEG", 15, 10, 30, 20);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.text("ISTAYZ Invoice", 105, 22, { align: "center" });

    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text("Thank you for booking with ISTAYZ!", 105, 30, {
      align: "center",
    });

    doc.setDrawColor(180);
    doc.line(10, 36, 200, 36);

    const invoiceId = `INV-${hotel.id}-${Date.now()}`;
    const issueDate = new Date().toLocaleDateString();

    doc.setFont("helvetica", "bold");
    doc.text("Invoice Details", 15, 46);
    doc.setFont("helvetica", "normal");
    doc.text(`Invoice ID: ${invoiceId}`, 15, 53);
    doc.text(`Date Issued: ${issueDate}`, 15, 60);
    doc.text("Status: Confirmed ✅", 15, 67);

    // ===== BOOKING SUMMARY =====
    const boxX = 10;
    const boxY = 78;
    const boxWidth = 190;
    const boxHeight = 65;
    doc.setDrawColor(120);
    doc.setLineWidth(0.3);
    doc.roundedRect(boxX, boxY, boxWidth, boxHeight, 3, 3);

    doc.setFont("helvetica", "bold");
    doc.text("Booking Summary", boxX + 8, boxY + 10);
    doc.setFont("helvetica", "normal");

    const details = [
      ["Hotel Name", hotel.name],
      ["City", hotel.city],
      ["Guests", people || 1],
      ["Check-In", new Date(checkIn).toLocaleDateString()],
      ["Check-Out", new Date(checkOut).toLocaleDateString()],
      ["Price/Night", `₹${hotel.price_per_night || hotel.price || "N/A"}`],
      [
        "Total Price",
        `₹${
          totalPrice || hotel.price_per_night * people || hotel.price * people
        }`,
      ],
    ];

    let y = boxY + 20;
    details.forEach(([label, value]) => {
      doc.text(`${label}:`, boxX + 15, y);
      doc.text(`${value}`, boxX + 80, y);
      y += 8;
    });

    // ===== FOOTER =====
    doc.setFont("helvetica", "italic");
    doc.setTextColor(100);
    doc.text(
      "This is a computer-generated invoice. No signature required.",
      105,
      160,
      { align: "center" }
    );

    doc.setTextColor(0);
    doc.setFont("helvetica", "bold");
    doc.text("ISTAYZ Pvt. Ltd.", 105, 168, { align: "center" });
    doc.setFont("helvetica", "normal");
    doc.text("support@istayz.com | +91-999-888-7777", 105, 174, {
      align: "center",
    });

    doc.save(`Invoice_${hotel.name}.pdf`);
  };

  return (
    <div className="hotel-card">
      <div className="hotel-card-details">
        <h3>{hotel.name}</h3>
        <p>{hotel.city}</p>
        <p>{hotel.description}</p>

        {checkIn && checkOut && (
          <p>
            Stay: {new Date(checkIn).toLocaleDateString()} -{" "}
            {new Date(checkOut).toLocaleDateString()}
          </p>
        )}

        {people && <p>Guests: {people}</p>}
        {totalPrice && <p>Total Price: ₹{totalPrice}</p>}

        <div className="hotel-card-actions">
          {onRemove && (
            <button className="remove-btn" onClick={() => onRemove(hotel.id)}>
              {removeButtonText}
            </button>
          )}

          {/* 👇 Show invoice button only for bookings */}
          {!isWishlist && (
            <button className="invoice-btn" onClick={handleDownloadInvoice}>
              Download Invoice
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

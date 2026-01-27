import React from "react";
import "../styles/coupon_blog.css";
import { toast } from "react-toastify";

export default function Coupon_Blog({ coupon }) {
  const coupon_code_copy_Handler = () => {
    if (!coupon?.code) return;
    navigator.clipboard.writeText(coupon.code).then(() => {
      toast.success(`Coupon ${coupon.code} copied to clipboard`);
    });
  };

  return (
    <div className="coupons-blog">
      <div className="coupon-code">
        <h2 id="coupon-code-value">{coupon.code}</h2>
      </div>

      <div className="coupon-description">
        <p>Applicable for UPI payments only</p>
        {coupon?.maxDiscountAmount && coupon?.minPurchaseAmount && (
          <p>
            Discount range: ₹{coupon.maxDiscountAmount} – ₹
            {coupon.minPurchaseAmount}
          </p>
        )}
        {coupon?.expiryDate && (
          <p>
            Valid till:{" "}
            {new Date(coupon.expiryDate).toLocaleDateString("en-IN", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}
          </p>
        )}
      </div>

      <div className="copy-button">
        <button type="button" onClick={coupon_code_copy_Handler}>
          Copy Code
        </button>
      </div>
    </div>
  );
}

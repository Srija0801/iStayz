import React, { useEffect, useState } from "react";
import styles from "../styles/Login.module.css";
import { verifyOtp, sendOtp } from "../api/authApi";

export default function OtpDiv({ onClose, loginEmail }) {
  const [userOtp, setUserOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [timer, setTimer] = useState(0); // starts at 0
  const [otpExpired, setOtpExpired] = useState(false);
  const [intervalId, setIntervalId] = useState(null);
  const [otpSent, setOtpSent] = useState(false);

  // Disable background scroll when OTP modal is open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
      if (intervalId) clearInterval(intervalId);
    };
  }, [intervalId]);

  // Function to send OTP
  const sendOtpNow = async () => {
    if (!loginEmail) return setMessage("Email not provided");
    try {
      setMessage("Sending OTP...");
      await sendOtp(loginEmail);
      setMessage("OTP sent successfully!");
      setOtpSent(true);
      startTimer();
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to send OTP.");
    }
  };

  // Start countdown timer
  const startTimer = () => {
    if (intervalId) clearInterval(intervalId);

    setTimer(5 * 60); // 5 minutes
    setOtpExpired(false);

    const newIntervalId = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(newIntervalId);
          setOtpExpired(true);
          setMessage("OTP expired. Please resend OTP.");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    setIntervalId(newIntervalId);
  };

  // Verify OTP and reset password
  const resetOtpHandler = async () => {
    if (!loginEmail || !userOtp || !newPassword) {
      setMessage("Please fill all fields.");
      return;
    }

    if (otpExpired) {
      setMessage("OTP expired. Please resend OTP.");
      return;
    }

    try {
      setLoading(true);
      const response = await verifyOtp(loginEmail, userOtp, newPassword);
      setMessage(response.message || "Password reset successful!");
      setTimeout(() => onClose(), 1500);
    } catch (error) {
      setMessage(
        error.response?.data?.message || "Invalid OTP or something went wrong."
      );
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP handler
  const resendOtpHandler = async () => {
    await sendOtpNow();
  };

  // Format timer as MM:SS
  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  return (
    <div className={styles.otpOverlay}>
      <div className={styles.otpContainer}>
        <h2>Verify OTP</h2>
        <p>
          Enter the OTP sent to <strong>{loginEmail}</strong>
        </p>

        {!otpSent && (
          <button className={styles.resendBtn} onClick={sendOtpNow}>
            Send OTP
          </button>
        )}

        <input
          type="text"
          placeholder="Enter OTP"
          maxLength="6"
          className={styles.otpInput}
          value={userOtp}
          onChange={(e) => setUserOtp(e.target.value)}
        />

        <input
          type="password"
          placeholder="Enter New Password"
          className={styles.otpInput}
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />

        {message && <p className={styles.otpMessage}>{message}</p>}

        <div className={styles.otpButtons}>
          <button
            className={styles.verifyBtn}
            onClick={resetOtpHandler}
            disabled={loading || !otpSent || otpExpired}
          >
            {otpExpired ? "OTP Expired" : loading ? "Verifying..." : "Verify"}
          </button>
          <button className={styles.cancelBtn} onClick={onClose}>
            Cancel
          </button>
        </div>

        {otpSent && (
          <div className={styles.timerSection}>
            {otpExpired ? (
              <button className={styles.resendBtn} onClick={resendOtpHandler}>
                Resend OTP
              </button>
            ) : (
              <p>OTP expires in {formatTime(timer)}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

import React, { useEffect, useState } from "react";
import "../styles/adminDashboard.css";
import {
  getAdminStats,
  getAllUsers,
  getAllBookings,
  getAllReviews,
  deleteUser,
  deleteBooking,
  deleteReview,
  getAllCoupons,
  createCoupon,
  updateCoupon,
  deleteCoupon,
  getAllPayments,
  deletePayment,
} from "../api/adminApi";
import { toast } from "react-toastify";

function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalBookings: 0,
    totalReviews: 0,
    totalRevenue: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [users, setUsers] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [coupons, setCoupons] = useState([]);
  const [payments, setPayments] = useState([]);

  const [activeTab, setActiveTab] = useState("stats"); // stats | users | bookings | reviews | coupons | payments

  const [couponForm, setCouponForm] = useState({
    code: "",
    discountPercentage: 0,
    maxDiscountAmount: 0,
    minPurchaseAmount: 0,
    expiryDate: "",
    isActive: true,
    _id: null,
  });

  // Fetch dashboard stats
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getAdminStats();
        setStats(data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  // Fetch data based on active tab
  useEffect(() => {
    if (activeTab === "users") fetchUsers();
    if (activeTab === "bookings") fetchBookings();
    if (activeTab === "reviews") fetchReviews();
    if (activeTab === "coupons") fetchCoupons();
    if (activeTab === "payments") fetchPayments();
  }, [activeTab]);

  // Fetching Functions
  const fetchUsers = async () => {
    try {
      const data = await getAllUsers();
      setUsers(data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchBookings = async () => {
    try {
      const data = await getAllBookings();
      setBookings(data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchReviews = async () => {
    try {
      const data = await getAllReviews();
      setReviews(data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchCoupons = async () => {
    try {
      const data = await getAllCoupons();
      setCoupons(Array.isArray(data) ? data : data.coupons || []);
    } catch (err) {
      console.error(err);
      setCoupons([]);
    }
  };

  const fetchPayments = async () => {
    try {
      const data = await getAllPayments();
      setPayments(data || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load payments");
    }
  };

  // Delete Handlers
  const handleDeleteUser = async (id) => {
    try {
      await deleteUser(id);
      setUsers(users.filter((u) => u._id !== id));
      toast.success("User deleted successfully!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete user");
    }
  };

  const handleDeleteBooking = async (id) => {
    try {
      await deleteBooking(id);
      setBookings(bookings.filter((b) => b._id !== id));
      toast.success("Booking deleted successfully!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete booking");
    }
  };

  const handleDeleteReview = async (id) => {
    try {
      await deleteReview(id);
      setReviews(reviews.filter((r) => r._id !== id));
      toast.success("Review deleted successfully!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete review");
    }
  };

  const handleDeleteCoupon = async (id) => {
    try {
      await deleteCoupon(id);
      setCoupons(coupons.filter((c) => c._id !== id));
      toast.success("Coupon deleted successfully!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete coupon");
    }
  };

  const handleDeletePayment = async (id) => {
    try {
      await deletePayment(id);
      setPayments(payments.filter((p) => p._id !== id));
      toast.success("Payment deleted successfully!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete payment");
    }
  };

  // Update Handlers
  const handleUpdatePaymentStatus = async (id, status) => {
    try {
      const updated = await updatePaymentStatus(id, { status });
      setPayments(payments.map((p) => (p._id === id ? updated : p)));
      toast.success("Payment status updated!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update payment");
    }
  };

  // Coupon Handlers
  const handleCouponSubmit = async (e) => {
    e.preventDefault();
    try {
      if (couponForm._id) {
        const updated = await updateCoupon(couponForm._id, couponForm);
        setCoupons(
          coupons.map((c) =>
            c._id === updated.coupon._id ? updated.coupon : c
          )
        );
        toast.success("Coupon updated successfully!");
      } else {
        const created = await createCoupon(couponForm);
        setCoupons([created.coupon, ...coupons]);
        toast.success("Coupon created successfully!");
      }

      setCouponForm({
        code: "",
        discountPercentage: 0,
        maxDiscountAmount: 0,
        minPurchaseAmount: 0,
        expiryDate: "",
        isActive: true,
        _id: null,
      });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save coupon");
    }
  };

  const handleEditCoupon = (coupon) => {
    setCouponForm({
      code: coupon.code,
      discountPercentage: coupon.discountPercentage,
      maxDiscountAmount: coupon.maxDiscountAmount,
      minPurchaseAmount: coupon.minPurchaseAmount,
      expiryDate: coupon.expiryDate.split("T")[0],
      isActive: coupon.isActive,
      _id: coupon._id,
    });
  };

  if (loading) return <p className="loading">Loading dashboard...</p>;
  if (error) return <p className="error">Error: {error}</p>;

  return (
    <div className="admin-dashboard-container">
      <h2 className="dashboard-title">Admin Dashboard</h2>

      <div className="tabs">
        <button onClick={() => setActiveTab("stats")}>Stats</button>
        <button onClick={() => setActiveTab("users")}>Users</button>
        <button onClick={() => setActiveTab("bookings")}>Bookings</button>
        <button onClick={() => setActiveTab("reviews")}>Reviews</button>
        <button onClick={() => setActiveTab("coupons")}>Coupons</button>
        <button onClick={() => setActiveTab("payments")}>Payments</button>
      </div>

      {/* --- Stats Tab --- */}
      {activeTab === "stats" && (
        <div className="stats-grid">
          <div className="stat-card users">
            <h3>👥 Total Users</h3>
            <p>{stats.totalUsers}</p>
            <span>Registered users</span>
          </div>
          <div className="stat-card bookings">
            <h3>🧾 Total Bookings</h3>
            <p>{stats.totalBookings}</p>
            <span>All bookings made</span>
          </div>
          <div className="stat-card reviews">
            <h3>⭐ Total Reviews</h3>
            <p>{stats.totalReviews}</p>
            <span>User feedback received</span>
          </div>
          <div className="stat-card revenue">
            <h3>💰 Total Revenue</h3>
            <p>₹{stats.totalRevenue.toLocaleString()}</p>
            <span>Overall revenue</span>
          </div>
        </div>
      )}

      {/* --- Users Tab --- */}
      {activeTab === "users" && (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td>{user.fullName}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>
                  <button onClick={() => handleDeleteUser(user._id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* --- Bookings Tab --- */}
      {activeTab === "bookings" && (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Booking ID</th>
              <th>User</th>
              <th>Hotel</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(bookings) &&
              bookings.map((b) => {
                const user = users?.find((u) => u?._id === b?.user?._id);
                return (
                  <tr key={b?._id || Math.random()}>
                    <td>{b?._id || "N/A"}</td>
                    <td>
                      {user?.fullName || b?.user?.fullName || "Unknown User"}
                    </td>
                    <td>{b?.hotel?.name || "N/A"}</td>
                    <td>{"Booked"}</td>
                    <td>
                      <button onClick={() => handleDeleteBooking(b?._id)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      )}

      {/* --- Reviews Tab --- */}
      {activeTab === "reviews" && (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Review ID</th>
              <th>User</th>
              <th>Rating</th>
              <th>Comment</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {reviews.map((r) => (
              <tr key={r._id}>
                <td>{r._id}</td>
                <td>{r.createdBy?.fullName}</td>
                <td>{r.rating}</td>
                <td>{r.comment}</td>
                <td>
                  <button onClick={() => handleDeleteReview(r._id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* --- Coupons Tab --- */}
      {activeTab === "coupons" && (
        <div className="coupons-tab">
          <h3>Create / Edit Coupon</h3>
          <form className="coupon-form" onSubmit={handleCouponSubmit}>
            <input
              type="text"
              placeholder="Code"
              value={couponForm.code}
              onChange={(e) =>
                setCouponForm({ ...couponForm, code: e.target.value })
              }
              required
            />
            <input
              type="number"
              placeholder="Discount %"
              value={couponForm.discountPercentage}
              onChange={(e) =>
                setCouponForm({
                  ...couponForm,
                  discountPercentage: e.target.value,
                })
              }
              required
            />
            <input
              type="number"
              placeholder="Max Discount Amount"
              value={couponForm.maxDiscountAmount}
              onChange={(e) =>
                setCouponForm({
                  ...couponForm,
                  maxDiscountAmount: e.target.value,
                })
              }
            />
            <input
              type="number"
              placeholder="Min Purchase Amount"
              value={couponForm.minPurchaseAmount}
              onChange={(e) =>
                setCouponForm({
                  ...couponForm,
                  minPurchaseAmount: e.target.value,
                })
              }
            />
            <input
              type="date"
              placeholder="Expiry Date"
              value={couponForm.expiryDate}
              onChange={(e) =>
                setCouponForm({ ...couponForm, expiryDate: e.target.value })
              }
              required
            />
            <select
              value={couponForm.isActive}
              onChange={(e) =>
                setCouponForm({
                  ...couponForm,
                  isActive: e.target.value === "true",
                })
              }
            >
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
            <button type="submit">
              {couponForm._id ? "Update Coupon" : "Create Coupon"}
            </button>
          </form>

          <table className="admin-table">
            <thead>
              <tr>
                <th>Code</th>
                <th>Discount %</th>
                <th>Max Amount</th>
                <th>Min Purchase</th>
                <th>Expiry Date</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(coupons) &&
                coupons.map((c) => (
                  <tr key={c._id}>
                    <td>{c.code}</td>
                    <td>{c.discountPercentage}</td>
                    <td>{c.maxDiscountAmount}</td>
                    <td>{c.minPurchaseAmount}</td>
                    <td>{new Date(c.expiryDate).toLocaleDateString()}</td>
                    <td>{c.isActive ? "Active" : "Inactive"}</td>
                    <td>
                      <button onClick={() => handleEditCoupon(c)}>Edit</button>
                      <button onClick={() => handleDeleteCoupon(c._id)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}

      {/* --- Payments Tab --- */}
      {activeTab === "payments" && (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Payment ID</th>
              <th>User</th>
              <th>Order ID</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((p) => (
              <tr key={p._id}>
                <td>{p._id}</td>
                <td>{p.userId?.fullName || "Unknown"}</td>
                <td>{p.orderId}</td>
                <td>₹{p.amount}</td>
                <td>{p.status}</td>
                <td>
                  <button onClick={() => handleDeletePayment(p._id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default AdminDashboard;

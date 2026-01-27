import React, { useEffect, useState } from "react";
import { getAllBookings, updateBooking, deleteBooking } from "../api/adminApi";

function BookingsManagement() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {
    try {
      const data = await getAllBookings();
      setBookings(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Delete this booking?")) {
      await deleteBooking(id);
      fetchBookings();
    }
  };

  const handleStatusChange = async (booking, status) => {
    await updateBooking(booking._id, { status });
    fetchBookings();
  };

  if (loading) return <p>Loading bookings...</p>;

  return (
    <table className="admin-table">
      <thead>
        <tr>
          <th>User</th>
          <th>Amount</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {bookings.map((b) => (
          <tr key={b._id}>
            <td>{b.user?.name}</td>
            <td>₹{b.amount}</td>
            <td>
              <select
                value={b.status}
                onChange={(e) => handleStatusChange(b, e.target.value)}
              >
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </td>
            <td>
              <button onClick={() => handleDelete(b._id)}>Delete</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default BookingsManagement;

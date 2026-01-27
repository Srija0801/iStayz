import React, { useEffect, useState } from "react";
import { getAllUsers, updateUser, deleteUser } from "../api/adminApi";

function UsersManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const data = await getAllUsers();
      setUsers(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Delete this user?")) {
      await deleteUser(id);
      fetchUsers();
    }
  };

  const handleRoleChange = async (user, role) => {
    await updateUser(user._id, { role });
    fetchUsers();
  };

  if (loading) return <p>Loading users...</p>;

  return (
    <table className="admin-table">
      <thead>
        <tr>
          <th>Name</th>
          <th>Email</th>
          <th>Role</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {users.map((user) => (
          <tr key={user._id}>
            <td>{user.fullName}</td>
            <td>{user.email}</td>
            <td>
              <select
                value={user.role}
                onChange={(e) => handleRoleChange(user, e.target.value)}
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </td>
            <td>
              <button onClick={() => handleDelete(user._id)}>Delete</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default UsersManagement;

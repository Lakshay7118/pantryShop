// src/admin/Users.jsx
import React, { useState, useEffect } from "react";
import * as api from "../services/api";

const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
  background: "#1e1e1e",
  borderRadius: "12px",
  overflow: "hidden",
};

const thStyle = {
  textAlign: "left",
  padding: "1rem",
  background: "#141414",
  color: "#7a7166",
  fontWeight: 500,
  fontSize: "0.85rem",
  borderBottom: "1px solid #2a2520",
};

const tdStyle = {
  padding: "1rem",
  borderBottom: "1px solid #2a2520",
};

const actionBtnStyle = {
  background: "transparent",
  border: "1px solid #2a2520",
  color: "#7a7166",
  padding: "0.3rem 0.7rem",
  borderRadius: "6px",
  cursor: "pointer",
  fontSize: "0.8rem",
  marginRight: "0.5rem",
  transition: "all 0.2s",
};

const modalOverlayStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: "rgba(0,0,0,0.7)",
  backdropFilter: "blur(4px)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 4000,
};

const modalStyle = {
  background: "#1e1e1e",
  border: "1px solid #2a2520",
  borderRadius: "16px",
  padding: "2rem",
  width: "100%",
  maxWidth: "450px",
};

const inputStyle = {
  width: "100%",
  padding: "0.8rem",
  background: "#141414",
  border: "1px solid #2a2520",
  borderRadius: "8px",
  color: "#f0ece4",
  fontSize: "0.95rem",
  marginBottom: "1.2rem",
  outline: "none",
};

export default function Users({ showToast }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState(null);
  const [editForm, setEditForm] = useState({ name: "", email: "", password: "", isAdmin: false });
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await api.userAPI.getAll();
      setUsers(data);
    } catch (error) {
      showToast?.("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (user) => {
    setEditingUser(user);
    setEditForm({
      name: user.name,
      email: user.email,
      password: "",
      isAdmin: user.isAdmin,
    });
  };

  const handleEditChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editForm.name || !editForm.email) {
      showToast?.("Name and email are required");
      return;
    }
    try {
      const updateData = {
        name: editForm.name,
        email: editForm.email,
        isAdmin: editForm.isAdmin,
      };
      if (editForm.password) {
        updateData.password = editForm.password;
      }
      await api.userAPI.update(editingUser._id, updateData);
      showToast?.("User updated successfully");
      setEditingUser(null);
      fetchUsers();
    } catch (error) {
      showToast?.("Failed to update user");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      setDeletingId(id);
      await api.userAPI.delete(id);
      showToast?.("User deleted");
      fetchUsers();
    } catch (error) {
      showToast?.("Failed to delete user");
    } finally {
      setDeletingId(null);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "3rem", color: "#7a7166" }}>
        Loading users...
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem" }}>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "2rem", margin: 0 }}>
          Users
        </h2>
        <button
          onClick={fetchUsers}
          style={{
            background: "transparent",
            border: "1px solid #2a2520",
            color: "#7a7166",
            padding: "0.5rem 1rem",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "0.9rem",
          }}
        >
          🔄 Refresh
        </button>
      </div>

      {users.length === 0 ? (
        <div style={{ background: "#1e1e1e", borderRadius: "12px", padding: "2rem", textAlign: "center", color: "#7a7166" }}>
          No users found.
        </div>
      ) : (
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>Name</th>
              <th style={thStyle}>Email</th>
              <th style={thStyle}>Joined</th>
              <th style={thStyle}>Admin</th>
              <th style={thStyle}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td style={tdStyle}>{user.name}</td>
                <td style={tdStyle}>{user.email}</td>
                <td style={tdStyle}>{formatDate(user.createdAt)}</td>
                <td style={tdStyle}>
                  {user.isAdmin ? (
                    <span style={{ color: "#e8c06a", fontWeight: 600 }}>Admin</span>
                  ) : (
                    <span style={{ color: "#7a7166" }}>User</span>
                  )}
                </td>
                <td style={tdStyle}>
                  <button
                    style={actionBtnStyle}
                    onClick={() => handleEditClick(user)}
                    disabled={deletingId === user._id}
                  >
                    ✏️ Edit
                  </button>
                  <button
                    style={{ ...actionBtnStyle, color: "#e05c5c", borderColor: "#e05c5c" }}
                    onClick={() => handleDelete(user._id)}
                    disabled={deletingId === user._id}
                  >
                    🗑️ Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Edit Modal */}
      {editingUser && (
        <div style={modalOverlayStyle} onClick={() => setEditingUser(null)}>
          <div style={modalStyle} onClick={e => e.stopPropagation()}>
            <h3 style={{ marginBottom: "1.5rem", fontSize: "1.3rem" }}>Edit User</h3>
            <form onSubmit={handleEditSubmit}>
              <div>
                <label style={{ display: "block", marginBottom: "0.4rem", color: "#7a7166" }}>Name</label>
                <input
                  style={inputStyle}
                  name="name"
                  value={editForm.name}
                  onChange={handleEditChange}
                  required
                />
              </div>
              <div>
                <label style={{ display: "block", marginBottom: "0.4rem", color: "#7a7166" }}>Email</label>
                <input
                  style={inputStyle}
                  name="email"
                  type="email"
                  value={editForm.email}
                  onChange={handleEditChange}
                  required
                />
              </div>
              <div>
                <label style={{ display: "block", marginBottom: "0.4rem", color: "#7a7166" }}>New Password (optional)</label>
                <input
                  style={inputStyle}
                  name="password"
                  type="password"
                  placeholder="Leave blank to keep unchanged"
                  value={editForm.password}
                  onChange={handleEditChange}
                />
              </div>
              <div style={{ marginBottom: "1.2rem" }}>
                <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer" }}>
                  <input
                    type="checkbox"
                    name="isAdmin"
                    checked={editForm.isAdmin}
                    onChange={handleEditChange}
                  />
                  <span>Admin Privileges</span>
                </label>
              </div>
              <div style={{ display: "flex", gap: "1rem", justifyContent: "flex-end" }}>
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  style={{
                    padding: "0.6rem 1.2rem",
                    background: "transparent",
                    border: "1px solid #2a2520",
                    borderRadius: "6px",
                    color: "#7a7166",
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    padding: "0.6rem 1.2rem",
                    background: "#e8c06a",
                    border: "none",
                    borderRadius: "6px",
                    color: "#0a0a0a",
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
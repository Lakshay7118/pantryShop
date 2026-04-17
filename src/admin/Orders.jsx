// src/admin/Orders.jsx
import React, { useState, useEffect } from "react";
import * as api from "../services/api";

const statusColor = {
  Delivered: { bg: "rgba(232,192,106,0.15)", color: "#e8c06a" },
  Processing: { bg: "rgba(224,92,92,0.15)", color: "#e05c5c" },
  Shipped: { bg: "rgba(100,150,200,0.15)", color: "#6a9fb5" },
  Pending: { bg: "rgba(200,150,100,0.15)", color: "#c97d3a" },
  Cancelled: { bg: "rgba(224,92,92,0.15)", color: "#e05c5c" },
};

export default function Orders({ showToast }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  // Fetch orders on mount
  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await api.orderAPI.getAll();
      // Sort by date descending (newest first)
      const sorted = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setOrders(sorted);
    } catch (error) {
      showToast?.("Failed to load orders") || console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      setUpdatingId(orderId);
      await api.orderAPI.updateStatus(orderId, newStatus);
      // Update local state
      setOrders(prev =>
        prev.map(order =>
          order._id === orderId ? { ...order, status: newStatus } : order
        )
      );
      showToast?.(`Order status updated to ${newStatus}`);
    } catch (error) {
      showToast?.("Failed to update status") || console.error(error);
    } finally {
      setUpdatingId(null);
    }
  };

  // Helper to format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  // Helper to get customer name (populated user object)
  const getCustomerName = (order) => {
    if (order.user && order.user.name) return order.user.name;
    return "Guest";
  };

  // Format price in INR (assuming price stored in USD)
  const formatPrice = (price) => {
    return `₹${(price * 83).toFixed(0)}`;
  };

  // Short order ID display
  const getShortId = (id) => {
    return `#${id.slice(-6).toUpperCase()}`;
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "3rem", color: "#7a7166" }}>
        Loading orders...
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem" }}>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "2rem", margin: 0 }}>
          Orders
        </h2>
        <button
          onClick={fetchOrders}
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

      {orders.length === 0 ? (
        <div style={{ background: "#1e1e1e", borderRadius: "12px", padding: "2rem", textAlign: "center", color: "#7a7166" }}>
          No orders found.
        </div>
      ) : (
        <div style={{ background: "#1e1e1e", borderRadius: "12px", padding: "1.5rem", overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "700px" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid #2a2520", color: "#7a7166", fontSize: "0.85rem" }}>
                <th style={{ padding: "0.8rem 0", textAlign: "left" }}>Order ID</th>
                <th style={{ padding: "0.8rem 0", textAlign: "left" }}>Customer</th>
                <th style={{ padding: "0.8rem 0", textAlign: "left" }}>Date</th>
                <th style={{ padding: "0.8rem 0", textAlign: "left" }}>Total</th>
                <th style={{ padding: "0.8rem 0", textAlign: "left" }}>Status</th>
                <th style={{ padding: "0.8rem 0", textAlign: "left" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id} style={{ borderBottom: "1px solid #2a2520" }}>
                  <td style={{ padding: "0.8rem 0" }}>{getShortId(order._id)}</td>
                  <td style={{ padding: "0.8rem 0" }}>{getCustomerName(order)}</td>
                  <td style={{ padding: "0.8rem 0" }}>{formatDate(order.createdAt)}</td>
                  <td style={{ padding: "0.8rem 0" }}>{formatPrice(order.totalPrice)}</td>
                  <td style={{ padding: "0.8rem 0" }}>
                    <span style={{
                      background: statusColor[order.status]?.bg || "rgba(122,113,102,0.15)",
                      color: statusColor[order.status]?.color || "#7a7166",
                      padding: "0.2rem 0.6rem",
                      borderRadius: "20px",
                      fontSize: "0.8rem",
                    }}>
                      {order.status}
                    </span>
                  </td>
                  <td style={{ padding: "0.8rem 0" }}>
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusChange(order._id, e.target.value)}
                      disabled={updatingId === order._id}
                      style={{
                        background: "#141414",
                        border: "1px solid #2a2520",
                        color: "#f0ece4",
                        padding: "0.3rem 0.5rem",
                        borderRadius: "6px",
                        fontSize: "0.8rem",
                        cursor: "pointer",
                        opacity: updatingId === order._id ? 0.5 : 1,
                      }}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Processing">Processing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
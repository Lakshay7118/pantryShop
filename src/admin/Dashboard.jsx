// src/admin/Dashboard.jsx
import React, { useState, useEffect } from "react";
import * as api from "../services/api";

const cardStyle = {
  background: "#1e1e1e",
  border: "1px solid #2a2520",
  borderRadius: "12px",
  padding: "1.5rem",
  marginBottom: "1.5rem",
};

const statGridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
  gap: "1.2rem",
  marginBottom: "2rem",
};

const statCardStyle = {
  background: "#141414",
  border: "1px solid #2a2520",
  borderRadius: "12px",
  padding: "1.2rem",
};

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalUsers: 0,
    revenue: 0,
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Format price in INR (assuming price is stored in USD or whatever)
  const formatPrice = (price) => {
    // If your product prices are in USD, multiply by 83 for INR conversion
    return `₹${(price * 83).toFixed(0)}`;
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        // Fetch products count
        const products = await api.productAPI.getAll();
        const totalProducts = products.length;

        // Fetch all orders (admin only)
        const orders = await api.orderAPI.getAll();
        const totalOrders = orders.length;

        // Calculate revenue from paid/delivered orders
        const revenue = orders
          .filter(order => order.isPaid || order.status === 'Delivered')
          .reduce((sum, order) => sum + order.totalPrice, 0);

        // For total users, we might not have an endpoint yet; keep it static or implement later
        // You can add a user count API endpoint later.
        const totalUsers = 1240; // Placeholder; replace with actual user count when available

        // Get recent orders (last 5)
        const sortedOrders = [...orders].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        const latestOrders = sortedOrders.slice(0, 5);

        setStats({
          totalProducts,
          totalOrders,
          totalUsers,
          revenue,
        });

        setRecentOrders(latestOrders);
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Helper to get customer name from order (populated user)
  const getCustomerName = (order) => {
    if (order.user && order.user.name) return order.user.name;
    return "Guest";
  };

  // Status badge style
  const getStatusBadgeStyle = (status) => {
    const baseStyle = {
      padding: "0.2rem 0.6rem",
      borderRadius: "20px",
      fontSize: "0.8rem",
      display: "inline-block",
    };
    switch (status) {
      case "Delivered":
        return { ...baseStyle, background: "rgba(232,192,106,0.15)", color: "#e8c06a" };
      case "Shipped":
        return { ...baseStyle, background: "rgba(70,130,200,0.15)", color: "#6495ed" };
      case "Processing":
        return { ...baseStyle, background: "rgba(255,165,0,0.15)", color: "#ffa500" };
      case "Cancelled":
        return { ...baseStyle, background: "rgba(224,92,92,0.15)", color: "#e05c5c" };
      default:
        return { ...baseStyle, background: "rgba(122,113,102,0.15)", color: "#7a7166" };
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "3rem", color: "#7a7166" }}>
        Loading dashboard...
      </div>
    );
  }

  return (
    <div>
      <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "2rem", marginBottom: "1.5rem" }}>
        Dashboard
      </h2>
      <div style={statGridStyle}>
        <div style={statCardStyle}>
          <div style={{ color: "#7a7166", fontSize: "0.85rem", marginBottom: "0.5rem" }}>
            Total Products
          </div>
          <div style={{ fontSize: "2rem", fontWeight: 700, color: "#e8c06a" }}>
            {stats.totalProducts}
          </div>
        </div>
        <div style={statCardStyle}>
          <div style={{ color: "#7a7166", fontSize: "0.85rem", marginBottom: "0.5rem" }}>
            Total Orders
          </div>
          <div style={{ fontSize: "2rem", fontWeight: 700, color: "#e8c06a" }}>
            {stats.totalOrders}
          </div>
        </div>
        <div style={statCardStyle}>
          <div style={{ color: "#7a7166", fontSize: "0.85rem", marginBottom: "0.5rem" }}>
            Registered Users
          </div>
          <div style={{ fontSize: "2rem", fontWeight: 700, color: "#e8c06a" }}>
            {stats.totalUsers.toLocaleString()}
          </div>
        </div>
        <div style={statCardStyle}>
          <div style={{ color: "#7a7166", fontSize: "0.85rem", marginBottom: "0.5rem" }}>
            Revenue (All Time)
          </div>
          <div style={{ fontSize: "2rem", fontWeight: 700, color: "#e8c06a" }}>
            {formatPrice(stats.revenue)}
          </div>
        </div>
      </div>
      <div style={cardStyle}>
        <h3 style={{ marginBottom: "1rem", fontWeight: 600 }}>Recent Orders</h3>
        {recentOrders.length === 0 ? (
          <div style={{ color: "#7a7166", textAlign: "center", padding: "1rem" }}>
            No orders yet.
          </div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid #2a2520", color: "#7a7166", fontSize: "0.85rem" }}>
                <th style={{ padding: "0.8rem 0", textAlign: "left" }}>Order ID</th>
                <th style={{ padding: "0.8rem 0", textAlign: "left" }}>Customer</th>
                <th style={{ padding: "0.8rem 0", textAlign: "left" }}>Total</th>
                <th style={{ padding: "0.8rem 0", textAlign: "left" }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order) => (
                <tr key={order._id} style={{ borderBottom: "1px solid #2a2520" }}>
                  <td style={{ padding: "0.8rem 0" }}>#{order._id.slice(-6).toUpperCase()}</td>
                  <td style={{ padding: "0.8rem 0" }}>{getCustomerName(order)}</td>
                  <td style={{ padding: "0.8rem 0" }}>{formatPrice(order.totalPrice)}</td>
                  <td style={{ padding: "0.8rem 0" }}>
                    <span style={getStatusBadgeStyle(order.status)}>
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
// src/admin/AdminSidebar.jsx
import React from "react";

const sidebarStyle = {
  width: "260px",
  background: "#0a0a0a",
  padding: "2rem 1rem",
  borderRight: "1px solid #2a2520",
};

const menuItemStyle = {
  display: "flex",
  alignItems: "center",
  gap: "0.8rem",
  padding: "0.8rem 1rem",
  marginBottom: "0.3rem",
  borderRadius: "8px",
  color: "#7a7166",
  cursor: "pointer",
  transition: "all 0.2s",
  fontSize: "0.95rem",
  fontWeight: 500,
};

const activeStyle = {
  background: "#e8c06a",
  color: "#0a0a0a",
  fontWeight: 600,
};

const menuItems = [
  { id: "dashboard", label: "Dashboard", icon: "📊" },
  { id: "products", label: "Products", icon: "🛍️" },   // Changed from "add-product"
  { id: "users", label: "Users", icon: "👥" },
  { id: "orders", label: "Orders", icon: "📦" },
  { id: "settings", label: "Settings", icon: "⚙️" },
];

export default function AdminSidebar({ activeTab, setActiveTab }) {
  return (
    <div style={sidebarStyle}>
      <div style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: "2rem", color: "#e8c06a", fontFamily: "'Playfair Display', serif" }}>
        Admin Panel
      </div>
      {menuItems.map((item) => (
        <div
          key={item.id}
          style={{
            ...menuItemStyle,
            ...(activeTab === item.id ? activeStyle : {}),
          }}
          onClick={() => setActiveTab(item.id)}
        >
          <span>{item.icon}</span>
          <span>{item.label}</span>
        </div>
      ))}
    </div>
  );
}
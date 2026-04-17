// src/admin/AdminPanel.jsx
import React, { useState } from "react";
import AdminSidebar from "./AdminSidebar";
import Dashboard from "./Dashboard";
import Products from "./Products";   // New unified products management
import Users from "./Users";
import Orders from "./Orders";
import Settings from "./Settings";

const adminContainerStyle = {
  display: "flex",
  minHeight: "calc(100vh - 70px)",
  marginTop: "70px",
  background: "#0a0a0a",
  color: "#f0ece4",
};

const contentStyle = {
  flex: 1,
  padding: "2rem",
  background: "#141414",
  borderLeft: "1px solid #2a2520",
};

export default function AdminPanel({ showToast, refreshProducts }) {
  const [activeTab, setActiveTab] = useState("dashboard");

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <Dashboard showToast={showToast} />;
      case "products":   // Changed from "add-product"
        return (
          <Products
            showToast={showToast}
            refreshProducts={refreshProducts}
          />
        );
      case "users":
        return <Users showToast={showToast} />;
      case "orders":
        return <Orders showToast={showToast} />;
      case "settings":
        return <Settings showToast={showToast} />;
      default:
        return <Dashboard showToast={showToast} />;
    }
  };

  return (
    <div style={adminContainerStyle}>
      <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div style={contentStyle}>{renderContent()}</div>
    </div>
  );
}
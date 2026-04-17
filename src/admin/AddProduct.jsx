// src/admin/AddProduct.jsx
import React, { useState } from "react";
import * as api from "../services/api";

const formStyle = {
  background: "#1e1e1e",
  border: "1px solid #2a2520",
  borderRadius: "12px",
  padding: "2rem",
  maxWidth: "600px",
};

const inputStyle = {
  width: "100%",
  padding: "0.8rem 1rem",
  background: "#141414",
  border: "1px solid #2a2520",
  borderRadius: "8px",
  color: "#f0ece4",
  fontSize: "0.95rem",
  marginBottom: "1.2rem",
  outline: "none",
};

export default function AddProduct({ onProductAdded, showToast }) {
  const [product, setProduct] = useState({
    name: "",
    category: "Coffee",
    description: "",
    price: "",
    emoji: "🆕",
    badge: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!product.name || !product.price) {
      showToast?.("Please fill name and price") || alert("Please fill name and price");
      return;
    }

    // Prepare data for API (convert price to number)
    const productData = {
      ...product,
      price: parseFloat(product.price),
      badge: product.badge || null, // send null if empty string
    };

    try {
      setLoading(true);
      const created = await api.productAPI.create(productData);
      showToast?.(`${created.name} added successfully!`) || alert(`Product "${created.name}" added!`);
      
      // Reset form
      setProduct({
        name: "",
        category: "Coffee",
        description: "",
        price: "",
        emoji: "🆕",
        badge: "",
      });

      // Notify parent to refresh product list
      if (onProductAdded) onProductAdded(created);
    } catch (error) {
      const errorMsg = error.message || "Failed to add product";
      showToast?.(errorMsg) || alert(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "2rem", marginBottom: "1.5rem" }}>
        Add New Product
      </h2>
      <form style={formStyle} onSubmit={handleSubmit}>
        <div>
          <label style={{ display: "block", marginBottom: "0.4rem", color: "#7a7166" }}>Product Name *</label>
          <input
            style={inputStyle}
            name="name"
            value={product.name}
            onChange={handleChange}
            required
            disabled={loading}
          />
        </div>
        <div>
          <label style={{ display: "block", marginBottom: "0.4rem", color: "#7a7166" }}>Category</label>
          <select
            style={inputStyle}
            name="category"
            value={product.category}
            onChange={handleChange}
            disabled={loading}
          >
            <option>Coffee</option>
            <option>Tea</option>
            <option>Spices</option>
            <option>Pantry</option>
          </select>
        </div>
        <div>
          <label style={{ display: "block", marginBottom: "0.4rem", color: "#7a7166" }}>Description</label>
          <textarea
            style={{ ...inputStyle, minHeight: "80px" }}
            name="description"
            value={product.description}
            onChange={handleChange}
            disabled={loading}
          />
        </div>
        <div>
          <label style={{ display: "block", marginBottom: "0.4rem", color: "#7a7166" }}>Price (USD) *</label>
          <input
            style={inputStyle}
            type="number"
            step="0.01"
            min="0"
            name="price"
            value={product.price}
            onChange={handleChange}
            required
            disabled={loading}
          />
        </div>
        <div>
          <label style={{ display: "block", marginBottom: "0.4rem", color: "#7a7166" }}>Emoji</label>
          <input
            style={inputStyle}
            name="emoji"
            value={product.emoji}
            onChange={handleChange}
            disabled={loading}
          />
        </div>
        <div>
          <label style={{ display: "block", marginBottom: "0.4rem", color: "#7a7166" }}>Badge</label>
          <select
            style={inputStyle}
            name="badge"
            value={product.badge}
            onChange={handleChange}
            disabled={loading}
          >
            <option value="">None</option>
            <option value="new">New</option>
            <option value="hot">Hot</option>
          </select>
        </div>
        <button
          type="submit"
          style={{
            background: loading ? "#7a7166" : "#e8c06a",
            color: "#0a0a0a",
            border: "none",
            padding: "0.9rem 1.8rem",
            borderRadius: "8px",
            fontWeight: 700,
            cursor: loading ? "not-allowed" : "pointer",
            fontSize: "1rem",
            marginTop: "0.5rem",
            opacity: loading ? 0.7 : 1,
          }}
          disabled={loading}
        >
          {loading ? "Adding..." : "Add Product"}
        </button>
      </form>
    </div>
  );
}
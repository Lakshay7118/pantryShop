// src/admin/Products.jsx
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
  maxWidth: "550px",
  maxHeight: "90vh",
  overflowY: "auto",
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

export default function Products({ showToast, refreshProducts }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    category: "Coffee",
    description: "",
    price: "",
    emoji: "🆕",
    badge: "",
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await api.productAPI.getAll();
      setProducts(data);
    } catch (error) {
      showToast?.("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setEditingId(null);
    setFormData({
      name: "",
      category: "Coffee",
      description: "",
      price: "",
      emoji: "🆕",
      badge: "",
    });
    setModalOpen(true);
  };

  const openEditModal = (product) => {
    setEditingId(product._id);
    setFormData({
      name: product.name,
      category: product.category,
      description: product.description,
      price: product.price.toString(),
      emoji: product.emoji,
      badge: product.badge || "",
    });
    setModalOpen(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.price) {
      showToast?.("Name and price are required");
      return;
    }

    const productData = {
      ...formData,
      price: parseFloat(formData.price),
      badge: formData.badge || null,
    };

    try {
      setSubmitting(true);
      if (editingId) {
        await api.productAPI.update(editingId, productData);
        showToast?.("Product updated successfully");
      } else {
        await api.productAPI.create(productData);
        showToast?.("Product added successfully");
      }
      setModalOpen(false);
      fetchProducts();
      if (refreshProducts) refreshProducts(); // update main store
    } catch (error) {
      showToast?.(error.message || "Operation failed");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete "${name}"?`)) return;
    try {
      await api.productAPI.delete(id);
      showToast?.("Product deleted");
      fetchProducts();
      if (refreshProducts) refreshProducts();
    } catch (error) {
      showToast?.("Delete failed");
    }
  };

  const formatPrice = (price) => {
    return `₹${(price * 83).toFixed(0)}`;
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "3rem", color: "#7a7166" }}>
        Loading products...
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem" }}>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "2rem", margin: 0 }}>
          Products
        </h2>
        <div>
          <button
            onClick={fetchProducts}
            style={{
              background: "transparent",
              border: "1px solid #2a2520",
              color: "#7a7166",
              padding: "0.5rem 1rem",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "0.9rem",
              marginRight: "1rem",
            }}
          >
            🔄 Refresh
          </button>
          <button
            onClick={openAddModal}
            style={{
              background: "#e8c06a",
              border: "none",
              color: "#0a0a0a",
              padding: "0.6rem 1.5rem",
              borderRadius: "8px",
              fontWeight: 600,
              cursor: "pointer",
              fontSize: "0.95rem",
            }}
          >
            + Add Product
          </button>
        </div>
      </div>

      {products.length === 0 ? (
        <div style={{ background: "#1e1e1e", borderRadius: "12px", padding: "2rem", textAlign: "center", color: "#7a7166" }}>
          No products found. Click "Add Product" to create one.
        </div>
      ) : (
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>Product</th>
              <th style={thStyle}>Category</th>
              <th style={thStyle}>Price</th>
              <th style={thStyle}>Badge</th>
              <th style={thStyle}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product._id}>
                <td style={tdStyle}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.8rem" }}>
                    <span style={{ fontSize: "1.8rem" }}>{product.emoji}</span>
                    <div>
                      <div style={{ fontWeight: 600 }}>{product.name}</div>
                      <div style={{ fontSize: "0.8rem", color: "#7a7166" }}>{product.description?.substring(0, 40)}...</div>
                    </div>
                  </div>
                </td>
                <td style={tdStyle}>{product.category}</td>
                <td style={tdStyle}>{formatPrice(product.price)}</td>
                <td style={tdStyle}>
                  {product.badge ? (
                    <span style={{
                      background: product.badge === "new" ? "rgba(232,192,106,0.15)" : "rgba(224,92,92,0.15)",
                      color: product.badge === "new" ? "#e8c06a" : "#e05c5c",
                      padding: "0.2rem 0.6rem",
                      borderRadius: "20px",
                      fontSize: "0.75rem",
                      textTransform: "uppercase",
                    }}>
                      {product.badge}
                    </span>
                  ) : (
                    <span style={{ color: "#7a7166" }}>—</span>
                  )}
                </td>
                <td style={tdStyle}>
                  <button
                    style={actionBtnStyle}
                    onClick={() => openEditModal(product)}
                  >
                    ✏️ Edit
                  </button>
                  <button
                    style={{ ...actionBtnStyle, color: "#e05c5c", borderColor: "#e05c5c" }}
                    onClick={() => handleDelete(product._id, product.name)}
                  >
                    🗑️ Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Add/Edit Modal */}
      {modalOpen && (
        <div style={modalOverlayStyle} onClick={() => setModalOpen(false)}>
          <div style={modalStyle} onClick={e => e.stopPropagation()}>
            <h3 style={{ marginBottom: "1.5rem", fontSize: "1.3rem" }}>
              {editingId ? "Edit Product" : "Add New Product"}
            </h3>
            <form onSubmit={handleSubmit}>
              <div>
                <label style={{ display: "block", marginBottom: "0.4rem", color: "#7a7166" }}>Product Name *</label>
                <input
                  style={inputStyle}
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  disabled={submitting}
                />
              </div>
              <div>
                <label style={{ display: "block", marginBottom: "0.4rem", color: "#7a7166" }}>Category</label>
                <select
                  style={inputStyle}
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  disabled={submitting}
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
                  value={formData.description}
                  onChange={handleChange}
                  disabled={submitting}
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
                  value={formData.price}
                  onChange={handleChange}
                  required
                  disabled={submitting}
                />
              </div>
              <div>
                <label style={{ display: "block", marginBottom: "0.4rem", color: "#7a7166" }}>Emoji</label>
                <input
                  style={inputStyle}
                  name="emoji"
                  value={formData.emoji}
                  onChange={handleChange}
                  disabled={submitting}
                />
              </div>
              <div>
                <label style={{ display: "block", marginBottom: "0.4rem", color: "#7a7166" }}>Badge</label>
                <select
                  style={inputStyle}
                  name="badge"
                  value={formData.badge}
                  onChange={handleChange}
                  disabled={submitting}
                >
                  <option value="">None</option>
                  <option value="new">New</option>
                  <option value="hot">Hot</option>
                </select>
              </div>
              <div style={{ display: "flex", gap: "1rem", justifyContent: "flex-end", marginTop: "1.5rem" }}>
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  style={{
                    padding: "0.6rem 1.2rem",
                    background: "transparent",
                    border: "1px solid #2a2520",
                    borderRadius: "6px",
                    color: "#7a7166",
                    cursor: "pointer",
                  }}
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    padding: "0.6rem 1.2rem",
                    background: submitting ? "#7a7166" : "#e8c06a",
                    border: "none",
                    borderRadius: "6px",
                    color: "#0a0a0a",
                    fontWeight: 600,
                    cursor: submitting ? "not-allowed" : "pointer",
                    opacity: submitting ? 0.7 : 1,
                  }}
                  disabled={submitting}
                >
                  {submitting ? "Saving..." : (editingId ? "Update Product" : "Add Product")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
// src/admin/Settings.jsx
import React, { useState, useEffect } from "react";
import * as api from "../services/api";

const settingCardStyle = {
  background: "#1e1e1e",
  border: "1px solid #2a2520",
  borderRadius: "12px",
  padding: "2rem",
  maxWidth: "600px",
};

export default function Settings({ showToast }) {
  const [settings, setSettings] = useState({
    siteName: "LuminPantry",
    contactEmail: "hello@luminpantry.com",
    currency: "INR",
    taxRate: "5",
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Fetch current settings on mount
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);
        // You'll need to add this API endpoint (see backend section below)
        const data = await api.settingsAPI.get();
        if (data) {
          setSettings({
            siteName: data.siteName || "LuminPantry",
            contactEmail: data.contactEmail || "hello@luminpantry.com",
            currency: data.currency || "INR",
            taxRate: data.taxRate?.toString() || "5",
          });
        }
      } catch (error) {
        // If settings don't exist yet, keep defaults
        console.log("No existing settings found, using defaults");
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleChange = (e) => {
    setSettings({ ...settings, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const settingsData = {
        ...settings,
        taxRate: parseFloat(settings.taxRate),
      };
      await api.settingsAPI.update(settingsData);
      showToast?.("Settings saved successfully!") || alert("Settings saved!");
    } catch (error) {
      showToast?.("Failed to save settings") || alert("Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "3rem", color: "#7a7166" }}>
        Loading settings...
      </div>
    );
  }

  return (
    <div>
      <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "2rem", marginBottom: "1.5rem" }}>
        Settings
      </h2>
      <div style={settingCardStyle}>
        <div style={{ marginBottom: "1.5rem" }}>
          <label style={{ display: "block", marginBottom: "0.4rem", color: "#7a7166" }}>Site Name</label>
          <input
            style={{
              width: "100%",
              padding: "0.8rem",
              background: "#141414",
              border: "1px solid #2a2520",
              borderRadius: "8px",
              color: "#f0ece4",
            }}
            name="siteName"
            value={settings.siteName}
            onChange={handleChange}
            disabled={saving}
          />
        </div>
        <div style={{ marginBottom: "1.5rem" }}>
          <label style={{ display: "block", marginBottom: "0.4rem", color: "#7a7166" }}>Contact Email</label>
          <input
            style={{
              width: "100%",
              padding: "0.8rem",
              background: "#141414",
              border: "1px solid #2a2520",
              borderRadius: "8px",
              color: "#f0ece4",
            }}
            name="contactEmail"
            value={settings.contactEmail}
            onChange={handleChange}
            disabled={saving}
          />
        </div>
        <div style={{ marginBottom: "1.5rem" }}>
          <label style={{ display: "block", marginBottom: "0.4rem", color: "#7a7166" }}>Currency</label>
          <select
            style={{
              width: "100%",
              padding: "0.8rem",
              background: "#141414",
              border: "1px solid #2a2520",
              borderRadius: "8px",
              color: "#f0ece4",
            }}
            name="currency"
            value={settings.currency}
            onChange={handleChange}
            disabled={saving}
          >
            <option>INR</option>
            <option>USD</option>
            <option>EUR</option>
          </select>
        </div>
        <div style={{ marginBottom: "2rem" }}>
          <label style={{ display: "block", marginBottom: "0.4rem", color: "#7a7166" }}>Tax Rate (%)</label>
          <input
            style={{
              width: "100%",
              padding: "0.8rem",
              background: "#141414",
              border: "1px solid #2a2520",
              borderRadius: "8px",
              color: "#f0ece4",
            }}
            type="number"
            step="0.1"
            min="0"
            name="taxRate"
            value={settings.taxRate}
            onChange={handleChange}
            disabled={saving}
          />
        </div>
        <button
          onClick={handleSave}
          style={{
            background: saving ? "#7a7166" : "#e8c06a",
            color: "#0a0a0a",
            border: "none",
            padding: "0.9rem 1.8rem",
            borderRadius: "8px",
            fontWeight: 700,
            cursor: saving ? "not-allowed" : "pointer",
            opacity: saving ? 0.7 : 1,
          }}
          disabled={saving}
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
}
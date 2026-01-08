"use client";

import React, { useState } from "react";

export default function ReceiptReaderPage() {
  const [loading, setLoading] = useState(false);
  const [receiptData, setReceiptData] = useState(null);
  const [error, setError] = useState("");

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setError("File size should be less than 5MB");
      return;
    }

    setLoading(true);
    setReceiptData(null);
    setError("");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/scan-receipt", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to scan receipt");
      }

      const data = await response.json();
      setReceiptData(data);
    } catch (err) {
      console.error("Error scanning receipt:", err);
      setError(err.message || "Failed to scan receipt");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      minHeight: "100vh", 
      background: "linear-gradient(to bottom right, #eff6ff, #faf5ff)",
      padding: "2rem 1rem"
    }}>
      <div style={{ maxWidth: "800px", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <h1 style={{ 
            fontSize: "2.5rem", 
            fontWeight: "bold", 
            color: "#1f2937",
            marginBottom: "1rem"
          }}>
            AI Receipt Reader
          </h1>
          <p style={{ fontSize: "1.125rem", color: "#4b5563" }}>
            Upload a receipt image and let AI extract the information
          </p>
        </div>

        <div style={{ 
          backgroundColor: "white", 
          borderRadius: "0.5rem",
          boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
          padding: "2rem"
        }}>
          <h2 style={{ 
            fontSize: "1.5rem", 
            fontWeight: "600",
            marginBottom: "1.5rem"
          }}>
            Upload Receipt
          </h2>

          <div style={{ textAlign: "center" }}>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              disabled={loading}
              style={{
                marginBottom: "1rem",
                padding: "0.5rem",
                width: "100%",
                border: "2px solid #e5e7eb",
                borderRadius: "0.375rem",
                fontSize: "1rem"
              }}
            />
            
            {loading && (
              <p style={{ color: "#3b82f6", fontSize: "1.125rem", fontWeight: "500" }}>
                Scanning Receipt...
              </p>
            )}
            
            {error && (
              <p style={{ 
                color: "#ef4444", 
                backgroundColor: "#fee2e2",
                padding: "0.75rem",
                borderRadius: "0.375rem",
                marginTop: "1rem"
              }}>
                {error}
              </p>
            )}

            <p style={{ color: "#6b7280", fontSize: "0.875rem", marginTop: "0.5rem" }}>
              Supports: JPG, PNG, HEIC (Max 5MB)
            </p>
          </div>

          {receiptData && (
            <div style={{ 
              marginTop: "2rem", 
              padding: "1.5rem",
              backgroundColor: "#f9fafb",
              borderRadius: "0.5rem",
              border: "1px solid #e5e7eb"
            }}>
              <h3 style={{ 
                fontSize: "1.25rem", 
                fontWeight: "600",
                marginBottom: "1rem",
                color: "#1f2937"
              }}>
                Extracted Information
              </h3>
              
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                <div style={{ 
                  display: "flex", 
                  justifyContent: "space-between",
                  paddingBottom: "0.5rem",
                  borderBottom: "1px solid #e5e7eb"
                }}>
                  <span style={{ fontWeight: "500", color: "#374151" }}>Amount:</span>
                  <span style={{ fontWeight: "700", color: "#1f2937" }}>
                    ${receiptData.amount?.toFixed(2) || "N/A"}
                  </span>
                </div>

                <div style={{ 
                  display: "flex", 
                  justifyContent: "space-between",
                  paddingBottom: "0.5rem",
                  borderBottom: "1px solid #e5e7eb"
                }}>
                  <span style={{ fontWeight: "500", color: "#374151" }}>Date:</span>
                  <span style={{ color: "#1f2937" }}>
                    {receiptData.date
                      ? new Date(receiptData.date).toLocaleDateString()
                      : "N/A"}
                  </span>
                </div>

                <div style={{ 
                  display: "flex", 
                  justifyContent: "space-between",
                  paddingBottom: "0.5rem",
                  borderBottom: "1px solid #e5e7eb"
                }}>
                  <span style={{ fontWeight: "500", color: "#374151" }}>Merchant:</span>
                  <span style={{ color: "#1f2937" }}>
                    {receiptData.merchantName || "N/A"}
                  </span>
                </div>

                <div style={{ 
                  display: "flex", 
                  justifyContent: "space-between",
                  paddingBottom: "0.5rem",
                  borderBottom: "1px solid #e5e7eb"
                }}>
                  <span style={{ fontWeight: "500", color: "#374151" }}>Category:</span>
                  <span style={{ color: "#1f2937", textTransform: "capitalize" }}>
                    {receiptData.category || "N/A"}
                  </span>
                </div>

                <div style={{ paddingTop: "0.5rem" }}>
                  <span style={{ fontWeight: "500", color: "#374151" }}>Description:</span>
                  <p style={{ color: "#1f2937", marginTop: "0.5rem" }}>
                    {receiptData.description || "N/A"}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div style={{ 
          marginTop: "2rem", 
          textAlign: "center",
          fontSize: "0.875rem",
          color: "#6b7280"
        }}>
          <p>
            Powered by Google Gemini AI
          </p>
        </div>
      </div>
    </div>
  );
}

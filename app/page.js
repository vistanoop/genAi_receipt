"use client";

import React, { useState, useRef } from "react";
import { Camera, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

export default function ReceiptReaderPage() {
  const [loading, setLoading] = useState(false);
  const [receiptData, setReceiptData] = useState(null);
  const fileInputRef = useRef(null);

  const handleReceiptScan = async (file) => {
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size should be less than 5MB");
      return;
    }

    setLoading(true);
    setReceiptData(null);

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
      toast.success("Receipt scanned successfully!");
    } catch (error) {
      console.error("Error scanning receipt:", error);
      toast.error(error.message || "Failed to scan receipt");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            AI Receipt Reader
          </h1>
          <p className="text-lg text-gray-600">
            Upload a receipt image and let AI extract the information for you
          </p>
        </div>

        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle>Upload Receipt</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col items-center gap-4">
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleReceiptScan(file);
                }}
              />
              <Button
                type="button"
                size="lg"
                className="w-full h-16 bg-gradient-to-br from-orange-500 via-pink-500 to-purple-500 animate-gradient hover:opacity-90 transition-opacity text-white hover:text-white"
                onClick={() => fileInputRef.current?.click()}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 animate-spin" />
                    <span>Scanning Receipt...</span>
                  </>
                ) : (
                  <>
                    <Camera className="mr-2" />
                    <span>Scan Receipt with AI</span>
                  </>
                )}
              </Button>
              <p className="text-sm text-gray-500">
                Supports: JPG, PNG, HEIC (Max 5MB)
              </p>
            </div>

            {receiptData && (
              <div className="mt-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
                <h3 className="text-xl font-semibold mb-4 text-gray-900">
                  Extracted Information
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between border-b pb-2">
                    <span className="font-medium text-gray-700">Amount:</span>
                    <span className="text-gray-900 font-bold">
                      ${receiptData.amount?.toFixed(2) || "N/A"}
                    </span>
                  </div>
                  <div className="flex justify-between border-b pb-2">
                    <span className="font-medium text-gray-700">Date:</span>
                    <span className="text-gray-900">
                      {receiptData.date
                        ? new Date(receiptData.date).toLocaleDateString()
                        : "N/A"}
                    </span>
                  </div>
                  <div className="flex justify-between border-b pb-2">
                    <span className="font-medium text-gray-700">Merchant:</span>
                    <span className="text-gray-900">
                      {receiptData.merchantName || "N/A"}
                    </span>
                  </div>
                  <div className="flex justify-between border-b pb-2">
                    <span className="font-medium text-gray-700">Category:</span>
                    <span className="text-gray-900 capitalize">
                      {receiptData.category || "N/A"}
                    </span>
                  </div>
                  <div className="pt-2">
                    <span className="font-medium text-gray-700">Description:</span>
                    <p className="text-gray-900 mt-1">
                      {receiptData.description || "N/A"}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="mt-8 text-center text-sm text-gray-600">
          <p>
            Powered by Google Gemini AI | This application uses AI to extract
            data from receipt images
          </p>
        </div>
      </div>
    </div>
  );
}

"use client";
import { useState, FormEvent } from "react";
import axios from "axios";
import { BurnerModalProps } from "../lib/types";


export default function BurnerModal({
  isOpen,
  onClose,
  onSubmit,
  owner,
}: BurnerModalProps) {
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Validate inputs
    if (!name.trim()) {
      setError("Wallet Name is required");
      setLoading(false);
      return;
    }

    try {
      // Create the burner wallet via API
      const response = await axios.post("/api/burners", {
        name: name.trim(),
        owner: owner.trim()
      });

      if (response.data.success && response.data.wallet) {
        // Call onSubmit callback if provided
        if (onSubmit) {
          onSubmit(response.data.wallet);
        }
        // Reset form and close modal
        setName("");
        onClose();
      } else {
        setError(response.data.error || "Failed to create burner wallet");
      }
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.error ||
        err.message ||
        "Failed to create burner wallet";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setName("");
    setError("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white cursor-pointer">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm cursor-pointer"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-2xl font-semibold text-black">
            Create Burner Wallet
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors text-2xl leading-none"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Wallet Name Input */}
          <div>
            <label
              htmlFor="wallet-name"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Wallet Name
            </label>
            <input
              id="wallet-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter wallet name"
              className="mb-1.5 w-full px-4 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-black"
              autoFocus
            />
            <p>Burners last for One Session (When u close this app they will dissapear)</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-sm text-red-600 text-sm text-center">
              {error}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 mt-6">
            <button
              type="button"
              onClick={handleClose}
              className="cursor-pointer flex-1 px-4 py-2 border border-gray-300 rounded-sm font-semibold hover:bg-gray-50 transition-colors text-black"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-black text-white rounded-sm font-semibold hover:bg-gray-800 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Creating..." : "Create Wallet"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

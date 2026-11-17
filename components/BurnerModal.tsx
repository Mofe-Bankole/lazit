"use client";
import { useState, FormEvent } from "react";
import axios from "axios";
import { Flame, X } from "lucide-react";
import { BurnerModalProps } from "../lib/types";
import { Button, Field } from "./ui";

export default function BurnerModal({ isOpen, onClose, onSubmit, owner }: BurnerModalProps) {
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Give your burner a name");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post("/api/burners", { name: name.trim(), owner: owner.trim() });
      if (response.data.success && response.data.wallet) {
        onSubmit?.(response.data.wallet);
        setName("");
        onClose();
      } else {
        setError(response.data.error || "Failed to create burner wallet");
      }
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || "Failed to create burner wallet");
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={handleClose} />

      <div className="relative w-full max-w-md rounded-2xl border border-white/10 bg-[#13111C] p-6 text-zinc-100 shadow-2xl">
        <div className="mb-5 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-orange-400/10 text-orange-300">
              <Flame className="h-4 w-4" />
            </span>
            <div>
              <h2 className="font-semibold">New burner wallet</h2>
              <p className="text-sm text-zinc-500">Expires one hour after creation</p>
            </div>
          </div>
          <button onClick={handleClose} aria-label="Close" className="cursor-pointer text-zinc-500 transition hover:text-white">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Field
            label="Name"
            placeholder="e.g. Coffee money"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoFocus
          />

          {error && (
            <p className="rounded-lg border border-red-500/20 bg-red-500/5 px-3 py-2 text-sm text-red-200">{error}</p>
          )}

          <div className="flex gap-3 pt-2">
            <Button type="button" variant="secondary" className="flex-1" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" className="flex-1" loading={loading}>
              {loading ? "Creating…" : "Create burner"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

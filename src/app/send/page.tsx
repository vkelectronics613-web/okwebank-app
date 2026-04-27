"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Send } from "lucide-react";

function SendMoneyForm() {
  const [toUpi, setToUpi] = useState("");
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const to = searchParams.get('to');
    if (to) setToUpi(to);
  }, [searchParams]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const res = await fetch("/api/transactions/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to_upi: toUpi,
          amount: parseFloat(amount),
          type: note ? `transfer: ${note}` : "transfer"
        }),
      });

      if (res.ok) {
        setSuccess("Money sent successfully!");
        setToUpi("");
        setAmount("");
        setNote("");
        setTimeout(() => {
          router.push("/");
          router.refresh();
        }, 1500);
      } else {
        const data = await res.json();
        setError(data.error || "Transfer failed");
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-black px-4 pt-12 pb-24">
      <div className="flex items-center mb-8">
        <Link href="/" className="mr-4 text-white hover:text-zinc-300">
          <ArrowLeft className="h-6 w-6" />
        </Link>
        <h1 className="text-xl font-semibold text-white">Send Money</h1>
      </div>

      <form onSubmit={handleSend} className="space-y-6">
        {error && (
          <div className="rounded-xl bg-red-500/10 p-4 text-sm text-red-500 border border-red-500/20">
            {error}
          </div>
        )}
        
        {success && (
          <div className="rounded-xl bg-green-500/10 p-4 text-sm text-green-500 border border-green-500/20">
            {success}
          </div>
        )}

        <div className="space-y-2">
          <label className="text-sm font-medium text-zinc-400">Receiver UPI ID</label>
          <input
            type="text"
            required
            value={toUpi}
            onChange={(e) => setToUpi(e.target.value)}
            className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-4 text-white placeholder-zinc-500 focus:border-white focus:outline-none focus:ring-1 focus:ring-white transition-colors"
            placeholder="e.g. friend@okwebank"
          />
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium text-zinc-400">Amount (₹)</label>
          <input
            type="number"
            required
            min="1"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-4 text-white placeholder-zinc-500 focus:border-white focus:outline-none focus:ring-1 focus:ring-white transition-colors text-2xl"
            placeholder="0.00"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-zinc-400">Note (Optional)</label>
          <input
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-4 text-white placeholder-zinc-500 focus:border-white focus:outline-none focus:ring-1 focus:ring-white transition-colors"
            placeholder="What's this for?"
          />
        </div>

        <button
          type="submit"
          disabled={loading || !toUpi || !amount}
          className="w-full rounded-xl bg-white px-4 py-4 text-base font-semibold text-black hover:bg-zinc-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black disabled:opacity-50 transition-colors mt-4 flex items-center justify-center"
        >
          {loading ? (
            "Processing..."
          ) : (
            <>
              Send Money <Send className="ml-2 h-4 w-4" />
            </>
          )}
        </button>
      </form>
    </div>
  );
}

export default function SendMoney() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black flex items-center justify-center text-white">Loading...</div>}>
      <SendMoneyForm />
    </Suspense>
  );
}

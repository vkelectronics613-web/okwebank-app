"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Wallet, Zap, ShieldCheck } from "lucide-react";

export default function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const upiSuffix = String.fromCharCode(46) + "owb";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();
      if (res.ok) {
        router.push("/login");
      } else {
        setError(data.error || "Registration failed");
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white px-6 text-slate-900 font-sans">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-1 bg-indigo-600"></div>
      <div className="absolute top-10 right-10 w-64 h-64 bg-indigo-50 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-10 left-10 w-64 h-64 bg-purple-50 rounded-full blur-3xl -z-10"></div>

      <div className="w-full max-w-sm space-y-10">
        <div className="flex flex-col items-center text-center">
          <div className="rounded-2xl bg-indigo-600 p-4 mb-6 shadow-xl shadow-indigo-100">
            <Zap className="h-8 w-8 text-white fill-white" />
          </div>
          <h2 className="text-4xl font-[1000] tracking-tighter text-slate-900">Get Started</h2>
          <p className="mt-2 text-sm text-slate-400 font-bold uppercase tracking-widest">Create your .owb digital identity</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="rounded-2xl bg-red-50 p-4 text-xs text-red-600 border border-red-100 font-black uppercase tracking-tight text-center">
              {error}
            </div>
          )}
          
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 text-left block">Username</label>
            <div className="relative">
                <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full rounded-2xl border-2 border-slate-100 bg-slate-50 px-6 py-5 text-slate-900 placeholder-slate-300 focus:border-indigo-600 focus:bg-white focus:outline-none transition-all font-bold"
                placeholder="Choose a username"
                />
            </div>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight pt-1 ml-1 opacity-60">
              Handle: <span className="text-indigo-600 italic">{username || 'username'}{upiSuffix}</span>
            </p>
          </div>
          
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 text-left block">Secure Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-2xl border-2 border-slate-100 bg-slate-50 px-6 py-5 text-slate-900 placeholder-slate-300 focus:border-indigo-600 focus:bg-white focus:outline-none transition-all font-bold"
              placeholder="Min. 6 characters"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-slate-900 text-white px-4 py-5 text-sm font-[1000] uppercase tracking-widest hover:bg-indigo-600 active:scale-95 transition-all mt-4 shadow-2xl shadow-slate-200 disabled:opacity-50"
          >
            {loading ? "Connecting to Ledger..." : "Create Free Account"}
          </button>
        </form>

        <div className="pt-4 text-center">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center justify-center gap-2">
                <ShieldCheck size={14} className="text-green-500" /> End-to-end encrypted
            </p>
            <p className="text-sm font-bold text-slate-400">
            Already have an account?{" "}
            <Link href="/login" className="text-indigo-600 font-black underline underline-offset-4 decoration-indigo-200 hover:decoration-indigo-600 transition-all">
                Sign in here
            </Link>
            </p>
        </div>
      </div>
    </div>
  );
}

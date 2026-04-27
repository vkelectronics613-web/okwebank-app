"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Zap, ShieldCheck, ArrowRight } from "lucide-react";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (res.ok) {
        router.push("/");
        router.refresh();
      } else {
        const data = await res.json();
        setError(data.error || "Login failed");
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white px-6 text-slate-900 font-sans">
      <div className="absolute top-10 left-10 w-64 h-64 bg-indigo-50 rounded-full blur-3xl -z-10 opacity-60"></div>
      <div className="absolute bottom-10 right-10 w-64 h-64 bg-purple-50 rounded-full blur-3xl -z-10 opacity-60"></div>

      <div className="w-full max-w-sm space-y-10">
        <div className="flex flex-col items-center text-center">
          <div className="rounded-2xl bg-indigo-600 p-4 mb-6 shadow-xl shadow-indigo-100">
            <Zap className="h-8 w-8 text-white fill-white" />
          </div>
          <h2 className="text-4xl font-[1000] tracking-tighter text-slate-900">Welcome Back</h2>
          <p className="mt-2 text-sm text-slate-400 font-bold uppercase tracking-widest">Sign in to your digital vault</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="rounded-2xl bg-red-50 p-4 text-xs text-red-600 border border-red-100 font-black uppercase tracking-tight text-center">
              {error}
            </div>
          )}
          
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Username</label>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full rounded-2xl border-2 border-slate-100 bg-slate-50 px-6 py-5 text-slate-900 placeholder-slate-300 focus:border-indigo-600 focus:bg-white focus:outline-none transition-all font-bold"
              placeholder="Enter username"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-2xl border-2 border-slate-100 bg-slate-50 px-6 py-5 text-slate-900 placeholder-slate-300 focus:border-indigo-600 focus:bg-white focus:outline-none transition-all font-bold"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-slate-900 text-white px-4 py-5 text-sm font-[1000] uppercase tracking-widest hover:bg-indigo-600 active:scale-95 transition-all mt-4 shadow-2xl shadow-slate-200 disabled:opacity-50"
          >
            {loading ? "Verifying..." : "Access My Wallet"}
          </button>
        </form>

        <div className="pt-4 text-center space-y-4">
            <p className="text-sm font-bold text-slate-400">
            Don't have an account?{" "}
            <Link href="/register" className="text-indigo-600 font-black underline underline-offset-4 decoration-indigo-200 hover:decoration-indigo-600 transition-all">
                Sign up for free
            </Link>
            </p>
            <Link href="/" className="text-[10px] font-black text-slate-300 uppercase tracking-widest hover:text-slate-500 transition-colors inline-block">
                ← Back to Home
            </Link>
        </div>
      </div>
    </div>
  );
}

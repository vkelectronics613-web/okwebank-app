"use client";

import Link from "next/link";
import { Zap, Shield, Smartphone, QrCode, ArrowRight, CheckCircle, Globe, Wallet, Lock, BarChart3, Users } from "lucide-react";

export function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900 selection:bg-indigo-100 selection:text-indigo-900 font-sans overflow-x-hidden">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-8 py-6 sticky top-0 bg-white/80 backdrop-blur-lg z-50 border-b border-slate-50">
        <div className="flex items-center gap-2">
          <div className="h-10 w-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-100">
            <Zap className="text-white fill-white" size={20} />
          </div>
          <span className="text-2xl font-[1000] tracking-tighter text-slate-900">okwebank</span>
        </div>
        <div className="flex items-center gap-8">
          <Link href="/login" className="text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors">Login</Link>
          <Link href="/register" className="bg-slate-900 text-white px-6 py-3 rounded-full text-sm font-bold hover:bg-indigo-600 transition-all active:scale-95 shadow-xl shadow-slate-200">
            Join Now
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative px-8 pt-20 pb-32 max-w-7xl mx-auto flex flex-col items-center text-center">
        {/* Animated Background Blobs */}
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-indigo-50 rounded-full blur-[120px] -z-10 opacity-60"></div>
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-purple-50 rounded-full blur-[100px] -z-10 opacity-40"></div>

        <div className="inline-flex items-center gap-2 rounded-full border-2 border-indigo-100 bg-white px-5 py-2 text-[11px] font-black uppercase tracking-widest text-indigo-600 mb-10 shadow-sm animate-bounce-slow">
            <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-indigo-600"></span>
            </span>
            Real-time Digital Ledger is Live
        </div>
        
        <h1 className="text-6xl md:text-8xl font-[1000] leading-[0.95] tracking-tighter text-slate-900 mb-8 max-w-4xl">
          Money at the speed of <span className="text-indigo-600 italic">Thought.</span>
        </h1>
        
        <p className="max-w-2xl mx-auto text-slate-500 text-xl md:text-2xl mb-12 font-medium leading-relaxed">
          The global bank for the next generation. Store, send, and settle assets in <span className="text-slate-900 font-bold underline decoration-indigo-300 underline-offset-4">WebCoin (WBC)</span> with zero latency and absolute security.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-6 w-full max-w-md">
          <Link href="/register" className="flex-1 bg-indigo-600 text-white font-[1000] py-6 rounded-[2rem] text-xl hover:bg-indigo-700 hover:scale-[1.03] active:scale-95 transition-all shadow-[0_20px_50px_rgba(79,70,229,0.3)] flex items-center justify-center gap-3">
            Open Account <ArrowRight size={24} />
          </Link>
        </div>
      </header>

      {/* Live Metrics */}
      <section className="bg-slate-900 py-16">
          <div className="max-w-7xl mx-auto px-8 grid grid-cols-2 md:grid-cols-4 gap-12">
              <Metric value="0ms" label="Settlement Time" />
              <Metric value="∞" label="Scale Capacity" />
              <Metric value="256-bit" label="Ledger Security" />
              <Metric value="FREE" label="P2P Transfers" />
          </div>
      </section>

      {/* Feature Grid */}
      <section className="px-8 py-32 max-w-7xl mx-auto">
        <div className="text-center mb-24">
            <h2 className="text-4xl md:text-5xl font-[1000] tracking-tighter mb-4">Engineered for absolute trust.</h2>
            <p className="text-slate-400 text-lg font-bold uppercase tracking-[0.2em]">The Core Protocol Features</p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          <FeatureCard 
            icon={<Shield size={32} className="text-green-500" />} 
            title="Proof of Ledger" 
            desc="Every single coin in okwebank is verified by a chain of transactions. We don't just store numbers; we secure history." 
          />
          <FeatureCard 
            icon={<QrCode size={32} className="text-indigo-500" />} 
            title="Instant Suffix Handles" 
            desc="Say goodbye to long account numbers. Your identity is your handle: username.owb. Simple, clean, human." 
          />
          <FeatureCard 
            icon={<Globe size={32} className="text-purple-500" />} 
            title="Boundaryless Economy" 
            desc="Whether you're paying a friend or a major merchant via okwepay, the transaction is local, instant, and permanent." 
          />
        </div>
      </section>

      {/* How it Works - Detailed Section */}
      <section className="bg-slate-50 py-32 px-8 overflow-hidden">
          <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-center">
              <div className="space-y-12">
                  <h2 className="text-5xl font-[1000] tracking-tighter leading-tight">Banking that fits in <br/><span className="text-indigo-600">your pocket.</span></h2>
                  
                  <Step num="01" title="Register your Handle" desc="Pick a unique .owb identity that stays with you across the entire ecosystem." />
                  <Step num="02" title="Load your Wallet" desc="Mint WebCoins instantly through our secure gateway and watch your balance grow." />
                  <Step num="03" title="Pay with a Scan" desc="Use your phone to scan any OkwePay QR code. Transactions settle in the blink of an eye." />
              </div>
              
              {/* Visual App Mockup */}
              <div className="relative group">
                  <div className="absolute inset-0 bg-indigo-600 rounded-[3rem] blur-3xl opacity-10 group-hover:opacity-20 transition-opacity"></div>
                  <div className="relative bg-white border-[12px] border-slate-900 rounded-[3.5rem] shadow-2xl p-4 w-full max-w-[360px] mx-auto aspect-[9/18.5] overflow-hidden">
                      <div className="flex justify-between p-4 mb-8">
                          <div className="h-2 w-12 rounded-full bg-slate-100"></div>
                          <Zap size={16} className="text-indigo-600" />
                      </div>
                      <div className="p-4 space-y-6">
                          <div className="h-32 bg-slate-900 rounded-3xl p-6 flex flex-col justify-end text-white shadow-xl">
                              <p className="text-[8px] font-black uppercase opacity-40">Main Wallet</p>
                              <p className="text-2xl font-black tracking-tight">₹42,850.20</p>
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                              <div className="h-16 bg-slate-50 rounded-2xl border border-slate-100"></div>
                              <div className="h-16 bg-slate-50 rounded-2xl border border-slate-100"></div>
                          </div>
                          <div className="space-y-3 pt-4">
                              <div className="h-12 bg-white rounded-2xl border border-slate-50 shadow-sm flex items-center px-4 gap-3">
                                  <div className="h-6 w-6 rounded-full bg-green-100 flex items-center justify-center"><CheckCircle size={12} className="text-green-600" /></div>
                                  <div className="h-2 w-20 bg-slate-100 rounded-full"></div>
                              </div>
                              <div className="h-12 bg-white rounded-2xl border border-slate-50 shadow-sm flex items-center px-4 gap-3">
                                  <div className="h-6 w-6 rounded-full bg-slate-100 flex items-center justify-center"><Users size={12} className="text-slate-400" /></div>
                                  <div className="h-2 w-24 bg-slate-100 rounded-full"></div>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      </section>

      {/* Security Banner */}
      <section className="py-24 px-8 text-center max-w-4xl mx-auto">
          <div className="bg-indigo-600 rounded-[3rem] p-12 text-white shadow-2xl shadow-indigo-200 relative overflow-hidden">
                <div className="absolute -top-10 -left-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
                <Lock size={48} className="mx-auto mb-6 text-white" />
                <h3 className="text-3xl font-[1000] mb-4">Security is not an option. <br/>It's our baseline.</h3>
                <p className="text-indigo-100 font-medium mb-10 opacity-80">Our proprietary ledger ensures your funds are immutable. No double spending. No central manipulation. Just pure math.</p>
                <Link href="/register" className="inline-block bg-white text-indigo-600 px-10 py-5 rounded-full font-[1000] text-lg hover:scale-105 transition-all">Start Banking Safely</Link>
          </div>
      </section>

      <footer className="py-20 px-8 border-t border-slate-100 text-center">
        <div className="flex items-center justify-center gap-2 mb-8 opacity-20">
          <div className="h-6 w-6 bg-slate-900 rounded-lg flex items-center justify-center">
            <Zap className="text-white fill-white" size={12} />
          </div>
          <span className="text-sm font-black tracking-tighter text-slate-900 uppercase">okwebank core</span>
        </div>
        <p className="text-slate-400 text-xs font-bold uppercase tracking-[0.4em]">© 2026 OKWEBANK SYSTEMS. ALL RIGHTS RESERVED.</p>
      </footer>

      <style jsx global>{`
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .animate-bounce-slow {
          animation: bounce-slow 4s infinite ease-in-out;
        }
      `}</style>
    </div>
  );
}

function FeatureCard({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <div className="group bg-white p-10 rounded-[2.5rem] border-2 border-slate-50 hover:border-indigo-100 transition-all hover:shadow-2xl hover:shadow-indigo-50 hover:-translate-y-2">
      <div className="mb-6 h-16 w-16 rounded-3xl bg-slate-50 flex items-center justify-center group-hover:bg-indigo-50 transition-colors">
        {icon}
      </div>
      <h4 className="text-2xl font-[1000] tracking-tight mb-4 text-slate-900">{title}</h4>
      <p className="text-slate-500 font-medium leading-relaxed">{desc}</p>
    </div>
  );
}

function Metric({ value, label }: { value: string, label: string }) {
    return (
        <div className="text-center">
            <p className="text-4xl md:text-5xl font-[1000] text-white tracking-tighter mb-1">{value}</p>
            <p className="text-[10px] font-black uppercase text-indigo-400 tracking-widest">{label}</p>
        </div>
    )
}

function Step({ num, title, desc }: { num: string, title: string, desc: string }) {
    return (
        <div className="flex gap-6 group">
            <div className="text-4xl font-[1000] text-indigo-100 group-hover:text-indigo-600 transition-colors italic leading-none">{num}</div>
            <div>
                <h4 className="text-xl font-black text-slate-900 mb-2">{title}</h4>
                <p className="text-slate-500 font-medium leading-relaxed">{desc}</p>
            </div>
        </div>
    )
}

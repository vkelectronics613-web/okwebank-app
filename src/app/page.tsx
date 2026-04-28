import { getSession, logout } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { ArrowUpRight, ArrowDownLeft, QrCode, ArrowRight, Shield, Zap, Gift, Wallet, BarChart3, Users, Settings } from "lucide-react";
import { LandingPage } from "@/components/LandingPage";
import PinOverlay from "@/components/PinOverlay";
import { redirect } from "next/navigation";

export const dynamic = 'force-dynamic';

export default async function Home() {
  const session = await getSession();
  
  if (!session) {
    return <LandingPage />;
  }

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
  });

  // Handle case where session exists but user was deleted from DB
  if (!user) {
    return <LandingPage />;
  }

  if (!user.pin_hash) {
    return <PinOverlay mode="set" onSuccess={() => {}} />;
  }

  // Fetch recent transactions
  const recentTransactions = await prisma.transaction.findMany({
    where: {
      OR: [
        { from_upi: user.upi_id },
        { to_upi: user.upi_id }
      ]
    },
    orderBy: { timestamp: 'desc' },
    take: 5,
  });

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-black transition-colors duration-300 font-sans pb-32 text-slate-900 dark:text-white">
      {/* 1. TOP NAVIGATION / GREETING */}
      <div className="px-6 pt-12 mb-8 flex items-center justify-between">
        <div>
            <p className="text-[10px] font-black text-slate-400 dark:text-zinc-500 uppercase tracking-[0.2em] mb-1">Vault Registry</p>
            <h1 className="text-2xl font-[1000] text-slate-900 dark:text-white tracking-tighter uppercase italic">Hi, {user.username}</h1>
        </div>
        <Link href="/profile" className="h-12 w-12 rounded-2xl bg-slate-50 dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shadow-sm">
            <Users size={24} />
        </Link>
      </div>

      {/* 2. MAIN WALLET SECTION */}
      <section className="px-6 mb-10">
          <div className="bg-slate-900 dark:bg-zinc-900 rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden group border border-indigo-500/10">
              <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:rotate-12 transition-transform duration-700">
                  <Wallet size={80} />
              </div>
              <div className="relative z-10">
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-400 mb-2 font-mono">Total Liquidity</p>
                  <h2 className="text-5xl font-[1000] tracking-tighter mb-6">₹{user.balance.toFixed(2)}</h2>
                  <div className="flex items-center gap-2 text-zinc-400 font-mono text-[10px] bg-black/20 w-fit px-3 py-1.5 rounded-full border border-white/5">
                      <Zap size={10} className="text-yellow-500" /> {user.upi_id}
                  </div>
              </div>
          </div>
      </section>

      {/* 3. ACTION GRID */}
      <section className="px-6 mb-10">
          <p className="text-[10px] font-black text-slate-400 dark:text-zinc-600 uppercase tracking-widest ml-2 mb-4">Core Commands</p>
          <div className="grid grid-cols-2 gap-4 text-white">
              <ActionCard 
                href="/send" 
                icon={<ArrowUpRight size={20} />} 
                label="Transfer" 
                sub="Send WBC"
                color="bg-indigo-600"
              />
              <ActionCard 
                href="/scan" 
                icon={<QrCode size={20} />} 
                label="Scan Pay" 
                sub="Merchant QR"
                color="bg-slate-900 dark:bg-white dark:text-black text-white"
              />
          </div>
      </section>

      {/* 4. ACCOUNT HEALTH SECTION */}
      <section className="px-6 mb-10 text-white">
          <div className="bg-slate-50 dark:bg-zinc-900/50 rounded-[2rem] p-6 border border-slate-100 dark:border-zinc-900 grid grid-cols-2 gap-6">
              <div className="border-r border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-white">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-tighter mb-1">Trust Score</p>
                  <p className="text-xl font-black">{user.trust_score}%</p>
              </div>
              <div className="text-slate-900 dark:text-white">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-tighter mb-1">Network Status</p>
                  <div className="flex items-center gap-1.5 text-green-500 font-black text-[10px] uppercase">
                      <div className="h-1.5 w-1.5 rounded-full bg-green-500 animate-ping"></div> Active
                  </div>
              </div>
          </div>
      </section>

      {/* 5. TRANSACTION STREAM */}
      <section className="px-6 flex-1">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest">Recent Activity</h3>
          <Link href="/history" className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest hover:underline">View All</Link>
        </div>
        
        <div className="space-y-3">
          {recentTransactions.length === 0 ? (
            <div className="py-12 flex flex-col items-center justify-center bg-slate-50 dark:bg-zinc-900/30 rounded-[2rem] border-2 border-dashed border-slate-100 dark:border-zinc-900">
              <Shield size={32} className="text-slate-200 dark:text-zinc-800 mb-2" />
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">No ledger entries found</p>
            </div>
          ) : (
            recentTransactions.map((tx: any) => {
              const isSent = tx.from_upi === user.upi_id;
              return (
                <div key={tx.txn_id} className="flex items-center justify-between p-5 rounded-3xl bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 shadow-sm transition-all hover:border-indigo-100 group">
                  <div className="flex items-center gap-4 text-slate-900 dark:text-white">
                    <div className={`h-10 w-10 rounded-2xl flex items-center justify-center ${isSent ? 'bg-slate-50 dark:bg-black text-slate-400' : 'bg-green-50 dark:bg-green-900/20 text-green-600'}`}>
                      {isSent ? <ArrowUpRight size={18} /> : <ArrowDownLeft size={18} />}
                    </div>
                    <div className="text-slate-900 dark:text-white">
                      <p className="text-xs font-black uppercase tracking-tighter truncate max-w-[120px]">
                        {isSent ? `${tx.to_upi}` : `${tx.from_upi}`}
                      </p>
                      <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                        {new Date(tx.timestamp).toLocaleDateString()} • ID:{tx.txn_id.slice(-6).toUpperCase()}
                      </p>
                    </div>
                  </div>
                  <div className={`text-sm font-[1000] tracking-tighter ${isSent ? 'text-slate-900 dark:text-white' : 'text-green-500'}`}>
                    {isSent ? '-' : '+'}₹{tx.amount.toFixed(2)}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </section>
    </div>
  );
}

function ActionCard({ href, icon, label, sub, color }: { href: string, icon: React.ReactNode, label: string, sub: string, color: string }) {
    return (
        <Link href={href} className="group">
            <div className={`p-6 rounded-[2.5rem] ${color} transition-all hover:-translate-y-1 shadow-lg shadow-black/5 flex flex-col h-32 justify-between`}>
                <div className="h-10 w-10 bg-white/20 rounded-xl flex items-center justify-center text-white backdrop-blur-sm">
                    {icon}
                </div>
                <div>
                    <p className="text-xs font-black uppercase tracking-tighter text-white">{label}</p>
                    <p className="text-[8px] font-bold uppercase tracking-widest text-white/50">{sub}</p>
                </div>
            </div>
        </Link>
    )
}

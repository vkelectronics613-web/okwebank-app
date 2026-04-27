import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { ArrowUpRight, ArrowDownLeft, QrCode, ArrowRight, Shield, Zap, Gift } from "lucide-react";
import { LandingPage } from "@/components/LandingPage";

export default async function Home() {
  const session = await getSession();
  
  if (!session) {
    return <LandingPage />;
  }

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
  });

  if (!user) {
    return <LandingPage />;
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
    <div className="flex flex-col min-h-screen bg-black px-4 pt-12 pb-24">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-white">Hello, {user.username}</h1>
          <p className="text-sm text-zinc-400 mt-1">{user.upi_id}</p>
        </div>
        <div className="h-10 w-10 rounded-full bg-zinc-800 flex items-center justify-center text-white font-bold">
          {user.username.charAt(0).toUpperCase()}
        </div>
      </div>

      {/* Balance Card */}
      <div className="rounded-2xl bg-zinc-900 border border-zinc-800 p-6 mb-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none"></div>
        <p className="text-sm font-medium text-zinc-400 mb-2">Total Balance</p>
        <h2 className="text-4xl font-bold text-white tracking-tight">₹{user.balance.toFixed(2)}</h2>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <Link href="/send" className="flex flex-col items-center justify-center bg-zinc-900 border border-zinc-800 rounded-xl p-4 hover:bg-zinc-800 transition-colors">
          <div className="h-10 w-10 rounded-full bg-zinc-800 flex items-center justify-center mb-3">
            <ArrowUpRight className="text-white h-5 w-5" />
          </div>
          <span className="text-xs font-medium text-white">Send</span>
        </Link>
        <Link href="/scan" className="flex flex-col items-center justify-center bg-zinc-900 border border-zinc-800 rounded-xl p-4 hover:bg-zinc-800 transition-colors">
          <div className="h-10 w-10 rounded-full bg-zinc-800 flex items-center justify-center mb-3">
            <QrCode className="text-white h-5 w-5" />
          </div>
          <span className="text-xs font-medium text-white">Scan</span>
        </Link>
      </div>

      {/* Recent Transactions */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Recent Transactions</h3>
          <Link href="/history" className="text-sm text-zinc-400 hover:text-white flex items-center">
            See all <ArrowRight className="h-4 w-4 ml-1" />
          </Link>
        </div>
        
        <div className="space-y-4">
          {recentTransactions.length === 0 ? (
            <div className="py-12 flex flex-col items-center justify-center bg-zinc-900/30 rounded-2xl border border-dashed border-zinc-800">
              <div className="text-zinc-600 mb-2">
                 <Shield size={32} />
              </div>
              <p className="text-sm text-zinc-500">No transactions yet</p>
            </div>
          ) : (
            recentTransactions.map((tx: any) => {
              const isSent = tx.from_upi === user.upi_id;
              return (
                <div key={tx.txn_id} className="flex items-center justify-between p-4 rounded-xl bg-zinc-900/50 border border-zinc-800/50">
                  <div className="flex items-center">
                    <div className={`h-10 w-10 rounded-full flex items-center justify-center mr-4 ${isSent ? 'bg-zinc-800' : 'bg-white/10'}`}>
                      {isSent ? <ArrowUpRight className="h-5 w-5 text-zinc-400" /> : <ArrowDownLeft className="h-5 w-5 text-white" />}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white truncate max-w-[120px]">
                        {isSent ? `To ${tx.to_upi}` : `From ${tx.from_upi}`}
                      </p>
                      <p className="text-[10px] text-zinc-500 mt-0.5">
                        {new Date(tx.timestamp).toLocaleDateString()} • {tx.type}
                      </p>
                    </div>
                  </div>
                  <div className={`text-sm font-semibold ${isSent ? 'text-white' : 'text-green-400'}`}>
                    {isSent ? '-' : '+'}₹{tx.amount.toFixed(2)}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

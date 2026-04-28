import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, ArrowDownLeft, Wallet } from "lucide-react";
import { redirect } from "next/navigation";

export const dynamic = 'force-dynamic';

export default async function History() {
  const session = await getSession();
  
  if (!session) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
  });

  if (!user) {
    redirect("/login");
  }

  const transactions = await prisma.transaction.findMany({
    where: {
      OR: [
        { from_upi: user.upi_id },
        { to_upi: user.upi_id }
      ]
    },
    orderBy: { timestamp: 'desc' },
  });

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-black transition-colors duration-300 text-slate-900 dark:text-white pb-24 font-sans">
      <div className="px-6 pt-12 mb-8">
        <div className="flex items-center gap-4 mb-4">
            <Link href="/" className="p-2 rounded-xl bg-slate-50 dark:bg-zinc-900 text-slate-900 dark:text-white">
                <ArrowLeft size={20} />
            </Link>
            <h1 className="text-2xl font-[1000] uppercase italic tracking-tighter text-indigo-600">Transaction Log</h1>
        </div>
        <p className="text-slate-400 dark:text-zinc-600 text-[10px] font-black uppercase tracking-[0.2em] ml-2 font-mono">Verified Ledger Entries</p>
      </div>

      <div className="px-6 space-y-4">
        {transactions.length === 0 ? (
          <div className="py-20 flex flex-col items-center justify-center opacity-20">
            <Wallet size={48} className="mb-4" />
            <p className="text-xs font-black uppercase tracking-widest">No history yet</p>
          </div>
        ) : (
          transactions.map((tx: any) => {
            const isSent = tx.from_upi === user.upi_id;
            return (
              <div key={tx.txn_id} className="bg-slate-50 dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 p-6 rounded-[2rem] flex items-center justify-between shadow-sm transition-all hover:border-indigo-100 group">
                <div className="flex items-center gap-4 text-slate-900 dark:text-white">
                  <div className={`h-12 w-12 rounded-2xl flex items-center justify-center ${isSent ? 'bg-white dark:bg-black text-slate-400' : 'bg-green-50 dark:bg-green-900/20 text-green-600'}`}>
                    {isSent ? <ArrowUpRight size={20} /> : <ArrowDownLeft size={20} />}
                  </div>
                  <div className="text-slate-900 dark:text-white">
                    <p className="text-xs font-black uppercase tracking-tight mb-1 truncate max-w-[150px]">
                      {isSent ? `To: ${tx.to_upi}` : `From: ${tx.from_upi}`}
                    </p>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                        {new Date(tx.timestamp).toLocaleString()}
                        <span className="h-1 w-1 rounded-full bg-slate-200 dark:bg-zinc-800"></span>
                        ID: {tx.txn_id.slice(-10).toUpperCase()}
                    </p>
                  </div>
                </div>
                <div className={`text-lg font-[1000] tracking-tighter ${isSent ? 'text-slate-900 dark:text-white' : 'text-green-500'}`}>
                  {isSent ? '-' : '+'}₹{tx.amount.toFixed(2)}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

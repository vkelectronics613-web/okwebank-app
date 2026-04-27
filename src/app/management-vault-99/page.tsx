import { prisma } from "@/lib/prisma";
import { Shield, Users, ArrowLeftRight, Landmark, CreditCard, Clock, Search } from "lucide-react";
import Link from "next/link";

export const dynamic = 'force-dynamic';

export default async function ManagementVault() {
  const [users, txs] = await Promise.all([
    prisma.user.findMany({ orderBy: { created_at: 'desc' } }),
    prisma.transaction.findMany({ orderBy: { timestamp: 'desc' }, take: 100 })
  ]);

  return (
    <div className="min-h-screen bg-slate-50 py-16 px-6 font-sans text-slate-900">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-4 mb-12">
            <div className="bg-indigo-600 p-3 rounded-2xl shadow-xl text-white">
                <Shield size={32} />
            </div>
            <div>
                <h1 className="text-4xl font-[1000] tracking-tighter italic uppercase">Master Vault</h1>
                <p className="text-slate-400 font-bold text-xs uppercase tracking-[0.3em]">Core System Monitoring</p>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* USERS COLUMN */}
            <div className="lg:col-span-1 space-y-6">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest ml-2 flex items-center gap-2">
                    <Users size={14} /> Account Registry ({users.length})
                </h3>
                <div className="space-y-3 max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar">
                    {users.map(u => (
                        <div key={u.id} className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm transition-all hover:shadow-md group">
                            <div className="flex items-center justify-between mb-3">
                                <span className="text-xs font-black text-slate-900 truncate uppercase">{u.username}</span>
                                <span className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">{u.trust_score}%</span>
                            </div>
                            <p className="text-[10px] font-mono text-slate-400 mb-4">{u.upi_id}</p>
                            <div className="flex items-center justify-between">
                                <span className="text-lg font-black text-slate-900">₹{u.balance.toFixed(2)}</span>
                                <span className="text-[8px] font-bold text-slate-300 uppercase">{new Date(u.created_at).toLocaleDateString()}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* TRANSACTIONS COLUMN */}
            <div className="lg:col-span-2 space-y-6">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest ml-2 flex items-center gap-2">
                    <ArrowLeftRight size={14} /> Ledger Stream (Last 100)
                </h3>
                <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl overflow-hidden">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-slate-50">
                            <tr>
                                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Txn ID</th>
                                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Party A</th>
                                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Party B</th>
                                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Amount</th>
                                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Type</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {txs.map(t => (
                                <tr key={t.txn_id} className="hover:bg-slate-50 transition-colors group">
                                    <td className="px-6 py-4">
                                        <code className="text-[10px] font-black text-indigo-400 group-hover:text-indigo-600">{t.txn_id.slice(-8).toUpperCase()}</code>
                                    </td>
                                    <td className="px-6 py-4 font-bold text-xs text-slate-600 truncate max-w-[100px]">{t.from_upi}</td>
                                    <td className="px-6 py-4 font-bold text-xs text-slate-600 truncate max-w-[100px]">{t.to_upi}</td>
                                    <td className="px-6 py-4 font-black text-sm text-slate-900">₹{t.amount.toFixed(2)}</td>
                                    <td className="px-6 py-4">
                                        <span className={`text-[9px] font-black uppercase px-2 py-1 rounded-full ${
                                            t.type.includes('admin') ? 'bg-red-50 text-red-600' :
                                            t.type.includes('settle') ? 'bg-green-50 text-green-600' : 'bg-slate-100 text-slate-400'
                                        }`}>{t.type}</span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}

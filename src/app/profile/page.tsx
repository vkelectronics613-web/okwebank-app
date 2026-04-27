import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { User, ShieldCheck, LogOut, ShieldAlert, Settings } from "lucide-react";
import Link from "next/link";
import LogoutButton from "./LogoutButton";

export default async function Profile() {
  const session = await getSession();
  
  if (!session) {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
  });

  if (!user) {
    return null;
  }

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-black px-4 pt-12 pb-24 transition-colors duration-300 text-slate-900 dark:text-white">
      <div className="flex items-center mb-8 px-2">
        <h1 className="text-2xl font-[1000] uppercase italic tracking-tighter">My Account</h1>
      </div>

      <div className="flex flex-col items-center mb-10">
        <div className="h-24 w-24 rounded-[2rem] bg-slate-50 dark:bg-zinc-900 flex items-center justify-center text-indigo-600 text-4xl font-black mb-4 border-2 border-slate-100 dark:border-zinc-800 shadow-xl">
          {user.username.charAt(0).toUpperCase()}
        </div>
        <h2 className="text-2xl font-black">{user.username}</h2>
        <p className="text-slate-400 dark:text-zinc-500 font-mono text-xs mt-1">{user.upi_id}</p>
        <p className="text-xl font-[1000] mt-3">₹{user.balance.toFixed(2)}</p>
      </div>

      {/* QR Code Section */}
      <div className="bg-white p-6 rounded-[2.5rem] mb-10 flex flex-col items-center shadow-2xl border-4 border-slate-50 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-20 h-20 bg-indigo-50 rounded-full -mr-10 -mt-10 opacity-60"></div>
        <img 
          src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(user.upi_id)}`} 
          alt="My UPI QR Code"
          className="w-44 h-44 mb-4 relative z-10 group-hover:scale-105 transition-transform duration-500"
        />
        <p className="text-slate-400 text-[9px] font-black uppercase tracking-[0.2em] relative z-10">Hold to download QR</p>
      </div>

      <div className="space-y-3 mb-10">
        <Link href="/settings" className="bg-slate-50 dark:bg-zinc-900 rounded-3xl p-6 border border-slate-100 dark:border-zinc-800 flex items-center justify-between group hover:border-indigo-200 transition-all">
          <div className="flex items-center text-slate-600 dark:text-zinc-400">
            <Settings className="mr-4 h-5 w-5 text-indigo-500 group-hover:rotate-90 transition-transform duration-700" />
            <span className="font-black text-sm uppercase tracking-tighter">Security & Theme</span>
          </div>
          <ChevronRight size={16} className="text-slate-300 dark:text-zinc-700" />
        </Link>

        <div className="bg-slate-50 dark:bg-zinc-900 rounded-3xl p-6 border border-slate-100 dark:border-zinc-800 flex items-center justify-between">
          <div className="flex items-center text-slate-600 dark:text-zinc-400">
            <ShieldCheck className="mr-4 h-5 w-5 text-green-500" />
            <span className="font-black text-sm uppercase tracking-tighter">Account Trust</span>
          </div>
          <div className="flex items-center">
            <span className="font-black mr-2 text-sm">{user.trust_score}%</span>
            <span className="text-[8px] bg-green-500 text-white px-2 py-0.5 rounded-full font-black uppercase">Verified</span>
          </div>
        </div>
      </div>

      <div className="mt-auto">
        <LogoutButton />
      </div>
    </div>
  );
}

import { ChevronRight } from "lucide-react";

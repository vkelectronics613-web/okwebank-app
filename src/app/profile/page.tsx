import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { User, ShieldCheck, LogOut, ShieldAlert } from "lucide-react";
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
    <div className="flex flex-col min-h-screen bg-black px-4 pt-12 pb-24">
      <div className="flex items-center mb-8">
        <h1 className="text-2xl font-semibold text-white">Profile</h1>
      </div>

      <div className="flex flex-col items-center mb-8">
        <div className="h-24 w-24 rounded-full bg-zinc-800 flex items-center justify-center text-white text-3xl font-bold mb-4 border-4 border-zinc-900 shadow-xl">
          {user.username.charAt(0).toUpperCase()}
        </div>
        <h2 className="text-2xl font-semibold text-white">{user.username}</h2>
        <p className="text-zinc-400 mt-1">{user.upi_id}</p>
        <p className="text-lg font-bold text-white mt-2">₹{user.balance.toFixed(2)}</p>
      </div>

      {/* QR Code Section */}
      <div className="bg-white p-4 rounded-2xl mb-8 flex flex-col items-center shadow-lg border-4 border-zinc-900">
        <img 
          src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(user.upi_id)}`} 
          alt="My UPI QR Code"
          className="w-48 h-48 mb-2"
        />
        <p className="text-black text-xs font-bold uppercase tracking-widest opacity-60">Scan to pay me</p>
      </div>

      <div className="space-y-4 mb-8">
        <div className="bg-zinc-900 rounded-xl p-5 border border-zinc-800 flex items-center justify-between">
          <div className="flex items-center text-zinc-300">
            <User className="mr-3 h-5 w-5 text-zinc-500" />
            <span className="font-medium">Joined</span>
          </div>
          <span className="text-white font-medium">{new Date(user.created_at).toLocaleDateString()}</span>
        </div>

        <div className="bg-zinc-900 rounded-xl p-5 border border-zinc-800 flex items-center justify-between">
          <div className="flex items-center text-zinc-300">
            <ShieldCheck className="mr-3 h-5 w-5 text-green-500" />
            <span className="font-medium">Trust Score</span>
          </div>
          <div className="flex items-center">
            <span className="text-white font-bold mr-2">{user.trust_score}</span>
            <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded-full font-semibold">Excellent</span>
          </div>
        </div>
      </div>

      <div className="mt-auto">
        <LogoutButton />
      </div>
    </div>
  );
}

'use client';

import { useState } from 'react';
import { ShieldAlert, Loader2, Send } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function AdminPage() {
  const [toUpi, setToUpi] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const router = useRouter();

  const upiSuffix = ".owb";

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setIsError(false);

    try {
      const res = await fetch('/api/admin/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ to_upi: toUpi, amount: Number(amount) }),
      });
      const data = await res.json();

      if (res.ok) {
        setMessage(`Successfully sent ${amount} WBC to ${toUpi}`);
        setToUpi('');
        setAmount('');
        router.refresh();
      } else {
        setIsError(true);
        setMessage(data.error || 'Failed to send WBC');
      }
    } catch (err) {
      setIsError(true);
      setMessage('An error occurred while sending');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 flex flex-col items-center justify-center min-h-[80vh] bg-black text-white">
      <div className="bg-zinc-900 p-8 rounded-3xl shadow-2xl flex flex-col items-center border border-red-500/20 w-full max-w-md">
        <div className="bg-red-500/10 p-4 rounded-2xl mb-6">
          <ShieldAlert size={48} className="text-red-500" />
        </div>
        <h2 className="text-2xl font-black text-white mb-2 tracking-tight">Admin Control Panel</h2>
        <p className="text-zinc-500 text-center mb-8 text-sm font-medium uppercase tracking-widest">
          Issue WBC to any valid <span className="text-red-400">{upiSuffix}</span> user account.
        </p>

        {message && (
          <div className={`mb-6 p-4 rounded-2xl text-sm font-bold text-center w-full border ${isError ? 'bg-red-500/10 text-red-500 border-red-500/20' : 'bg-green-500/10 text-green-500 border-green-500/20'}`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSend} className="w-full space-y-5">
          <div className="space-y-1.5">
            <label className="block text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Receiver UPI ID</label>
            <input
              type="text"
              required
              value={toUpi}
              onChange={(e) => setToUpi(e.target.value)}
              placeholder={`username${upiSuffix}`}
              className="w-full bg-black border border-zinc-800 rounded-2xl px-5 py-4 text-white placeholder-zinc-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all font-mono"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Amount (WBC)</label>
            <input
              type="number"
              required
              min="1"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="1000"
              className="w-full bg-black border border-zinc-800 rounded-2xl px-5 py-4 text-white placeholder-zinc-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all font-mono"
            />
          </div>

          <button
            type="submit"
            disabled={loading || !toUpi || !amount}
            className="w-full mt-4 bg-white text-black font-black py-5 rounded-2xl flex justify-center items-center transition-all hover:bg-red-600 hover:text-white disabled:opacity-30 disabled:hover:bg-white disabled:hover:text-black active:scale-95 shadow-xl shadow-red-500/5"
          >
            {loading ? (
              <Loader2 className="animate-spin mr-2" />
            ) : (
              <>
                <Send className="mr-2" size={18} />
                Send WBC
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

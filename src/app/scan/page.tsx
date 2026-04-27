'use client';

import { useState } from 'react';
import { Search, ArrowRight, Loader2, QrCode } from 'lucide-react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';

// Import QrScanner dynamically to avoid SSR issues with navigator/camera
const QrScanner = dynamic(() => import('./QrScanner'), { 
  ssr: false,
  loading: () => (
    <div className="aspect-square w-full max-w-sm mx-auto bg-zinc-900 rounded-[2.5rem] flex items-center justify-center animate-pulse border-2 border-zinc-800">
        <QrCode size={64} className="text-zinc-800" />
    </div>
  )
});

export default function ScanPage() {
  const [upiId, setUpiId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const upiSuffix = ".owb";

  const handleManualEntry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!upiId) return;

    setLoading(true);
    setError('');

    if (!upiId.includes(upiSuffix)) {
      setError(`Invalid UPI ID format. Must include ${upiSuffix}`);
      setLoading(false);
      return;
    }

    router.push(`/send?to=${encodeURIComponent(upiId)}`);
  };

  return (
    <div className="flex flex-col min-h-screen bg-black px-6 pt-12 pb-32 text-white font-sans">
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-[1000] tracking-tighter">Scan & Pay</h1>
        <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest mt-1">Real-time WBC Settlement</p>
      </div>

      {/* Real Camera Scanner */}
      <div className="mb-12">
        <QrScanner />
      </div>

      <div className="space-y-8">
        <div className="flex items-center gap-4">
          <div className="h-px flex-1 bg-zinc-900"></div>
          <span className="text-zinc-700 text-[10px] font-black uppercase tracking-[0.3em]">MANUAL ENTRY</span>
          <div className="h-px flex-1 bg-zinc-900"></div>
        </div>

        <form onSubmit={handleManualEntry} className="space-y-4">
          <div className="relative">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-600" size={20} />
            <input
              type="text"
              value={upiId}
              onChange={(e) => setUpiId(e.target.value)}
              placeholder={`username${upiSuffix}`}
              className="w-full bg-zinc-900 border-2 border-zinc-800 rounded-2xl py-5 pl-16 pr-6 text-white placeholder-zinc-700 focus:border-white focus:outline-none transition-all font-bold font-mono shadow-xl"
            />
          </div>

          {error && <p className="text-red-500 text-[10px] font-black uppercase text-center bg-red-500/10 p-4 rounded-2xl border border-red-500/20 tracking-tighter">{error}</p>}

          <button
            type="submit"
            disabled={loading || !upiId}
            className="w-full bg-white text-black font-[1000] py-5 rounded-2xl flex items-center justify-center gap-2 hover:bg-zinc-200 active:scale-95 transition-all disabled:opacity-50 shadow-2xl shadow-white/5"
          >
            {loading ? <Loader2 className="animate-spin" /> : <>Continue to Pay <ArrowRight size={20} /></>}
          </button>
        </form>
      </div>
    </div>
  );
}

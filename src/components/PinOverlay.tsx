'use client';

import { useState, useRef, useEffect } from 'react';
import { Lock, ShieldCheck, Loader2 } from 'lucide-react';

export default function PinOverlay({ 
    mode = 'verify', 
    onSuccess 
}: { 
    mode?: 'set' | 'verify', 
    onSuccess: () => void 
}) {
  const [pin, setPin] = useState(['', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const inputs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newPin = [...pin];
    newPin[index] = value.slice(-1);
    setPin(newPin);

    // Auto-focus next
    if (value && index < 3) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !pin[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async () => {
    const fullPin = pin.join('');
    if (fullPin.length < 4) return;

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/pin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin: fullPin, mode }),
      });
      const data = await res.json();

      if (res.ok) {
        onSuccess();
      } else {
        setError(data.error || 'Incorrect PIN');
        setPin(['', '', '', '']);
        inputs.current[0]?.focus();
      }
    } catch (err) {
      setError('Connection failed');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (pin.every(digit => digit !== '')) {
      handleSubmit();
    }
  }, [pin]);

  return (
    <div className="fixed inset-0 z-[999] bg-white flex flex-col items-center justify-center px-8 animate-in fade-in duration-300">
      <div className="w-full max-w-sm flex flex-col items-center text-center">
        <div className="h-16 w-16 bg-indigo-50 rounded-2xl flex items-center justify-center mb-8 text-indigo-600">
          {mode === 'set' ? <ShieldCheck size={32} /> : <Lock size={32} />}
        </div>
        
        <h2 className="text-2xl font-[1000] tracking-tighter text-slate-900 mb-2">
            {mode === 'set' ? 'Set Security PIN' : 'Enter Security PIN'}
        </h2>
        <p className="text-slate-400 text-sm font-bold uppercase tracking-widest mb-12">
            {mode === 'set' ? 'Create a 4-digit code for payments' : 'Confirm your identity to proceed'}
        </p>

        <div className="flex gap-4 mb-8">
          {pin.map((digit, i) => (
            <input
              key={i}
              ref={(el) => { inputs.current[i] = el; }}
              type="password"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              className="w-16 h-20 bg-slate-50 border-2 border-slate-100 rounded-2xl text-center text-3xl font-black text-slate-900 focus:border-indigo-600 focus:bg-white focus:outline-none transition-all"
              disabled={loading}
            />
          ))}
        </div>

        {error && <p className="text-red-600 text-[10px] font-black uppercase tracking-widest mb-8">{error}</p>}
        
        {loading && <Loader2 className="animate-spin text-indigo-600" size={24} />}
      </div>
    </div>
  );
}

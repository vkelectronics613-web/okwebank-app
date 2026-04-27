'use client';

import { useTheme } from '@/components/ThemeContext';
import { Sun, Moon, ArrowLeft, Shield, User, Bell, ChevronRight } from 'lucide-react';
import Link from 'next/link';

export default function SettingsPage() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-black px-6 pt-12 pb-32 transition-colors duration-300">
      <div className="flex items-center mb-10 gap-4">
        <Link href="/profile" className="p-2 rounded-xl bg-slate-50 dark:bg-zinc-900 text-slate-900 dark:text-white">
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-2xl font-[1000] tracking-tighter text-slate-900 dark:text-white uppercase italic">Preferences</h1>
      </div>

      <div className="space-y-8">
        {/* THEME SECTION */}
        <div className="space-y-4">
            <p className="text-[10px] font-black text-slate-400 dark:text-zinc-600 uppercase tracking-[0.2em] ml-2">Interface</p>
            <div className="bg-slate-50 dark:bg-zinc-900 rounded-[2rem] p-2 flex border-2 border-slate-100 dark:border-zinc-800">
                <button 
                    onClick={() => theme === 'dark' && toggleTheme()}
                    className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-[1.5rem] transition-all font-bold text-xs uppercase tracking-widest ${theme === 'light' ? 'bg-white text-indigo-600 shadow-xl' : 'text-slate-400'}`}
                >
                    <Sun size={16} /> Light
                </button>
                <button 
                    onClick={() => theme === 'light' && toggleTheme()}
                    className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-[1.5rem] transition-all font-bold text-xs uppercase tracking-widest ${theme === 'dark' ? 'bg-zinc-800 text-white shadow-xl' : 'text-zinc-500'}`}
                >
                    <Moon size={16} /> Dark
                </button>
            </div>
        </div>

        {/* OTHER SETTINGS PLACEHOLDERS */}
        <div className="space-y-2">
            <p className="text-[10px] font-black text-slate-400 dark:text-zinc-600 uppercase tracking-[0.2em] ml-2">Account Security</p>
            <SettingItem icon={<Shield className="text-green-500" />} label="Security PIN" value="Active" />
            <SettingItem icon={<Bell className="text-indigo-500" />} label="Notifications" value="On" />
            <SettingItem icon={<User className="text-slate-400" />} label="Privacy Mode" value="Off" />
        </div>
      </div>

      <footer className="mt-auto text-center">
          <p className="text-[9px] font-black text-slate-300 dark:text-zinc-800 uppercase tracking-widest leading-loose">
            OKWEBANK CORE v1.0.4<br/>
            Secured by Distributed Ledger
          </p>
      </footer>
    </div>
  );
}

function SettingItem({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) {
    return (
        <div className="flex items-center justify-between p-6 bg-slate-50 dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 rounded-3xl group cursor-pointer hover:border-indigo-100 dark:hover:border-zinc-700 transition-all">
            <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-2xl bg-white dark:bg-black flex items-center justify-center shadow-sm">
                    {icon}
                </div>
                <span className="font-black text-sm text-slate-900 dark:text-white uppercase tracking-tighter">{label}</span>
            </div>
            <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-slate-400 dark:text-zinc-600 uppercase tracking-widest">{value}</span>
                <ChevronRight size={14} className="text-slate-300 dark:text-zinc-700" />
            </div>
        </div>
    )
}

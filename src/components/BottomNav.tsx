"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Home, Scan, Gift, History, User } from "lucide-react";

export function BottomNav() {
  const pathname = usePathname();

  // Do not show on auth pages or landing page
  if (pathname === "/login" || pathname === "/register" || pathname === "/") {
    return null;
  }

  const navItems = [
    { name: "Home", href: "/", icon: Home },
    { name: "Scan", href: "/scan", icon: Scan },
    { name: "Send", href: "/send", icon: Gift },
    { name: "History", href: "/history", icon: History },
    { name: "Profile", href: "/profile", icon: User },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 border-t border-zinc-800 bg-black/90 backdrop-blur-md pb-safe">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${
                isActive ? "text-white" : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-[10px] font-medium">{item.name}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

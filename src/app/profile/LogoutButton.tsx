"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { useState } from "react";

export default function LogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  };

  return (
    <button
      onClick={handleLogout}
      disabled={loading}
      className="w-full rounded-xl bg-red-500/10 border border-red-500/20 px-4 py-4 text-base font-semibold text-red-500 hover:bg-red-500/20 focus:outline-none transition-colors flex items-center justify-center"
    >
      <LogOut className="mr-2 h-5 w-5" />
      {loading ? "Logging out..." : "Log Out"}
    </button>
  );
}

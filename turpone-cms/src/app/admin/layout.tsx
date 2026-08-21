"use client";

import { useAuth } from "@/components/AuthProvider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/login");
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!user) {
    return null; // Will redirect
  }

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-zinc-950">
      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-zinc-900 border-r dark:border-zinc-800 hidden md:flex flex-col">
        <div className="h-16 flex items-center px-6 border-b dark:border-zinc-800">
          <span className="font-bold text-lg tracking-tight">Turpone Admin</span>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          <a href="/admin" className="block px-3 py-2 rounded-md bg-zinc-100 dark:bg-zinc-800 font-medium text-sm">Dashboard</a>
          <a href="/admin/products" className="block px-3 py-2 rounded-md hover:bg-zinc-50 dark:hover:bg-zinc-800/50 text-zinc-600 dark:text-zinc-400 font-medium text-sm">Products</a>
          <a href="/admin/stores" className="block px-3 py-2 rounded-md hover:bg-zinc-50 dark:hover:bg-zinc-800/50 text-zinc-600 dark:text-zinc-400 font-medium text-sm">Stores</a>
        </nav>
        <div className="p-4 border-t dark:border-zinc-800">
          <div className="text-xs text-zinc-500 mb-2 truncate">{user.email}</div>
          <button 
            onClick={handleLogout}
            className="w-full px-3 py-2 text-sm text-left font-medium text-red-600 rounded-md hover:bg-red-50 dark:hover:bg-red-950/30"
          >
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="h-16 bg-white dark:bg-zinc-900 border-b dark:border-zinc-800 flex items-center px-6 justify-between md:justify-end">
          <div className="md:hidden font-bold">Turpone Admin</div>
          <div className="flex items-center gap-4">
            {/* Header controls could go here */}
          </div>
        </header>
        <div className="flex-1 overflow-auto p-6">
          {children}
        </div>
      </main>
    </div>
  );
}

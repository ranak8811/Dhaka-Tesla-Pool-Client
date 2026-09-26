'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Zap, LogOut, User as UserIcon, Car, Compass, Wallet } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-200 bg-white/95 backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/95">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2.5 font-bold tracking-tight">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-600 text-white shadow-sm">
            <Zap className="h-5 w-5 fill-current" />
          </div>
          <div className="flex flex-col">
            <span className="text-base font-extrabold text-zinc-900 dark:text-white leading-tight">
              Dhaka Tesla Pool
            </span>
            <span className="text-[10px] font-medium uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              Corridor EV Pool
            </span>
          </div>
        </Link>

        <nav className="flex items-center gap-3 sm:gap-6">
          {user ? (
            <>
              {user.role === 'PASSENGER' && (
                <Link
                  href="/passenger"
                  className={`flex items-center gap-1.5 text-sm font-semibold transition-colors ${
                    pathname === '/passenger'
                      ? 'text-emerald-600 dark:text-emerald-400'
                      : 'text-zinc-600 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-white'
                  }`}
                >
                  <Compass className="h-4 w-4" />
                  <span>Book Ride</span>
                </Link>
              )}

              {user.role === 'DRIVER' && (
                <Link
                  href="/driver"
                  className={`flex items-center gap-1.5 text-sm font-semibold transition-colors ${
                    pathname === '/driver'
                      ? 'text-emerald-600 dark:text-emerald-400'
                      : 'text-zinc-600 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-white'
                  }`}
                >
                  <Car className="h-4 w-4" />
                  <span>Driver Console</span>
                </Link>
              )}

              <div
                title="Simulated TeslaPay Wallet Balance"
                className="flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-800 shadow-sm dark:border-emerald-500/20 dark:bg-emerald-950/60 dark:text-emerald-300"
              >
                <Wallet className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>
                  ৳{(user.walletBalanceBdt ?? (user.walletBalancePoysha ? user.walletBalancePoysha / 100 : 500)).toFixed(2)}
                </span>
              </div>

              <div className="flex items-center gap-2 border-l border-zinc-200 pl-3 dark:border-zinc-800 sm:pl-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                  <UserIcon className="h-4 w-4" />
                </div>
                <div className="hidden flex-col sm:flex">
                  <span className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">
                    {user.name}
                  </span>
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider ${
                      user.role === 'DRIVER'
                        ? 'text-amber-600 dark:text-amber-400'
                        : 'text-emerald-600 dark:text-emerald-400'
                    }`}
                  >
                    {user.role}
                  </span>
                </div>

                <button
                  onClick={logout}
                  title="Sign out"
                  className="ml-2 inline-flex h-8 w-8 items-center justify-center rounded-md border border-zinc-200 text-zinc-500 transition-colors hover:border-zinc-300 hover:bg-zinc-100 hover:text-zinc-800 dark:border-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            </>
          ) : (
            <Link
              href="/login"
              className="inline-flex h-9 items-center justify-center rounded-md bg-zinc-900 px-4 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100"
            >
              Sign In
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}

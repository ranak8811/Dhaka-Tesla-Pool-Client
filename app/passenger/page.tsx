'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Compass, MapPin, Zap, ShieldCheck } from 'lucide-react';

export default function PassengerPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  if (isLoading || !user) {
    return (
      <div className="flex flex-1 items-center justify-center p-8">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-600 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-5xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-3xl">
            Passenger Portal
          </h1>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Welcome back, <span className="font-semibold text-emerald-600 dark:text-emerald-400">{user.name}</span> ({user.email})
          </p>
        </div>
        <span className="inline-flex items-center gap-1.5 self-start rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300">
          <ShieldCheck className="h-3.5 w-3.5" /> Authenticated Passenger
        </span>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 md:col-span-2">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400">
              <Compass className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-zinc-900 dark:text-white">
                Book a Corridor Pool
              </h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                STORY-014 Interactive Ride Booking UI Coming Next
              </p>
            </div>
          </div>

          <div className="mt-6 rounded-xl border border-dashed border-zinc-300 bg-zinc-50/50 p-6 text-center dark:border-zinc-700 dark:bg-zinc-800/30">
            <MapPin className="mx-auto h-8 w-8 text-zinc-400" />
            <p className="mt-2 text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Corridor Route Matrix Ready
            </p>
            <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
              Uttara ⇄ Airport ⇄ Banani ⇄ Gulshan 2 ⇄ Gulshan 1 ⇄ Mohakhali ⇄ Kawran Bazar ⇄ Shahbagh ⇄ Motijheel
            </p>
          </div>
        </div>

        <div className="flex flex-col justify-between rounded-2xl border border-zinc-200 bg-gradient-to-br from-zinc-900 to-zinc-950 p-6 text-white shadow-sm dark:border-zinc-800">
          <div>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400">
              <Zap className="h-5 w-5 fill-current" />
            </div>
            <h3 className="mt-4 text-lg font-bold">100% Electric Pool</h3>
            <p className="mt-2 text-xs leading-relaxed text-zinc-300">
              Travel comfortably in Tesla Model Y vehicles while cutting carbon emissions and splitting corridor fare.
            </p>
          </div>

          <div className="mt-6 border-t border-zinc-800 pt-4">
            <span className="text-[11px] font-medium text-zinc-400">
              Active Session: {user.role}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

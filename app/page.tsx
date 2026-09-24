'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { Zap, ArrowRight, Shield, MapPin, Users } from 'lucide-react';

export default function HomePage() {
  const { user } = useAuth();

  return (
    <div className="flex flex-1 flex-col items-center justify-center px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl text-center">
        <div className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-300">
          <Zap className="h-3.5 w-3.5 fill-current" />
          <span>Next-Gen Smart EV Pooling in Dhaka</span>
        </div>

        <h1 className="text-4xl font-black tracking-tight text-zinc-900 sm:text-6xl dark:text-white">
          Dhaka Tesla Pool
        </h1>

        <p className="mt-6 text-base leading-7 text-zinc-600 sm:text-lg dark:text-zinc-400">
          Fixed corridor EV rides across Uttara, Airport, Banani, Gulshan, and Motijheel.
          Greener commutes, predictable pricing, and zero surge anxiety.
        </p>

        <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
          {user ? (
            <Link
              href={user.role === 'DRIVER' ? '/driver' : '/passenger'}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 text-sm font-semibold text-white shadow-lg shadow-emerald-600/20 transition-all hover:bg-emerald-500"
            >
              <span>Go to {user.role === 'DRIVER' ? 'Driver Console' : 'Passenger Portal'}</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          ) : (
            <Link
              href="/login"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 text-sm font-semibold text-white shadow-lg shadow-emerald-600/20 transition-all hover:bg-emerald-500"
            >
              <span>Try Demo Login</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          )}

          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-11 items-center justify-center rounded-xl border border-zinc-300 bg-white px-6 text-sm font-semibold text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
          >
            Documentation
          </a>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-3">
          <div className="rounded-2xl border border-zinc-200 bg-white p-5 text-left shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400">
              <MapPin className="h-5 w-5" />
            </div>
            <h3 className="mt-3 text-sm font-bold text-zinc-900 dark:text-white">
              Corridor Fixed Routing
            </h3>
            <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
              Only pickups along designated expressway and arterial stations.
            </p>
          </div>

          <div className="rounded-2xl border border-zinc-200 bg-white p-5 text-left shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400">
              <Users className="h-5 w-5" />
            </div>
            <h3 className="mt-3 text-sm font-bold text-zinc-900 dark:text-white">
              Up to 3 Pooled Riders
            </h3>
            <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
              Smart seat locking ensures comfortable matching without detours.
            </p>
          </div>

          <div className="rounded-2xl border border-zinc-200 bg-white p-5 text-left shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-400">
              <Shield className="h-5 w-5" />
            </div>
            <h3 className="mt-3 text-sm font-bold text-zinc-900 dark:text-white">
              Deterministic Pricing
            </h3>
            <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
              Integer poysha accounting prevents floating point rounding errors.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

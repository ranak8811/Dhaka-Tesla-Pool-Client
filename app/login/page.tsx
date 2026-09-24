'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Zap, Car, User, AlertCircle, Loader2 } from 'lucide-react';

interface DemoPersona {
  name: string;
  role: 'DRIVER' | 'PASSENGER';
  email: string;
  pass: string;
  detail: string;
  badge: string;
}

const DEMO_PERSONAS: DemoPersona[] = [
  {
    name: 'Jashim Uddin',
    role: 'DRIVER',
    email: 'jashim@dhakatesla.com',
    pass: 'Tesla2026!',
    detail: 'Tesla Model Y • Dhaka Metro-GA 45-8921',
    badge: 'Driver',
  },
  {
    name: 'Nusrat Jahan',
    role: 'PASSENGER',
    email: 'nusrat@dhakatesla.com',
    pass: 'Tesla2026!',
    detail: 'Corridor Rider (Banani ⇄ Motijheel)',
    badge: 'Passenger',
  },
  {
    name: 'Rafiqul Islam',
    role: 'PASSENGER',
    email: 'rafiq@dhakatesla.com',
    pass: 'Tesla2026!',
    detail: 'Tech Commuter (Uttara ⇄ Gulshan 2)',
    badge: 'Passenger',
  },
  {
    name: 'Shirin Akter',
    role: 'PASSENGER',
    email: 'shirin@dhakatesla.com',
    pass: 'Tesla2026!',
    detail: 'Corporate Exec (Gulshan 1 ⇄ Motijheel)',
    badge: 'Passenger',
  },
];

export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [activePersonaEmail, setActivePersonaEmail] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please provide both email and password.');
      return;
    }

    try {
      setError(null);
      setLoading(true);
      await login(email, password);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Login failed. Please verify your credentials.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = async (persona: DemoPersona) => {
    setEmail(persona.email);
    setPassword(persona.pass);
    setActivePersonaEmail(persona.email);
    setError(null);
    setLoading(true);

    try {
      await login(persona.email, persona.pass);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Quick login failed. Is the backend server running?';
      setError(msg);
    } finally {
      setLoading(false);
      setActivePersonaEmail(null);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-lg shadow-emerald-600/20">
            <Zap className="h-8 w-8 fill-current" />
          </div>
          <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
            Dhaka Tesla Pool
          </h2>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            Sign in to start carpooling or select a demo persona below
          </p>
        </div>

        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 sm:p-8">
          {error && (
            <div className="mb-6 flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-xs font-medium text-red-700 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-300">
              <AlertCircle className="h-5 w-5 shrink-0 text-red-500" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-xs font-semibold uppercase tracking-wider text-zinc-700 dark:text-zinc-300"
              >
                Email Address
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@dhakatesla.com"
                className="mt-1.5 block w-full rounded-lg border border-zinc-300 bg-zinc-50/50 px-3.5 py-2.5 text-sm text-zinc-900 shadow-sm transition-colors placeholder:text-zinc-400 focus:border-emerald-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600/20 dark:border-zinc-700 dark:bg-zinc-800/50 dark:text-white dark:placeholder:text-zinc-500 dark:focus:border-emerald-500 dark:focus:bg-zinc-900"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-xs font-semibold uppercase tracking-wider text-zinc-700 dark:text-zinc-300"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="mt-1.5 block w-full rounded-lg border border-zinc-300 bg-zinc-50/50 px-3.5 py-2.5 text-sm text-zinc-900 shadow-sm transition-colors placeholder:text-zinc-400 focus:border-emerald-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600/20 dark:border-zinc-700 dark:bg-zinc-800/50 dark:text-white dark:placeholder:text-zinc-500 dark:focus:border-emerald-500 dark:focus:bg-zinc-900"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 flex w-full items-center justify-center rounded-lg bg-zinc-900 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100"
            >
              {loading && !activePersonaEmail ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              Sign In with Credentials
            </button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-zinc-200 dark:border-zinc-800" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-3 font-semibold tracking-wider text-zinc-500 dark:bg-zinc-900 dark:text-zinc-400">
                1-Click Quick Demo Login
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-2.5">
            {DEMO_PERSONAS.map((persona) => {
              const isSelected = activePersonaEmail === persona.email;
              const isDriver = persona.role === 'DRIVER';

              return (
                <button
                  key={persona.email}
                  type="button"
                  disabled={loading}
                  onClick={() => handleQuickLogin(persona)}
                  className={`group relative flex items-center justify-between rounded-xl border p-3 text-left transition-all hover:scale-[1.01] ${
                    isDriver
                      ? 'border-amber-200 bg-amber-50/50 hover:border-amber-300 dark:border-amber-900/40 dark:bg-amber-950/20 dark:hover:border-amber-800'
                      : 'border-zinc-200 bg-zinc-50/60 hover:border-emerald-300 hover:bg-emerald-50/40 dark:border-zinc-800 dark:bg-zinc-800/40 dark:hover:border-emerald-800 dark:hover:bg-emerald-950/20'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                        isDriver
                          ? 'bg-amber-500 text-white'
                          : 'bg-emerald-600 text-white'
                      }`}
                    >
                      {isDriver ? (
                        <Car className="h-5 w-5" />
                      ) : (
                        <User className="h-5 w-5" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-zinc-900 dark:text-white">
                          {persona.name}
                        </span>
                        <span
                          className={`rounded px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                            isDriver
                              ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-300'
                              : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300'
                          }`}
                        >
                          {persona.badge}
                        </span>
                      </div>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400">
                        {persona.detail}
                      </p>
                    </div>
                  </div>

                  {isSelected && loading && (
                    <Loader2 className="h-4 w-4 animate-spin text-emerald-600" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

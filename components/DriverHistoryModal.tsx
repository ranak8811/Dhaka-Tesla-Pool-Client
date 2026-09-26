'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { apiClient } from '@/lib/api-client';
import {
  X,
  History,
  MapPin,
  Calendar,
  Users,
  DollarSign,
  Loader2,
  RefreshCw,
  Car,
  CheckCircle2,
} from 'lucide-react';

export interface DriverHistoryPassenger {
  rideId: string;
  name: string;
  pickup: string;
  drop: string;
  seats: number;
  status: string;
  fareBdt: number;
}

export interface DriverHistoryPool {
  poolId: string;
  pickupZone: string;
  corridor: string;
  status: string;
  occupiedSeats: number;
  createdAt: string;
  totalEarningsBdt: number;
  passengers: DriverHistoryPassenger[];
}

interface DriverHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function DriverHistoryModal({
  isOpen,
  onClose,
}: DriverHistoryModalProps) {
  const [pools, setPools] = useState<DriverHistoryPool[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fetchHistory = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const data = await apiClient<DriverHistoryPool[]>('/driver/history');
      setPools(Array.isArray(data) ? data : []);
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : 'Failed to fetch driver history.';
      setErrorMessage(msg);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      fetchHistory();
    }
  }, [isOpen, fetchHistory]);

  if (!isOpen) return null;

  const totalRevenue = pools.reduce(
    (sum, pool) => sum + (pool.totalEarningsBdt || 0),
    0,
  );
  const totalRidesServed = pools.reduce(
    (sum, pool) => sum + pool.passengers.length,
    0,
  );

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="flex max-h-[88vh] w-full max-w-3xl flex-col rounded-3xl border border-zinc-200 bg-white shadow-2xl dark:border-zinc-800 dark:bg-zinc-900">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-zinc-100 px-6 py-5 dark:border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400">
              <History className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-zinc-900 dark:text-white">
                Completed Trips Archive
              </h2>
              <p className="text-xs text-zinc-500">
                Log of completed carpool batches, passenger manifests, and earnings
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={fetchHistory}
              disabled={isLoading}
              title="Refresh History"
              className="rounded-xl border border-zinc-200 p-2 text-zinc-600 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-800"
            >
              <RefreshCw
                className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`}
              />
            </button>
            <button
              onClick={onClose}
              className="rounded-xl border border-zinc-200 p-2 text-zinc-600 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-800"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          {/* Summary KPIs */}
          <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-800/50">
              <span className="text-xs font-semibold text-zinc-500">
                Completed Trips
              </span>
              <p className="mt-1 text-2xl font-black text-zinc-900 dark:text-white">
                {pools.length}
              </p>
            </div>
            <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-800/50">
              <span className="text-xs font-semibold text-zinc-500">
                Total Passengers
              </span>
              <p className="mt-1 text-2xl font-black text-zinc-900 dark:text-white">
                {totalRidesServed}
              </p>
            </div>
            <div className="col-span-2 sm:col-span-1 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-900/50 dark:bg-emerald-950/30">
              <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                Total Revenue
              </span>
              <p className="mt-1 text-2xl font-black text-emerald-800 dark:text-emerald-300">
                ৳{totalRevenue.toFixed(2)}
              </p>
            </div>
          </div>

          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-16 text-zinc-400">
              <Loader2 className="h-8 w-8 animate-spin text-amber-600" />
              <p className="mt-3 text-xs font-medium">Loading completed trips...</p>
            </div>
          ) : errorMessage ? (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-xs font-medium text-red-700 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-300">
              {errorMessage}
            </div>
          ) : pools.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center text-zinc-400">
              <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-zinc-100 dark:bg-zinc-800 text-zinc-400">
                <Car className="h-8 w-8" />
              </div>
              <p className="mt-4 text-sm font-bold text-zinc-700 dark:text-zinc-300">
                No Completed Pools Yet
              </p>
              <p className="mt-1 text-xs text-zinc-500 max-w-sm">
                When you complete passenger trips from Banani along the corridor, historical records and fare collections will appear here.
              </p>
            </div>
          ) : (
            <div className="space-y-5">
              {pools.map((pool) => (
                <div
                  key={pool.poolId}
                  className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/80"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-100 pb-3 dark:border-zinc-800">
                    <div className="flex items-center gap-2.5">
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                        <CheckCircle2 className="h-3 w-3" /> COMPLETED
                      </span>
                      <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                        {pool.corridor} Corridor ({pool.pickupZone})
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-zinc-400">
                        {formatDate(pool.createdAt)}
                      </span>
                      <span className="text-base font-black text-emerald-600 dark:text-emerald-400">
                        ৳{pool.totalEarningsBdt.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {/* Passenger Manifest for this Pool */}
                  <div className="mt-4">
                    <div className="mb-2 flex items-center justify-between text-xs font-bold uppercase tracking-wider text-zinc-500">
                      <span>Manifest ({pool.passengers.length} Passengers)</span>
                      <span>{pool.occupiedSeats}/3 Seats Used</span>
                    </div>
                    <div className="divide-y divide-zinc-100 rounded-xl border border-zinc-100 bg-zinc-50 dark:divide-zinc-800 dark:border-zinc-800 dark:bg-zinc-800/40">
                      {pool.passengers.map((p) => (
                        <div
                          key={p.rideId}
                          className="flex items-center justify-between p-3 text-xs"
                        >
                          <div>
                            <span className="font-bold text-zinc-900 dark:text-white">
                              {p.name}
                            </span>
                            <div className="mt-0.5 flex items-center gap-1 text-[11px] text-zinc-500">
                              <MapPin className="h-3 w-3 text-emerald-600" />
                              <span>{p.pickup}</span>
                              <span>→</span>
                              <span>{p.drop}</span>
                              <span className="ml-1 text-zinc-400">
                                ({p.seats} {p.seats === 1 ? 'seat' : 'seats'})
                              </span>
                            </div>
                          </div>
                          <div className="text-right font-black text-zinc-900 dark:text-zinc-100">
                            ৳{p.fareBdt.toFixed(2)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="border-t border-zinc-100 px-6 py-4 dark:border-zinc-800 flex justify-end">
          <button
            onClick={onClose}
            className="rounded-xl bg-zinc-100 px-5 py-2 text-xs font-bold text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

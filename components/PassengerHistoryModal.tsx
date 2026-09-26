'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { apiClient } from '@/lib/api-client';
import {
  X,
  History,
  MapPin,
  Calendar,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowRight,
  Car,
  Loader2,
  ChevronDown,
  ChevronUp,
  RefreshCw,
} from 'lucide-react';

export interface RideHistoryItem {
  id: string;
  pickupZone: string;
  destinationZone: string;
  seatsRequested: number;
  status: 'COMPLETED' | 'CANCELLED' | string;
  totalFarePoysha: number;
  fareBdt: number;
  paymentStatus: string;
  createdAt: string;
  updatedAt: string;
  driver?: {
    name: string;
    vehicleName: string;
  } | null;
  statusLogs?: {
    previousStatus: string | null;
    newStatus: string;
    timestamp: string;
  }[];
}

interface PassengerHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PassengerHistoryModal({
  isOpen,
  onClose,
}: PassengerHistoryModalProps) {
  const [history, setHistory] = useState<RideHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [expandedRideId, setExpandedRideId] = useState<string | null>(null);

  const fetchHistory = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const data = await apiClient<RideHistoryItem[]>('/rides/history');
      setHistory(Array.isArray(data) ? data : []);
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : 'Failed to fetch ride history.';
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

  const toggleExpand = (id: string) => {
    setExpandedRideId((prev) => (prev === id ? null : id));
  };

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
      <div className="flex max-h-[88vh] w-full max-w-2xl flex-col rounded-3xl border border-zinc-200 bg-white shadow-2xl dark:border-zinc-800 dark:bg-zinc-900">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-zinc-100 px-6 py-5 dark:border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400">
              <History className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-zinc-900 dark:text-white">
                Ride History & Past Trips
              </h2>
              <p className="text-xs text-zinc-500">
                Audit log of all your completed and cancelled corridor journeys
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
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-16 text-zinc-400">
              <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
              <p className="mt-3 text-xs font-medium">Loading past trips...</p>
            </div>
          ) : errorMessage ? (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-xs font-medium text-red-700 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-300">
              {errorMessage}
            </div>
          ) : history.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center text-zinc-400">
              <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-zinc-100 dark:bg-zinc-800 text-zinc-400">
                <History className="h-8 w-8" />
              </div>
              <p className="mt-4 text-sm font-bold text-zinc-700 dark:text-zinc-300">
                No Past Trips Found
              </p>
              <p className="mt-1 text-xs text-zinc-500 max-w-sm">
                You haven&apos;t completed or cancelled any EV rides yet. Once you take a trip with Bullet, your receipts and logs will be saved here.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {history.map((ride) => {
                const isCompleted = ride.status === 'COMPLETED';
                const isCancelled = ride.status === 'CANCELLED';
                const isExpanded = expandedRideId === ride.id;

                return (
                  <div
                    key={ride.id}
                    className="overflow-hidden rounded-2xl border border-zinc-200 bg-white transition-all hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-900/80 dark:hover:border-zinc-700"
                  >
                    <div className="p-4 sm:p-5">
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-100 pb-3 dark:border-zinc-800/80">
                        <div className="flex items-center gap-2">
                          <span
                            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-bold ${
                              isCompleted
                                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300'
                                : isCancelled
                                ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/80 dark:text-rose-300'
                                : 'bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-300'
                            }`}
                          >
                            {isCompleted ? (
                              <CheckCircle2 className="h-3 w-3" />
                            ) : isCancelled ? (
                              <XCircle className="h-3 w-3" />
                            ) : (
                              <Clock className="h-3 w-3" />
                            )}
                            {ride.status}
                          </span>
                          <span className="text-xs text-zinc-400">
                            {formatDate(ride.createdAt)}
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="text-base font-black text-zinc-900 dark:text-white">
                            ৳{ride.fareBdt.toFixed(2)}
                          </span>
                          <span className="ml-1.5 text-[10px] uppercase font-bold tracking-wider text-emerald-600 dark:text-emerald-400">
                            {ride.paymentStatus}
                          </span>
                        </div>
                      </div>

                      <div className="mt-3.5 flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm font-bold text-zinc-900 dark:text-zinc-100">
                          <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                            <MapPin className="h-4 w-4" />
                            {ride.pickupZone}
                          </span>
                          <ArrowRight className="h-3.5 w-3.5 text-zinc-400" />
                          <span className="text-blue-600 dark:text-blue-400">
                            {ride.destinationZone}
                          </span>
                        </div>
                        <span className="rounded-lg bg-zinc-100 px-2 py-0.5 text-xs font-semibold text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
                          {ride.seatsRequested} {ride.seatsRequested === 1 ? 'Seat' : 'Seats'}
                        </span>
                      </div>

                      {ride.driver && (
                        <div className="mt-2.5 flex items-center gap-2 text-xs text-zinc-500">
                          <Car className="h-3.5 w-3.5 text-amber-500" />
                          <span>
                            {ride.driver.vehicleName} • Capt. {ride.driver.name}
                          </span>
                        </div>
                      )}

                      {ride.statusLogs && ride.statusLogs.length > 0 && (
                        <div className="mt-3 border-t border-zinc-100 pt-3 dark:border-zinc-800">
                          <button
                            type="button"
                            onClick={() => toggleExpand(ride.id)}
                            className="flex items-center gap-1 text-xs font-semibold text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors"
                          >
                            <span>
                              {isExpanded ? 'Hide' : 'View'} Status Audit Trail ({ride.statusLogs.length})
                            </span>
                            {isExpanded ? (
                              <ChevronUp className="h-3 w-3" />
                            ) : (
                              <ChevronDown className="h-3 w-3" />
                            )}
                          </button>

                          {isExpanded && (
                            <div className="mt-2 space-y-1.5 rounded-xl bg-zinc-50 p-3 text-xs dark:bg-zinc-800/50">
                              {ride.statusLogs.map((log, idx) => (
                                <div
                                  key={idx}
                                  className="flex items-center justify-between text-[11px] text-zinc-600 dark:text-zinc-400"
                                >
                                  <div className="flex items-center gap-1.5">
                                    <span className="font-mono text-zinc-400">
                                      {idx + 1}.
                                    </span>
                                    <span>
                                      {log.previousStatus
                                        ? `${log.previousStatus} → `
                                        : 'INIT → '}
                                      <strong className="text-zinc-900 dark:text-zinc-100">
                                        {log.newStatus}
                                      </strong>
                                    </span>
                                  </div>
                                  <span className="font-mono text-[10px] text-zinc-400">
                                    {formatDate(log.timestamp)}
                                  </span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
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

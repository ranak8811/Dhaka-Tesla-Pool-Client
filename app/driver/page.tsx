'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { apiClient } from '@/lib/api-client';
import BulletCapacityBadge from '@/components/BulletCapacityBadge';
import PassengerManifestTable, {
  ManifestPassenger,
} from '@/components/PassengerManifestTable';
import TripActionButtons from '@/components/TripActionButtons';
import DriverHistoryModal from '@/components/DriverHistoryModal';
import {
  Car,
  Power,
  DollarSign,
  AlertCircle,
  Loader2,
  Sparkles,
  History,
} from 'lucide-react';

interface ActivePoolData {
  poolId: string;
  vehicleName: string;
  occupiedSeats: number;
  maxCapacity: number;
  status: string;
  passengers: ManifestPassenger[];
}

interface ProfileResponse {
  id: string;
  name: string;
  email: string;
  role: string;
  vehicle?: {
    id: string;
    name: string;
    model: string;
    licensePlate: string;
    isOnline: boolean;
    currentZone: string;
  };
}

export default function DriverPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [activePool, setActivePool] = useState<ActivePoolData | null>(null);
  const [isTogglingStatus, setIsTogglingStatus] = useState<boolean>(false);
  const [isUpdatingTrip, setIsUpdatingTrip] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isHistoryOpen, setIsHistoryOpen] = useState<boolean>(false);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    let ignore = false;
    async function loadDriverProfile() {
      if (!user) return;
      try {
        const profile = await apiClient<ProfileResponse>('/auth/profile');
        if (!ignore && profile.vehicle) {
          setIsOnline(profile.vehicle.isOnline);
        }
      } catch {
        // Fallback default isOnline true
      }
    }
    loadDriverProfile();
    return () => {
      ignore = true;
    };
  }, [user]);

  const refreshActivePool = useCallback(async () => {
    if (!user) return;
    try {
      const pool = await apiClient<ActivePoolData | null>(
        '/driver/active-pool',
      );
      if (pool && pool.poolId) {
        setActivePool(pool);
      } else {
        setActivePool(null);
      }
    } catch {
      setActivePool(null);
    }
  }, [user]);

  useEffect(() => {
    let ignore = false;
    async function fetchInitialPool() {
      if (!user) return;
      try {
        const pool = await apiClient<ActivePoolData | null>(
          '/driver/active-pool',
        );
        if (!ignore) {
          if (pool && pool.poolId) {
            setActivePool(pool);
          } else {
            setActivePool(null);
          }
        }
      } catch {
        if (!ignore) {
          setActivePool(null);
        }
      }
    }

    fetchInitialPool();
    return () => {
      ignore = true;
    };
  }, [user]);

  useEffect(() => {
    const interval = setInterval(() => {
      refreshActivePool();
    }, 3000);

    return () => clearInterval(interval);
  }, [refreshActivePool]);

  const handleToggleOnline = async () => {
    setIsTogglingStatus(true);
    setErrorMessage(null);

    try {
      const result = await apiClient<{ isOnline: boolean }>(
        '/driver/toggle-status',
        {
          method: 'POST',
          body: JSON.stringify({ isOnline: !isOnline }),
        },
      );
      setIsOnline(result.isOnline);
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : 'Failed to update online status.';
      setErrorMessage(msg);
    } finally {
      setIsTogglingStatus(false);
    }
  };

  const handleUpdateStatus = async (nextStatus: string) => {
    if (!activePool) return;

    setIsUpdatingTrip(true);
    setErrorMessage(null);

    try {
      await apiClient(`/driver/pools/${activePool.poolId}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status: nextStatus }),
      });
      await refreshActivePool();
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : 'Failed to update trip status.';
      setErrorMessage(msg);
    } finally {
      setIsUpdatingTrip(false);
    }
  };

  const totalEarningsBdt = (activePool?.passengers || []).reduce(
    (acc, p) => acc + (p.fareBdt || 0),
    0,
  );

  const tripStatus =
    activePool?.passengers?.[0]?.status || (activePool ? 'MATCHED' : null);

  if (isLoading || !user) {
    return (
      <div className="flex flex-1 items-center justify-center p-8">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-amber-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-5xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black tracking-tight text-zinc-900 dark:text-white sm:text-3xl">
              Driver Console
            </h1>
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-bold text-amber-800 dark:bg-amber-950 dark:text-amber-300">
              <Sparkles className="h-3.5 w-3.5" /> Captain
            </span>
          </div>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            Welcome, <span className="font-bold text-amber-600 dark:text-amber-400">{user.name}</span>. Manage Bullet capacity and trip progression.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setIsHistoryOpen(true)}
            className="flex items-center gap-2 rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-xs font-bold text-zinc-700 shadow-sm transition hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700"
          >
            <History className="h-4 w-4 text-amber-600 dark:text-amber-400" />
            <span>Trip Archive</span>
          </button>

          <button
            onClick={handleToggleOnline}
            disabled={isTogglingStatus}
            className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold shadow-sm transition-all ${
              isOnline
                ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                : 'border border-zinc-300 bg-zinc-200 text-zinc-700 hover:bg-zinc-300 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300'
            }`}
          >
            {isTogglingStatus ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Power className="h-4 w-4" />
            )}
            <span>{isOnline ? 'ONLINE & ACCEPTING' : 'OFFLINE'}</span>
          </button>
        </div>
      </div>

      {errorMessage && (
        <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-xs font-medium text-red-700 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-300">
          <AlertCircle className="h-5 w-5 shrink-0 text-red-500" />
          <span>{errorMessage}</span>
        </div>
      )}

      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="md:col-span-2">
            <BulletCapacityBadge
              occupied={activePool?.occupiedSeats || 0}
              max={3}
            />
          </div>

          <div className="flex flex-col justify-between rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                  Trip Fare Total
                </span>
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400">
                  <DollarSign className="h-4 w-4" />
                </div>
              </div>
              <p className="mt-3 text-3xl font-black text-zinc-900 dark:text-white">
                ৳{totalEarningsBdt.toFixed(2)}
              </p>
              <p className="mt-1 text-xs text-zinc-500">
                Poysha-accurate shared fare collected
              </p>
            </div>

            <div className="mt-4 border-t border-zinc-100 pt-3 dark:border-zinc-800">
              <div className="flex items-center gap-2 text-xs text-zinc-600 dark:text-zinc-400">
                <Car className="h-4 w-4 text-amber-500 shrink-0" />
                <span>Dhaka Metro-GA 45-8921</span>
              </div>
            </div>
          </div>
        </div>

        {activePool && (
          <TripActionButtons
            status={tripStatus}
            onUpdateStatus={handleUpdateStatus}
            isUpdating={isUpdatingTrip}
          />
        )}

        <PassengerManifestTable
          passengers={activePool?.passengers || []}
        />
      </div>

      <DriverHistoryModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
      />
    </div>
  );
}

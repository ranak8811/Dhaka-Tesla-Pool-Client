'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { apiClient } from '@/lib/api-client';
import FareEstimateCard, { FareQuote } from '@/components/FareEstimateCard';
import RideStatusTracker, { ActiveRide } from '@/components/RideStatusTracker';
import {
  MapPin,
  Users,
  Compass,
  AlertCircle,
  Sparkles,
} from 'lucide-react';

interface Zone {
  id: string;
  name: string;
  corridor: string;
  isHub: boolean;
}

interface BookingResponse {
  ride?: ActiveRide;
  id?: string;
  pickupZone?: string;
  destinationZone?: string;
  status?: string;
  seatsRequested?: number;
  farePoysha?: number;
}

const DEFAULT_ZONES: Zone[] = [
  { id: 'banani', name: 'Banani', corridor: 'SouthEast', isHub: true },
  { id: 'mohakhali', name: 'Mohakhali', corridor: 'SouthEast', isHub: false },
  { id: 'gulshan1', name: 'Gulshan 1', corridor: 'SouthEast', isHub: false },
  { id: 'gulshan2', name: 'Gulshan 2', corridor: 'SouthEast', isHub: false },
  { id: 'dhanmondi', name: 'Dhanmondi', corridor: 'SouthWest', isHub: false },
  { id: 'farmgate', name: 'Farmgate', corridor: 'Central', isHub: false },
  { id: 'mirpur10', name: 'Mirpur 10', corridor: 'West', isHub: false },
  { id: 'uttara', name: 'Uttara', corridor: 'North', isHub: false },
];

export default function PassengerPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  const [zones, setZones] = useState<Zone[]>(DEFAULT_ZONES);
  const [pickupZone, setPickupZone] = useState<string>('banani');
  const [destinationZone, setDestinationZone] = useState<string>('mohakhali');
  const [seatsRequested, setSeatsRequested] = useState<number>(1);

  const [quote, setQuote] = useState<FareQuote | null>(null);
  const [isQuoteLoading, setIsQuoteLoading] = useState<boolean>(false);

  const [activeRide, setActiveRide] = useState<ActiveRide | null>(null);
  const [isCheckingRide, setIsCheckingRide] = useState<boolean>(true);
  const [isBooking, setIsBooking] = useState<boolean>(false);
  const [isCancelling, setIsCancelling] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    let ignore = false;
    async function loadZones() {
      try {
        const data = await apiClient<Zone[]>('/zones');
        if (!ignore && Array.isArray(data) && data.length > 0) {
          setZones(data);
        }
      } catch {
        // Fallback to DEFAULT_ZONES
      }
    }
    loadZones();
    return () => {
      ignore = true;
    };
  }, []);

  const refreshActiveRide = useCallback(async () => {
    if (!user) return;
    try {
      const ride = await apiClient<ActiveRide | null>('/rides/active');
      if (ride && ride.id) {
        setActiveRide(ride);
      } else {
        setActiveRide(null);
      }
    } catch {
      setActiveRide(null);
    }
  }, [user]);

  useEffect(() => {
    let ignore = false;
    async function fetchInitialRide() {
      if (!user) {
        setIsCheckingRide(false);
        return;
      }
      try {
        const ride = await apiClient<ActiveRide | null>('/rides/active');
        if (!ignore) {
          if (ride && ride.id) {
            setActiveRide(ride);
          } else {
            setActiveRide(null);
          }
        }
      } catch {
        if (!ignore) {
          setActiveRide(null);
        }
      } finally {
        if (!ignore) {
          setIsCheckingRide(false);
        }
      }
    }

    fetchInitialRide();
    return () => {
      ignore = true;
    };
  }, [user]);

  useEffect(() => {
    if (!activeRide) return;
    if (activeRide.status === 'COMPLETED' || activeRide.status === 'CANCELLED') {
      return;
    }

    const interval = setInterval(() => {
      refreshActiveRide();
    }, 3000);

    return () => clearInterval(interval);
  }, [activeRide, refreshActiveRide]);

  useEffect(() => {
    if (!pickupZone || !destinationZone || pickupZone === destinationZone) {
      return;
    }

    let ignore = false;
    async function fetchQuote() {
      setIsQuoteLoading(true);
      try {
        const data = await apiClient<FareQuote>('/rides/quote', {
          method: 'POST',
          body: JSON.stringify({
            pickupZone,
            destinationZone,
          }),
        });
        if (!ignore) {
          setQuote(data);
          setErrorMessage(null);
        }
      } catch (err: unknown) {
        if (!ignore) {
          const msg =
            err instanceof Error ? err.message : 'Failed to calculate quote.';
          setErrorMessage(msg);
          setQuote(null);
        }
      } finally {
        if (!ignore) {
          setIsQuoteLoading(false);
        }
      }
    }

    fetchQuote();

    return () => {
      ignore = true;
    };
  }, [pickupZone, destinationZone]);

  const handlePickupChange = (value: string) => {
    setPickupZone(value);
    if (value === destinationZone) {
      setQuote(null);
      setErrorMessage('Pickup and destination zones must be different.');
    } else {
      setErrorMessage(null);
    }
  };

  const handleDestinationChange = (value: string) => {
    setDestinationZone(value);
    if (value === pickupZone) {
      setQuote(null);
      setErrorMessage('Pickup and destination zones must be different.');
    } else {
      setErrorMessage(null);
    }
  };

  const handleBookRide = async () => {
    if (!pickupZone || !destinationZone) return;

    setIsBooking(true);
    setErrorMessage(null);

    try {
      const response = await apiClient<BookingResponse>('/rides/request', {
        method: 'POST',
        body: JSON.stringify({
          pickupZone,
          destinationZone,
          seatsRequested,
        }),
      });

      const rideData = (response.ride || response) as ActiveRide;
      if (rideData && rideData.id) {
        setActiveRide(rideData);
      }
      await refreshActiveRide();
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : 'Booking request failed.';
      setErrorMessage(msg);
    } finally {
      setIsBooking(false);
    }
  };

  const handleCancelRide = async () => {
    if (!activeRide) return;

    setIsCancelling(true);
    setErrorMessage(null);

    try {
      await apiClient(`/rides/${activeRide.id}/cancel`, {
        method: 'POST',
      });
      setActiveRide(null);
      setQuote(null);
      setPickupZone('banani');
      setDestinationZone('mohakhali');
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : 'Failed to cancel the ride.';
      setErrorMessage(msg);
    } finally {
      setIsCancelling(false);
    }
  };

  const handleNewBooking = () => {
    setActiveRide(null);
    setQuote(null);
  };

  if (isLoading || !user || isCheckingRide) {
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
          <h1 className="text-2xl font-black tracking-tight text-zinc-900 dark:text-white sm:text-3xl">
            Passenger Corridor Portal
          </h1>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Welcome, <span className="font-bold text-emerald-600 dark:text-emerald-400">{user.name}</span>. Book a clean EV seat in Bullet.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
            <Sparkles className="h-3.5 w-3.5" /> 100% Electric Carpool
          </span>
        </div>
      </div>

      {errorMessage && (
        <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-xs font-medium text-red-700 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-300">
          <AlertCircle className="h-5 w-5 shrink-0 text-red-500" />
          <span>{errorMessage}</span>
        </div>
      )}

      {activeRide ? (
        <div className="mx-auto max-w-2xl">
          <RideStatusTracker
            ride={activeRide}
            onCancel={handleCancelRide}
            isCancelling={isCancelling}
            onNewBooking={handleNewBooking}
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <div className="flex items-center gap-2.5 border-b border-zinc-100 pb-4 dark:border-zinc-800">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400">
                <Compass className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-zinc-900 dark:text-white">
                  Route Selection
                </h2>
                <p className="text-xs text-zinc-500">
                  Select pickup and destination along the corridor
                </p>
              </div>
            </div>

            <div className="mt-5 space-y-4">
              <div>
                <label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-400">
                  <MapPin className="h-3.5 w-3.5 text-emerald-600" />
                  <span>Pickup Station</span>
                </label>
                <select
                  value={pickupZone}
                  onChange={(e) => handlePickupChange(e.target.value)}
                  className="mt-1.5 block w-full rounded-xl border border-zinc-300 bg-zinc-50/50 px-3.5 py-2.5 text-sm font-semibold text-zinc-900 transition-colors focus:border-emerald-600 focus:bg-white focus:outline-none dark:border-zinc-700 dark:bg-zinc-800/50 dark:text-white"
                >
                  {zones.map((z) => (
                    <option key={`pickup-${z.id}`} value={z.id}>
                      {z.name} {z.isHub ? '★ Hub' : ''} ({z.corridor})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-400">
                  <MapPin className="h-3.5 w-3.5 text-blue-600" />
                  <span>Destination Station</span>
                </label>
                <select
                  value={destinationZone}
                  onChange={(e) => handleDestinationChange(e.target.value)}
                  className="mt-1.5 block w-full rounded-xl border border-zinc-300 bg-zinc-50/50 px-3.5 py-2.5 text-sm font-semibold text-zinc-900 transition-colors focus:border-emerald-600 focus:bg-white focus:outline-none dark:border-zinc-700 dark:bg-zinc-800/50 dark:text-white"
                >
                  {zones.map((z) => (
                    <option key={`dest-${z.id}`} value={z.id}>
                      {z.name} {z.isHub ? '★ Hub' : ''} ({z.corridor})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-400">
                  <Users className="h-3.5 w-3.5 text-purple-600" />
                  <span>Number of Seats</span>
                </label>
                <div className="mt-1.5 grid grid-cols-3 gap-2">
                  {[1, 2, 3].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setSeatsRequested(num)}
                      className={`rounded-xl border py-2.5 text-center text-xs font-bold transition-all ${
                        seatsRequested === num
                          ? 'border-emerald-600 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                          : 'border-zinc-200 bg-zinc-50/50 text-zinc-700 hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-800/40 dark:text-zinc-300'
                      }`}
                    >
                      {num} {num === 1 ? 'Seat' : 'Seats'}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div>
            <FareEstimateCard
              quote={quote}
              loading={isQuoteLoading}
              onBook={handleBookRide}
              isBooking={isBooking}
            />
          </div>
        </div>
      )}
    </div>
  );
}

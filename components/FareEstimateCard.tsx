import React from 'react';
import {
  Zap,
  ShieldCheck,
  TrendingDown,
  Loader2,
  Wallet,
  Banknote,
  AlertCircle,
  PlusCircle,
} from 'lucide-react';

export interface FareQuote {
  distanceKm: number;
  pickupZone?: string;
  destinationZone?: string;
  baseFarePoysha: number;
  distanceChargePoysha: number;
  solo: {
    totalFarePoysha: number;
    totalFareBdt: number;
  };
  pooled: {
    poolDiscountPoysha: number;
    totalFarePoysha: number;
    totalFareBdt: number;
    savingsBdt: number;
  };
}

interface FareEstimateCardProps {
  quote: FareQuote | null;
  loading: boolean;
  onBook: () => void;
  isBooking: boolean;
  seatsRequested?: number;
  paymentMethod?: 'TESLAPAY' | 'CASH';
  onPaymentMethodChange?: (method: 'TESLAPAY' | 'CASH') => void;
  walletBalanceBdt?: number;
  onTopup?: () => Promise<void>;
  isToppingUp?: boolean;
}

export default function FareEstimateCard({
  quote,
  loading,
  onBook,
  isBooking,
  seatsRequested = 1,
  paymentMethod = 'TESLAPAY',
  onPaymentMethodChange,
  walletBalanceBdt = 500,
  onTopup,
  isToppingUp = false,
}: FareEstimateCardProps) {
  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex flex-col items-center gap-2 text-zinc-500">
          <Loader2 className="h-6 w-6 animate-spin text-emerald-600" />
          <span className="text-xs font-medium">Calculating corridor fare...</span>
        </div>
      </div>
    );
  }

  if (!quote) {
    return (
      <div className="flex h-64 flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-300 bg-zinc-50/50 p-6 text-center dark:border-zinc-800 dark:bg-zinc-900/50">
        <Zap className="h-8 w-8 text-zinc-400" />
        <p className="mt-2 text-sm font-semibold text-zinc-700 dark:text-zinc-300">
          Select Pickup & Destination
        </p>
        <p className="mt-1 text-xs text-zinc-500">
          Choose two zones along the corridor to view instant Solo vs Pooled pricing.
        </p>
      </div>
    );
  }

  const seats = Math.max(1, seatsRequested);
  const pooledSingleBdt = quote.pooled.totalFareBdt;
  const pooledTotalBdt = pooledSingleBdt * seats;
  const soloSingleBdt = quote.solo.totalFareBdt;
  const soloTotalBdt = soloSingleBdt * seats;
  const savingsTotalBdt = quote.pooled.savingsBdt * seats;

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <div className="flex items-center justify-between border-b border-zinc-100 pb-4 dark:border-zinc-800">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
            Estimated Distance
          </span>
          <p className="text-xl font-black text-zinc-900 dark:text-white">
            {quote.distanceKm} km
          </p>
        </div>
        <div className="flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
          <TrendingDown className="h-4 w-4" />
          <span>Save 25% by Pooling</span>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="rounded-xl border border-zinc-200 bg-zinc-50/60 p-4 dark:border-zinc-800 dark:bg-zinc-800/40">
          <span className="text-xs font-semibold text-zinc-500">Solo Ride</span>
          <p className="mt-1 text-2xl font-black text-zinc-700 dark:text-zinc-300">
            ৳{soloTotalBdt.toFixed(2)}
          </p>
          <span className="text-[11px] text-zinc-400">
            {seats > 1 ? `৳${soloSingleBdt.toFixed(2)} × ${seats} seats` : 'Regular single-rider fare'}
          </span>
        </div>

        <div className="relative rounded-xl border-2 border-emerald-500 bg-emerald-50/40 p-4 dark:border-emerald-600 dark:bg-emerald-950/20">
          <div className="absolute -top-2.5 right-3 rounded-md bg-emerald-600 px-2 py-0.5 text-[10px] font-black uppercase text-white shadow-sm">
            Best Value
          </div>
          <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400">
            Tesla Pool ({seats} {seats === 1 ? 'Seat' : 'Seats'})
          </span>
          <p className="mt-1 text-2xl font-black text-emerald-600 dark:text-emerald-400">
            ৳{pooledTotalBdt.toFixed(2)}
          </p>
          <span className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-300">
            {seats > 1
              ? `৳${pooledSingleBdt.toFixed(2)}/seat • Save ৳${savingsTotalBdt.toFixed(2)}`
              : `You save ৳${savingsTotalBdt.toFixed(2)} in Bullet!`}
          </span>
        </div>
      </div>

      <div className="mt-4 rounded-lg bg-zinc-50 p-3 text-xs text-zinc-600 dark:bg-zinc-800/50 dark:text-zinc-400">
        <div className="flex justify-between py-0.5">
          <span>Rate per Seat:</span>
          <span className="font-mono">৳{pooledSingleBdt.toFixed(2)}</span>
        </div>
        <div className="flex justify-between py-0.5">
          <span>Seats Selected:</span>
          <span className="font-mono font-bold text-zinc-800 dark:text-zinc-200">{seats}</span>
        </div>
        <div className="flex justify-between py-0.5">
          <span>Base Fare ({seats}x):</span>
          <span className="font-mono">৳{(((quote.baseFarePoysha * seats)) / 100).toFixed(2)}</span>
        </div>
        <div className="flex justify-between py-0.5">
          <span>Distance Charge ({quote.distanceKm} km × {seats}x):</span>
          <span className="font-mono">৳{(((quote.distanceChargePoysha * seats)) / 100).toFixed(2)}</span>
        </div>
        <div className="flex justify-between border-t border-zinc-200 pt-1 font-semibold text-emerald-600 dark:border-zinc-700 dark:text-emerald-400">
          <span>Total Fare ({seats} {seats === 1 ? 'seat' : 'seats'}):</span>
          <span className="font-mono">৳{pooledTotalBdt.toFixed(2)}</span>
        </div>
      </div>

      {/* Payment Method Selector */}
      <div className="mt-4 space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-zinc-500">
          Payment Method
        </label>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => onPaymentMethodChange?.('TESLAPAY')}
            className={`flex flex-col items-start rounded-xl border p-3 text-left transition-all ${
              paymentMethod === 'TESLAPAY'
                ? 'border-emerald-600 bg-emerald-50/80 text-emerald-950 dark:bg-emerald-950/60 dark:text-emerald-200 shadow-sm'
                : 'border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-800/40 dark:text-zinc-300'
            }`}
          >
            <div className="flex items-center gap-1.5 text-xs font-bold">
              <Wallet className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              <span>TeslaPay Wallet</span>
            </div>
            <span className="mt-1 text-[11px] font-semibold text-zinc-500 dark:text-zinc-400">
              Balance: ৳{(walletBalanceBdt ?? 500).toFixed(2)}
            </span>
          </button>

          <button
            type="button"
            onClick={() => onPaymentMethodChange?.('CASH')}
            className={`flex flex-col items-start rounded-xl border p-3 text-left transition-all ${
              paymentMethod === 'CASH'
                ? 'border-emerald-600 bg-emerald-50/80 text-emerald-950 dark:bg-emerald-950/60 dark:text-emerald-200 shadow-sm'
                : 'border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-800/40 dark:text-zinc-300'
            }`}
          >
            <div className="flex items-center gap-1.5 text-xs font-bold">
              <Banknote className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              <span>Cash to Captain</span>
            </div>
            <span className="mt-1 text-[11px] font-semibold text-zinc-500 dark:text-zinc-400">
              Pay upon trip completion
            </span>
          </button>
        </div>

        {/* Insufficient balance warning + instant topup */}
        {paymentMethod === 'TESLAPAY' && (walletBalanceBdt ?? 500) < pooledTotalBdt && (
          <div className="flex items-center justify-between rounded-xl border border-amber-200 bg-amber-50 p-2.5 text-xs text-amber-800 dark:border-amber-900/50 dark:bg-amber-950/40 dark:text-amber-300">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" />
              <span>Low wallet balance!</span>
            </div>
            {onTopup && (
              <button
                type="button"
                onClick={onTopup}
                disabled={isToppingUp}
                className="flex items-center gap-1 rounded-lg bg-amber-600 px-2 py-1 text-[11px] font-bold text-white shadow-sm hover:bg-amber-700 disabled:opacity-50"
              >
                {isToppingUp ? (
                  <Loader2 className="h-3 w-3 animate-spin" />
                ) : (
                  <PlusCircle className="h-3 w-3" />
                )}
                <span>+ Top Up ৳500</span>
              </button>
            )}
          </div>
        )}
      </div>

      <button
        onClick={onBook}
        disabled={isBooking || (paymentMethod === 'TESLAPAY' && (walletBalanceBdt ?? 500) < pooledTotalBdt)}
        className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3 text-sm font-bold text-white shadow-md shadow-emerald-600/20 transition-all hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isBooking ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Reserving Your Seat{seats > 1 ? 's' : ''}...</span>
          </>
        ) : paymentMethod === 'TESLAPAY' && (walletBalanceBdt ?? 500) < pooledTotalBdt ? (
          <span>Top Up TeslaPay or Select Cash</span>
        ) : (
          <>
            <ShieldCheck className="h-4 w-4" />
            <span>
              Confirm Booking ({seats} {seats === 1 ? 'Seat' : 'Seats'}) • ৳{pooledTotalBdt.toFixed(2)}
            </span>
          </>
        )}
      </button>
    </div>
  );
}

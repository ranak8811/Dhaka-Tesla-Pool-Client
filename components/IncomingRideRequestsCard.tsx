import React from 'react';
import { User, MapPin, Check, X, Loader2, BellRing } from 'lucide-react';
import { ManifestPassenger } from './PassengerManifestTable';

interface IncomingRideRequestsCardProps {
  requests: ManifestPassenger[];
  onAccept: (rideId: string) => Promise<void> | void;
  onReject: (rideId: string) => Promise<void> | void;
  processingId: string | null;
}

export default function IncomingRideRequestsCard({
  requests,
  onAccept,
  onReject,
  processingId,
}: IncomingRideRequestsCardProps) {
  if (!requests || requests.length === 0) {
    return null;
  }

  return (
    <div className="overflow-hidden rounded-2xl border-2 border-amber-500/40 bg-gradient-to-br from-amber-50/80 via-white to-amber-50/30 p-5 shadow-md dark:border-amber-500/30 dark:from-zinc-900 dark:via-zinc-900 dark:to-amber-950/20">
      <div className="flex items-center justify-between border-b border-amber-200/60 pb-3 dark:border-amber-900/40">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500 text-white shadow-sm animate-bounce">
            <BellRing className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-sm font-black text-zinc-900 dark:text-white">
              Incoming Ride Request ({requests.length})
            </h3>
            <p className="text-xs text-amber-800 dark:text-amber-300/80">
              Corridor passenger waiting for Captain confirmation
            </p>
          </div>
        </div>
        <span className="rounded-full bg-amber-500 px-3 py-1 text-xs font-black uppercase tracking-wider text-white shadow-sm">
          Pending Acceptance
        </span>
      </div>

      <div className="mt-4 divide-y divide-amber-100 dark:divide-zinc-800">
        {requests.map((req) => {
          const isProcessing = processingId === req.rideId;
          const fareFormatted =
            typeof req.fareBdt === 'number' ? req.fareBdt.toFixed(2) : '0.00';

          return (
            <div
              key={req.rideId}
              className="flex flex-col gap-4 py-4 sm:flex-row sm:items-center sm:justify-between first:pt-0 last:pb-0"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                  <User className="h-6 w-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-base font-black text-zinc-900 dark:text-white">
                      {req.name}
                    </span>
                    <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-bold text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                      {req.seats} {req.seats === 1 ? 'seat' : 'seats'}
                    </span>
                    {req.paymentMethod && (
                      <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-[10px] font-bold text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                        {req.paymentMethod === 'TESLAPAY' ? '⚡ TeslaPay' : '💵 Cash'}
                      </span>
                    )}
                  </div>
                  <div className="mt-1 flex items-center gap-1.5 text-xs font-medium text-zinc-600 dark:text-zinc-300">
                    <MapPin className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                    <span>
                      <strong className="text-zinc-900 dark:text-white">{req.pickup}</strong>
                      {' ➔ '}
                      <strong className="text-zinc-900 dark:text-white">{req.drop}</strong>
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between gap-4 sm:justify-end">
                <div className="text-right">
                  <div className="text-lg font-black text-zinc-900 dark:text-white">
                    ৳{fareFormatted}
                  </div>
                  <div className="text-[10px] uppercase font-bold tracking-wider text-emerald-600 dark:text-emerald-400">
                    Shared Fare
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => onReject(req.rideId)}
                    disabled={isProcessing}
                    className="flex items-center gap-1.5 rounded-xl border border-red-200 bg-white px-3.5 py-2 text-xs font-bold text-red-600 shadow-sm transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-red-900/50 dark:bg-zinc-800 dark:text-red-400 dark:hover:bg-red-950/40"
                  >
                    {isProcessing ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <X className="h-3.5 w-3.5" />
                    )}
                    <span>Decline</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onAccept(req.rideId)}
                    disabled={isProcessing}
                    className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-md transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {isProcessing ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <Check className="h-3.5 w-3.5 stroke-[3]" />
                    )}
                    <span>Accept Ride</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

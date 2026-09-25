import React from 'react';
import { User, MapPin, CheckCircle2, Clock } from 'lucide-react';

export interface ManifestPassenger {
  rideId: string;
  name: string;
  pickup: string;
  drop: string;
  seats: number;
  status: string;
  fareBdt: number;
}

interface PassengerManifestTableProps {
  passengers: ManifestPassenger[];
}

export default function PassengerManifestTable({
  passengers,
}: PassengerManifestTableProps) {
  if (passengers.length === 0) {
    return (
      <div className="flex h-52 flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-300 bg-zinc-50/50 p-6 text-center dark:border-zinc-800 dark:bg-zinc-900/50">
        <Clock className="h-8 w-8 text-zinc-400" />
        <p className="mt-2 text-sm font-semibold text-zinc-700 dark:text-zinc-300">
          No Passengers Assigned
        </p>
        <p className="mt-1 text-xs text-zinc-500">
          Stay online in your corridor zone to receive incoming pool requests.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <div className="border-b border-zinc-100 px-6 py-4 dark:border-zinc-800">
        <h3 className="text-sm font-bold text-zinc-900 dark:text-white">
          Active Passenger Manifest ({passengers.length})
        </h3>
        <p className="text-xs text-zinc-500">
          Pooled riders assigned to this corridor trip
        </p>
      </div>

      <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
        {passengers.map((passenger) => (
          <div
            key={passenger.rideId}
            className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between sm:px-6"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                <User className="h-5 w-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-zinc-900 dark:text-white">
                    {passenger.name}
                  </span>
                  <span className="rounded bg-zinc-100 px-1.5 py-0.5 text-[10px] font-bold text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
                    {passenger.seats} {passenger.seats === 1 ? 'seat' : 'seats'}
                  </span>
                </div>
                <div className="mt-0.5 flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400">
                  <MapPin className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                  <span>
                    {passenger.pickup} ➔ {passenger.drop}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between gap-4 sm:justify-end">
              <span className="text-xs font-mono font-extrabold text-zinc-900 dark:text-white">
                ৳{passenger.fareBdt.toFixed(2)}
              </span>

              <span
                className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                  passenger.status === 'COMPLETED'
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                    : passenger.status === 'STARTED'
                    ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                    : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                }`}
              >
                {passenger.status === 'COMPLETED' && (
                  <CheckCircle2 className="h-3 w-3" />
                )}
                <span>{passenger.status}</span>
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

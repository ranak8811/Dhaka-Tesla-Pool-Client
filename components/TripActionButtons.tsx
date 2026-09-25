import React from 'react';
import { MapPin, Navigation, Flag, CheckCircle2, Loader2 } from 'lucide-react';

interface TripActionButtonsProps {
  status: string | null;
  onUpdateStatus: (nextStatus: string) => void;
  isUpdating: boolean;
}

export default function TripActionButtons({
  status,
  onUpdateStatus,
  isUpdating,
}: TripActionButtonsProps) {
  if (!status) {
    return null;
  }

  if (status === 'COMPLETED') {
    return (
      <div className="flex items-center justify-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 p-5 text-emerald-800 dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:text-emerald-300">
        <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
        <span className="text-sm font-bold">
          Trip Completed! All passenger fares collected in poysha.
        </span>
      </div>
    );
  }

  let nextStatus: string | null = null;
  let actionLabel = '';
  let ActionIcon = MapPin;
  let buttonStyle = 'bg-amber-500 hover:bg-amber-600 text-white';

  if (status === 'MATCHED') {
    nextStatus = 'DRIVER_ARRIVED';
    actionLabel = 'Arrived at Pickup Station';
    ActionIcon = MapPin;
    buttonStyle = 'bg-amber-500 hover:bg-amber-600 text-white';
  } else if (status === 'DRIVER_ARRIVED') {
    nextStatus = 'STARTED';
    actionLabel = 'Start Corridor Trip';
    ActionIcon = Navigation;
    buttonStyle = 'bg-blue-600 hover:bg-blue-700 text-white';
  } else if (status === 'STARTED') {
    nextStatus = 'COMPLETED';
    actionLabel = 'Complete Trip';
    ActionIcon = Flag;
    buttonStyle = 'bg-emerald-600 hover:bg-emerald-700 text-white';
  }

  if (!nextStatus) {
    return null;
  }

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
            FSM Trip Progression
          </span>
          <p className="text-sm font-bold text-zinc-800 dark:text-zinc-200">
            Current Stage: <span className="font-mono text-emerald-600 dark:text-emerald-400">{status}</span>
          </p>
        </div>

        <button
          onClick={() => onUpdateStatus(nextStatus!)}
          disabled={isUpdating}
          className={`flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-bold shadow-md transition-all disabled:cursor-not-allowed disabled:opacity-50 ${buttonStyle}`}
        >
          {isUpdating ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Updating Lifecycle...</span>
            </>
          ) : (
            <>
              <ActionIcon className="h-4 w-4" />
              <span>{actionLabel}</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}

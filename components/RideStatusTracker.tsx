import {
  Car,
  CheckCircle2,
  Loader2,
  User,
  ShieldAlert,
} from 'lucide-react';

export type RideStatus =
  | 'REQUESTED'
  | 'MATCHED'
  | 'DRIVER_ARRIVED'
  | 'STARTED'
  | 'COMPLETED'
  | 'CANCELLED';

export interface ActiveRide {
  id: string;
  passengerId: string;
  pickupZone: string;
  destinationZone: string;
  seatsRequested: number;
  farePoysha?: number;
  totalFarePoysha?: number;
  paymentMethod?: 'TESLAPAY' | 'CASH';
  paymentStatus?: string;
  status: RideStatus;
  createdAt?: string;
  pool?: {
    id: string;
    currentSeatsOccupied: number;
    status: string;
    vehicle?: {
      model: string;
      licensePlate: string;
      driver?: {
        id: string;
        name: string;
        email: string;
      };
    };
  } | null;
}

interface RideStatusTrackerProps {
  ride: ActiveRide;
  onCancel: () => void;
  isCancelling: boolean;
  onNewBooking?: () => void;
}

const STEPS: { status: RideStatus; label: string; description: string }[] = [
  {
    status: 'REQUESTED',
    label: 'Requested',
    description: 'Dispatch sent! Waiting for Captain Jashim to accept...',
  },
  {
    status: 'MATCHED',
    label: 'Matched',
    description: "Captain accepted! Matched with Jashim's Bullet.",
  },
  {
    status: 'DRIVER_ARRIVED',
    label: 'Driver Arrived',
    description: 'Bullet has arrived at pickup zone!',
  },
  {
    status: 'STARTED',
    label: 'In Transit',
    description: 'Surviving Dhaka traffic on the way...',
  },
  {
    status: 'COMPLETED',
    label: 'Completed',
    description: 'Arrived safely at destination!',
  },
];

export default function RideStatusTracker({
  ride,
  onCancel,
  isCancelling,
  onNewBooking,
}: RideStatusTrackerProps) {
  const currentStepIndex = STEPS.findIndex((s) => s.status === ride.status);
  const isInTransit = ride.status === 'STARTED';
  const isCompleted = ride.status === 'COMPLETED';
  const isCancelled = ride.status === 'CANCELLED';
  const driver = ride.pool?.vehicle?.driver;
  const vehicle = ride.pool?.vehicle;
  const poysha = ride.totalFarePoysha ?? ride.farePoysha ?? 0;
  const fareBdt = (poysha / 100).toFixed(2);

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-zinc-100 pb-4 dark:border-zinc-800">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
            Live Corridor Ride
          </span>
          <h2 className="text-lg font-black text-zinc-900 dark:text-white">
            {ride.pickupZone || 'Pickup'} ➔ {ride.destinationZone || 'Destination'}
          </h2>
        </div>
        <div className="flex items-center gap-2">
          {ride.paymentMethod && (
            <span className="rounded-full bg-zinc-100 px-2.5 py-1 text-[11px] font-bold text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
              {ride.paymentMethod === 'TESLAPAY' ? '⚡ TeslaPay' : '💵 Cash'}
            </span>
          )}
          <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-bold text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
            {ride.seatsRequested || 1} {ride.seatsRequested === 1 ? 'Seat' : 'Seats'}
          </span>
          <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-extrabold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
            ৳{fareBdt}
          </span>
        </div>
      </div>

      <div className="my-6">
        <div className="grid grid-cols-5 gap-2">
          {STEPS.map((step, idx) => {
            const isFinished = currentStepIndex > idx || isCompleted;
            const isCurrent = currentStepIndex === idx && !isCompleted && !isCancelled;

            return (
              <div key={step.status} className="flex flex-col items-center text-center">
                <div
                  className={`flex h-9 w-9 items-center justify-center rounded-full border-2 text-xs font-bold transition-all ${
                    isFinished
                      ? 'border-emerald-600 bg-emerald-600 text-white'
                      : isCurrent
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-600 animate-pulse dark:bg-emerald-950'
                      : 'border-zinc-300 bg-zinc-50 text-zinc-400 dark:border-zinc-700 dark:bg-zinc-800'
                  }`}
                >
                  {isFinished ? (
                    <CheckCircle2 className="h-5 w-5" />
                  ) : isCurrent ? (
                    <Loader2 className="h-4 w-4 animate-spin text-emerald-600" />
                  ) : (
                    <span>{idx + 1}</span>
                  )}
                </div>
                <span className="mt-2 hidden text-[11px] font-bold text-zinc-700 dark:text-zinc-300 sm:block">
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>

        <div className="mt-4 rounded-xl bg-zinc-50 p-3.5 text-center dark:bg-zinc-800/50">
          <p className="text-xs font-semibold text-zinc-800 dark:text-zinc-200">
            {STEPS[currentStepIndex]?.description || 'Ride Active'}
          </p>
          {ride.pool && (
            <p className="mt-1 text-[11px] text-zinc-500">
              Corridor Pool: {ride.pool.currentSeatsOccupied}/3 seats occupied
            </p>
          )}
        </div>

        {ride.status === 'REQUESTED' && (
          <div className="mt-3 flex items-center justify-center gap-2 rounded-xl border border-amber-200 bg-amber-50 p-2.5 text-xs font-semibold text-amber-800 dark:border-amber-900/50 dark:bg-amber-950/40 dark:text-amber-300">
            <Loader2 className="h-4 w-4 animate-spin text-amber-600" />
            <span>Notified Captain Jashim • Awaiting trip acceptance</span>
          </div>
        )}
      </div>

      <div className="rounded-xl border border-zinc-200 bg-zinc-50/60 p-4 dark:border-zinc-800 dark:bg-zinc-800/40">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400">
              <Car className="h-5 w-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                Tesla Vehicle
              </span>
              <p className="text-xs font-bold text-zinc-800 dark:text-zinc-200">
                {vehicle?.model || 'Tesla Model Y'}
              </p>
              <p className="text-[11px] text-zinc-500">
                {vehicle?.licensePlate || 'Dhaka Metro-GA 45-8921'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400">
              <User className="h-5 w-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                Designated Captain
              </span>
              <p className="text-xs font-bold text-zinc-800 dark:text-zinc-200">
                {driver?.name || 'Jashim Uddin'}
              </p>
              <p className="text-[11px] text-zinc-500">
                {driver?.email || 'jashim@dhakatesla.com'}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-2">
        {isInTransit && (
          <div className="flex items-center gap-2 rounded-lg bg-amber-50 p-3 text-xs text-amber-800 dark:bg-amber-950/40 dark:text-amber-300">
            <ShieldAlert className="h-4 w-4 shrink-0 text-amber-600" />
            <span>
              Trip in transit. Cancellation is disabled per safety & pool fair-use policy (EC-02).
            </span>
          </div>
        )}

        {isCancelled ? (
          <div className="flex flex-col gap-2.5">
            <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-center text-xs font-semibold text-red-700 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-300">
              Trip request cancelled or declined. No wallet fare was charged.
            </div>
            {onNewBooking && (
              <button
                type="button"
                onClick={onNewBooking}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-amber-600 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-amber-500"
              >
                <span>Request New Bullet Ride</span>
              </button>
            )}
          </div>
        ) : isCompleted ? (
          <button
            onClick={onNewBooking}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-emerald-500"
          >
            <span>Book Another Ride</span>
          </button>
        ) : (
          <button
            onClick={onCancel}
            disabled={isInTransit || isCancelling || isCancelled}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 py-2.5 text-xs font-bold text-red-700 transition-colors hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-40 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-300 dark:hover:bg-red-900/50"
          >
            {isCancelling ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                <span>Cancelling Ride...</span>
              </>
            ) : (
              <span>Cancel Ride Request</span>
            )}
          </button>
        )}
      </div>
    </div>
  );
}

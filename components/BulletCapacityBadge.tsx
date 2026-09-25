import React from 'react';
import { Zap, Users } from 'lucide-react';

interface BulletCapacityBadgeProps {
  occupied: number;
  max?: number;
}

export default function BulletCapacityBadge({
  occupied,
  max = 3,
}: BulletCapacityBadgeProps) {
  const percentage = Math.round((occupied / max) * 100);
  const isFull = occupied >= max;

  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5 text-white shadow-sm dark:border-zinc-800">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-400">
            <Zap className="h-4 w-4 fill-current" />
          </div>
          <div>
            <h3 className="text-sm font-black text-white">Bullet (Tesla Model Y)</h3>
            <p className="text-[11px] text-zinc-400">Dhaka Corridor 3-Seater Pool</p>
          </div>
        </div>

        <span
          className={`rounded-full px-2.5 py-1 text-xs font-mono font-bold ${
            isFull
              ? 'bg-emerald-500 text-zinc-950'
              : occupied > 0
              ? 'bg-emerald-500/20 text-emerald-300'
              : 'bg-zinc-800 text-zinc-400'
          }`}
        >
          {occupied} / {max} SEATS {isFull ? '(FULL)' : `(${percentage}%)`}
        </span>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2.5">
        {[1, 2, 3].map((seatNum) => {
          const isOccupied = seatNum <= occupied;

          return (
            <div
              key={seatNum}
              className={`flex flex-col items-center justify-center rounded-xl border p-3 text-center transition-all ${
                isOccupied
                  ? 'border-emerald-500 bg-emerald-950/40 text-emerald-300 shadow-sm shadow-emerald-950'
                  : 'border-zinc-800 bg-zinc-950/60 text-zinc-500'
              }`}
            >
              <Users
                className={`h-4 w-4 ${
                  isOccupied ? 'text-emerald-400' : 'text-zinc-600'
                }`}
              />
              <span className="mt-1.5 text-xs font-bold">Seat {seatNum}</span>
              <span className="text-[10px] font-medium">
                {isOccupied ? 'Occupied' : 'Empty'}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

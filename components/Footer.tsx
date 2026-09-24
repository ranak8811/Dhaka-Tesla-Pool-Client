import React from 'react';
import { Zap } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-zinc-200 bg-white py-6 dark:border-zinc-800 dark:bg-zinc-950">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 sm:flex-row sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
          <Zap className="h-4 w-4 text-emerald-600" />
          <span>Dhaka Tesla Pool MVP — 100% Electric Carpooling in Dhaka Corridor</span>
        </div>
        <div className="flex items-center gap-4 text-xs text-zinc-400 dark:text-zinc-500">
          <span>Uttara ⇄ Gulshan ⇄ Motijheel</span>
          <span>•</span>
          <span>Zero Emission</span>
        </div>
      </div>
    </footer>
  );
}

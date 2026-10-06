'use client';

import React from 'react';
import { ShieldCheck, AlertTriangle, ShieldAlert } from 'lucide-react';
import type { SafetyLevel } from '@/features/diagnosis/types/diagnosis.types';

interface SafetyLevelBadgeProps {
  level: SafetyLevel;
}

export function SafetyLevelBadge({ level }: SafetyLevelBadgeProps) {
  switch (level) {
    case 'safe_to_drive':
      return (
        <div className="flex items-center gap-3 rounded-2xl bg-emerald-50 p-4 border border-emerald-200 dark:bg-emerald-950/40 dark:border-emerald-900">
          <ShieldCheck className="h-6 w-6 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <div>
            <h4 className="text-sm font-bold text-emerald-900 dark:text-emerald-200">
              【走行判定: 走行可能】
            </h4>
            <p className="text-xs text-emerald-700 dark:text-emerald-400">
              直ちに走行不能になる危険性は低いですが、早期の点検をおすすめします。
            </p>
          </div>
        </div>
      );
    case 'caution':
      return (
        <div className="flex items-center gap-3 rounded-2xl bg-amber-50 p-4 border border-amber-200 dark:bg-amber-950/40 dark:border-amber-900">
          <AlertTriangle className="h-6 w-6 text-amber-600 dark:text-amber-400 shrink-0" />
          <div>
            <h4 className="text-sm font-bold text-amber-900 dark:text-amber-200">
              【走行判定: 要注意・早期入庫推奨】
            </h4>
            <p className="text-xs text-amber-700 dark:text-amber-400">
              無理な高速走行や遠出は避け、速やかに最寄りの整備工場で点検を受けてください。
            </p>
          </div>
        </div>
      );
    case 'stop_immediately':
      return (
        <div className="flex items-center gap-3 rounded-2xl bg-red-50 p-4 border border-red-200 dark:bg-red-950/40 dark:border-red-900">
          <ShieldAlert className="h-6 w-6 text-red-600 dark:text-red-400 shrink-0" />
          <div>
            <h4 className="text-sm font-bold text-red-900 dark:text-red-200">
              【走行判定: 直ちに走行停止・レッカー要請】
            </h4>
            <p className="text-xs text-red-700 dark:text-red-400">
              走行を続けるとエンジン破損や重大事故・道連れ破壊につながる危険があります。安全な場所に停車してください。
            </p>
          </div>
        </div>
      );
    default:
      return null;
  }
}

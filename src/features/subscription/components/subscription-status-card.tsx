'use client';

import React from 'react';
import { CreditCard, ExternalLink, Loader2, ShieldCheck, AlertTriangle } from 'lucide-react';
import type { SubscriptionStatus } from '@/shared/types/database.types';

interface SubscriptionStatusCardProps {
  status: SubscriptionStatus;
  hasCustomerId: boolean;
  isLoading: boolean;
  onOpenPortal: () => void;
}

export function SubscriptionStatusCard({
  status,
  hasCustomerId,
  isLoading,
  onOpenPortal,
}: SubscriptionStatusCardProps) {
  const getStatusBadge = () => {
    switch (status) {
      case 'active':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 dark:bg-emerald-950 px-2.5 py-0.5 text-xs font-bold text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
            <ShieldCheck className="h-3.5 w-3.5" />
            プロプラン有効 (Active)
          </span>
        );
      case 'past_due':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 dark:bg-amber-950 px-2.5 py-0.5 text-xs font-bold text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
            <AlertTriangle className="h-3.5 w-3.5" />
            支払い保留中 (Past Due)
          </span>
        );
      case 'canceled':
        return (
          <span className="rounded-full bg-zinc-100 dark:bg-zinc-800 px-2.5 py-0.5 text-xs font-medium text-zinc-600 dark:text-zinc-400">
            解約済み (Canceled)
          </span>
        );
      default:
        return (
          <span className="rounded-full bg-zinc-100 dark:bg-zinc-800 px-2.5 py-0.5 text-xs font-medium text-zinc-600 dark:text-zinc-400">
            フリープラン (Free)
          </span>
        );
    }
  };

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-zinc-500">現在の契約ステータス:</span>
          {getStatusBadge()}
        </div>
        <p className="mt-1 text-xs text-zinc-500">
          {status === 'active'
            ? 'Gemini連鎖故障予測・概算見積もり・カルテ無制限保存がご利用いただけます。'
            : 'プロプランに加入すると、二次被害の道連れ破壊予測や無制限診断が解放されます。'}
        </p>
      </div>

      {hasCustomerId && (
        <button
          type="button"
          disabled={isLoading}
          onClick={onOpenPortal}
          className="flex items-center gap-1.5 rounded-xl border border-zinc-300 dark:border-zinc-700 px-4 py-2 text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition active:scale-95 disabled:opacity-50 shrink-0"
        >
          {isLoading ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <CreditCard className="h-3.5 w-3.5" />
          )}
          <span>決済・解約管理ポータル</span>
          <ExternalLink className="h-3 w-3 text-zinc-400" />
        </button>
      )}
    </div>
  );
}

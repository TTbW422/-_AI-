'use client';

import React from 'react';
import { DollarSign, MessageSquareText, HelpCircle } from 'lucide-react';

interface CostAndAdviceCardProps {
  estimatedCostRange: { min: number; max: number };
  adviceForMechanic: string;
}

export function CostAndAdviceCard({
  estimatedCostRange,
  adviceForMechanic,
}: CostAndAdviceCardProps) {
  const formatYen = (amount: number) => {
    return new Intl.NumberFormat('ja-JP', {
      style: 'currency',
      currency: 'JPY',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {/* 概算修理費用カード */}
      <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex items-center gap-2 text-zinc-500 mb-2">
          <DollarSign className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
          <span className="text-xs font-semibold uppercase tracking-wider">
            概算修理費用目安（部品代＋工賃）
          </span>
        </div>
        <div className="mt-2">
          <p className="text-2xl font-black tracking-tight text-zinc-900 dark:text-white">
            {formatYen(estimatedCostRange.min)}
            <span className="mx-1 text-sm font-normal text-zinc-400">〜</span>
            {formatYen(estimatedCostRange.max)}
          </p>
          <p className="mt-2 text-[11px] text-zinc-400 flex items-center gap-1">
            <HelpCircle className="h-3 w-3 shrink-0" />
            ※工場の工賃相場や純正・社外品等により前後します。
          </p>
        </div>
      </div>

      {/* 整備士への伝達ポイント */}
      <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex items-center gap-2 text-zinc-500 mb-2">
          <MessageSquareText className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          <span className="text-xs font-semibold uppercase tracking-wider">
            整備工場・ディーラーへの伝え方
          </span>
        </div>
        <div className="mt-2">
          <p className="rounded-xl bg-blue-50/50 dark:bg-blue-950/30 p-3 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300 border border-blue-100 dark:border-blue-900/40">
            {adviceForMechanic}
          </p>
        </div>
      </div>
    </div>
  );
}

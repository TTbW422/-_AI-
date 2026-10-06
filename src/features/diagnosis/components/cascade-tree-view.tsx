'use client';

import React from 'react';
import { GitCommit, ArrowDown, AlertOctagon, Flame } from 'lucide-react';
import type {
  PrimaryCause,
  CascadeCause,
} from '@/features/diagnosis/types/diagnosis.types';

interface CascadeTreeViewProps {
  primaryCause: PrimaryCause;
  cascadeCauses: CascadeCause[];
}

export function CascadeTreeView({
  primaryCause,
  cascadeCauses,
}: CascadeTreeViewProps) {
  const getRiskBadge = (risk: string) => {
    switch (risk) {
      case 'high':
        return (
          <span className="inline-flex items-center gap-1 rounded-md bg-red-100 dark:bg-red-950 px-2 py-0.5 text-xs font-bold text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800">
            <Flame className="h-3 w-3" />
            危険度: 高（早期道連れ破壊）
          </span>
        );
      case 'medium':
        return (
          <span className="inline-flex items-center gap-1 rounded-md bg-amber-100 dark:bg-amber-950 px-2 py-0.5 text-xs font-bold text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
            <AlertOctagon className="h-3 w-3" />
            危険度: 中（進行性被害）
          </span>
        );
      default:
        return (
          <span className="rounded-md bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 text-xs font-medium text-zinc-600 dark:text-zinc-400">
            危険度: 低（長期影響）
          </span>
        );
    }
  };

  return (
    <div className="space-y-4">
      {/* 直接の故障原因カード */}
      <div className="rounded-2xl border-2 border-blue-500 bg-blue-50/40 p-5 shadow-sm dark:border-blue-700 dark:bg-blue-950/20">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-blue-200 pb-3 dark:border-blue-800">
          <div className="flex items-center gap-2">
            <GitCommit className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-blue-700 dark:text-blue-300">
              【直接の故障部位】
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-zinc-500">AI診断確信度:</span>
            <span className="text-sm font-black text-blue-600 dark:text-blue-400">
              {primaryCause.probability}%
            </span>
          </div>
        </div>

        <div className="mt-3">
          <h3 className="text-lg font-black text-zinc-900 dark:text-white">
            {primaryCause.component}
          </h3>
          <p className="mt-2 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
            {primaryCause.mechanism}
          </p>
        </div>
      </div>

      {/* 連鎖矢印 */}
      {cascadeCauses.length > 0 && (
        <div className="flex flex-col items-center justify-center py-1 text-zinc-400">
          <ArrowDown className="h-5 w-5 animate-bounce text-red-500" />
          <span className="text-[11px] font-bold text-red-600 dark:text-red-400">
            放置による連鎖悪影響（道連れ破壊予測）
          </span>
        </div>
      )}

      {/* 連鎖・二次被害部品リスト */}
      <div className="space-y-3">
        {cascadeCauses.map((cause, index) => (
          <div
            key={index}
            className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 transition hover:border-zinc-300"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-zinc-200 text-[10px] font-bold text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                  {index + 1}
                </span>
                <h4 className="text-sm font-bold text-zinc-900 dark:text-white">
                  {cause.component}
                </h4>
                <span className="text-[10px] rounded bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 text-zinc-500">
                  {cause.direction === 'upstream' ? '上流原因' : '下流被害'}
                </span>
              </div>
              {getRiskBadge(cause.riskLevel)}
            </div>
            <p className="mt-2 text-xs leading-relaxed text-zinc-600 dark:text-zinc-400 bg-zinc-50 dark:bg-zinc-950/60 p-2.5 rounded-xl border border-zinc-100 dark:border-zinc-800">
              <span className="font-semibold text-zinc-800 dark:text-zinc-200">破壊シナリオ:</span> {cause.consequence}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

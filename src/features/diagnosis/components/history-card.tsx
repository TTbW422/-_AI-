'use client';

import React, { useState } from 'react';
import { Car, ChevronDown, ChevronUp, Calendar, Wrench } from 'lucide-react';
import type { DiagnosisRecordItem } from '@/features/diagnosis/services/history-api';

interface HistoryCardProps {
  record: DiagnosisRecordItem;
}

export function HistoryCard({ record }: HistoryCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const formattedDate = new Date(record.created_at).toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 transition hover:border-zinc-300">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b pb-4 dark:border-zinc-800">
        <div className="flex items-center gap-3">
          <div className="rounded-2xl bg-blue-50 p-2.5 text-blue-600 dark:bg-blue-950 dark:text-blue-400">
            <Car className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-zinc-900 dark:text-white">
              {record.maker} {record.model_name}
            </h3>
            <div className="flex items-center gap-2 text-xs text-zinc-400 mt-0.5">
              <Calendar className="h-3 w-3" />
              <span>{formattedDate}</span>
              <span>|</span>
              <span>{record.mileage ? `${record.mileage.toLocaleString()}km` : '走行距離未指定'}</span>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-1 rounded-xl bg-zinc-100 dark:bg-zinc-800 px-3 py-1.5 text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition"
        >
          <span>{isExpanded ? '詳細を閉じる' : 'カルテ詳細を見る'}</span>
          {isExpanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
        </button>
      </div>

      <div className="mt-4 space-y-3">
        {/* 直接原因サマリー */}
        <div className="flex items-center justify-between rounded-xl bg-blue-50/50 p-3 dark:bg-blue-950/30 text-xs">
          <div className="flex items-center gap-2">
            <Wrench className="h-4 w-4 text-blue-600 dark:text-blue-400 shrink-0" />
            <span className="font-bold text-zinc-800 dark:text-zinc-200">
              直接原因: {record.primary_cause.component}
            </span>
          </div>
          <span className="text-blue-600 dark:text-blue-400 font-bold">
            確信度: {record.primary_cause.probability}%
          </span>
        </div>

        {/* 申告症状 */}
        <p className="text-xs text-zinc-600 dark:text-zinc-400 line-clamp-2">
          <span className="font-semibold text-zinc-800 dark:text-zinc-200">症状: </span>
          {record.symptoms}
        </p>

        {/* 展開時の連鎖被害詳細 */}
        {isExpanded && (
          <div className="pt-3 border-t space-y-3 dark:border-zinc-800">
            <div>
              <h4 className="text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                故障メカニズム:
              </h4>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed bg-zinc-50 dark:bg-zinc-950/50 p-3 rounded-xl">
                {record.primary_cause.mechanism}
              </p>
            </div>

            {record.cascade_causes && record.cascade_causes.length > 0 && (
              <div>
                <h4 className="text-xs font-bold text-red-600 dark:text-red-400 mb-1">
                  連鎖・道連れ破壊予測部品 ({record.cascade_causes.length}件):
                </h4>
                <div className="space-y-1.5">
                  {record.cascade_causes.map((cause, idx) => (
                    <div
                      key={idx}
                      className="rounded-xl border border-zinc-100 dark:border-zinc-800 p-2.5 text-xs bg-zinc-50/50 dark:bg-zinc-950/30"
                    >
                      <div className="flex items-center justify-between font-semibold text-zinc-800 dark:text-zinc-200">
                        <span>• {cause.component} ({cause.direction === 'upstream' ? '上流原因' : '下流被害'})</span>
                        <span className="text-[10px] text-zinc-400">危険度: {cause.riskLevel}</span>
                      </div>
                      <p className="text-[11px] text-zinc-500 mt-0.5">{cause.consequence}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

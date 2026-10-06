'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { RotateCcw, ArrowLeft, Share2, Check, FileCheck } from 'lucide-react';
import type { VehicleSpec } from '@/features/inspection/types/inspection.types';
import type { DiagnosisResult } from '@/features/diagnosis/types/diagnosis.types';
import { SafetyLevelBadge } from '@/features/diagnosis/components/safety-level-badge';
import { CascadeTreeView } from '@/features/diagnosis/components/cascade-tree-view';
import { CostAndAdviceCard } from '@/features/diagnosis/components/cost-and-advice-card';

interface DiagnosisResultViewProps {
  vehicleSpec: VehicleSpec;
  symptoms: string;
  result: DiagnosisResult;
  recordId: string | null;
  onReset: () => void;
}

export function DiagnosisResultView({
  vehicleSpec,
  symptoms,
  result,
  recordId,
  onReset,
}: DiagnosisResultViewProps) {
  const router = useRouter();
  const [copied, setCopied] = React.useState(false);

  const handleShare = () => {
    if (typeof window !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-6">
      {/* 走行可否アラートバッジ */}
      <SafetyLevelBadge level={result.safetyLevel} />

      {/* 対象車両 ＆ 申告症状の振り返り */}
      <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 text-xs space-y-1">
        <div className="flex items-center justify-between">
          <span className="font-bold text-zinc-800 dark:text-zinc-200">
            対象: {vehicleSpec.maker} {vehicleSpec.modelName} ({vehicleSpec.modelYear || '年式不明'})
          </span>
          {recordId && (
            <span className="flex items-center gap-1 text-[11px] text-zinc-400">
              <FileCheck className="h-3 w-3 text-emerald-500" />
              カルテ保存済: {recordId.slice(0, 8)}
            </span>
          )}
        </div>
        <p className="text-zinc-500 line-clamp-2">
          申告症状: {symptoms}
        </p>
      </div>

      {/* 連鎖故障ツリー・フロー表示 */}
      <CascadeTreeView
        primaryCause={result.primaryCause}
        cascadeCauses={result.cascadeCauses}
      />

      {/* 概算修理費用 ＆ 整備士向けアドバイス */}
      <CostAndAdviceCard
        estimatedCostRange={result.estimatedCostRange}
        adviceForMechanic={result.adviceForMechanic}
      />

      {/* 操作アクションボタン群 */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t dark:border-zinc-800">
        <button
          type="button"
          onClick={() => router.push('/inspection')}
          className="flex items-center gap-1.5 rounded-xl border border-zinc-300 dark:border-zinc-700 px-4 py-2.5 text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>車両選択に戻る</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleShare}
            className="flex items-center gap-1.5 rounded-xl border border-zinc-300 dark:border-zinc-700 px-4 py-2.5 text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition"
          >
            {copied ? (
              <>
                <Check className="h-4 w-4 text-emerald-600" />
                <span>URLをコピーしました</span>
              </>
            ) : (
              <>
                <Share2 className="h-4 w-4" />
                <span>結果を共有</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={onReset}
            className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-semibold text-white shadow-md hover:bg-blue-700 transition active:scale-95"
          >
            <RotateCcw className="h-4 w-4" />
            <span>別の症状を再診断する</span>
          </button>
        </div>
      </div>
    </div>
  );
}

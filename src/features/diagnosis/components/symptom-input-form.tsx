'use client';

import React from 'react';
import { Car, Wrench, Sparkles, Loader2, AlertCircle } from 'lucide-react';
import type { VehicleSpec } from '@/features/inspection/types/inspection.types';

const POPULAR_SYMPTOMS = [
  'エンジンからガラガラと異音がする',
  '加速時に息継ぎやノッキングが発生する',
  'メーターのエンジン警告灯（チェックランプ）が点灯した',
  'ブレーキを踏むとキーキー音が鳴り、ペダルに微振動がある',
  'アイドリング時に車体が激しく振動する',
  'エアコンから生ぬるい風しか出ない',
  'マフラーから白煙が出てオイルが焦げたような臭いがする',
];

interface SymptomInputFormProps {
  vehicleSpec: VehicleSpec;
  symptoms: string;
  isAnalyzing: boolean;
  error: string | null;
  onSymptomsChange: (text: string) => void;
  onAddChip: (chip: string) => void;
  onSubmit: () => void;
}

export function SymptomInputForm({
  vehicleSpec,
  symptoms,
  isAnalyzing,
  error,
  onSymptomsChange,
  onAddChip,
  onSubmit,
}: SymptomInputFormProps) {
  const charCount = symptoms.length;

  return (
    <div className="space-y-6">
      {/* 診断対象の車両情報サマリー */}
      <div className="flex items-center justify-between rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-blue-100 p-2.5 text-blue-600 dark:bg-blue-950 dark:text-blue-400">
            <Car className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-zinc-900 dark:text-white">
              {vehicleSpec.maker} {vehicleSpec.modelName}
            </h3>
            <p className="text-xs text-zinc-500">
              年式: {vehicleSpec.modelYear || '未指定'} | 型式: {vehicleSpec.modelCode || '未指定'} | 走行: {vehicleSpec.mileage ? `${vehicleSpec.mileage.toLocaleString()}km` : '未指定'}
            </p>
          </div>
        </div>
      </div>

      {/* 症状入力エリア */}
      <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 space-y-4">
        <div>
          <label className="flex items-center gap-2 text-sm font-bold text-zinc-900 dark:text-white">
            <Wrench className="h-4 w-4 text-blue-600" />
            発生している症状・異変の入力
          </label>
          <p className="mt-1 text-xs text-zinc-500">
            いつから、どんな状況（走行中・停止時・加速時など）でどんな異変が起きたか具体的にご記入ください。
          </p>
        </div>

        {/* クイック選択チップス */}
        <div>
          <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
            よくある症状から追加:
          </span>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {POPULAR_SYMPTOMS.map((chip) => (
              <button
                key={chip}
                type="button"
                disabled={isAnalyzing}
                onClick={() => onAddChip(chip)}
                className="rounded-lg bg-zinc-100 dark:bg-zinc-800 px-2.5 py-1 text-xs text-zinc-700 dark:text-zinc-300 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-950 dark:hover:text-blue-300 transition"
              >
                + {chip}
              </button>
            ))}
          </div>
        </div>

        {/* テキストエリア */}
        <div className="relative">
          <textarea
            rows={5}
            value={symptoms}
            disabled={isAnalyzing}
            placeholder="例: 昨日から時速50km前後で走っているときにエンジンルームからカタカタと異音が聞こえる。アイドリング中もたまに振動が大きい。"
            onChange={(e) => onSymptomsChange(e.target.value)}
            className="w-full rounded-xl border border-zinc-300 p-3.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-zinc-700 dark:bg-zinc-900 dark:focus:ring-blue-950"
          />
          <div className="mt-1 flex justify-between text-xs text-zinc-400">
            <span>※最低5文字〜最大1000文字</span>
            <span className={charCount > 1000 ? 'text-red-500 font-bold' : ''}>
              {charCount} / 1000文字
            </span>
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-2 rounded-xl bg-red-50 p-3 text-sm text-red-600 dark:bg-red-950/40 dark:text-red-400 border border-red-200 dark:border-red-900">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <button
          type="button"
          disabled={isAnalyzing || symptoms.trim().length < 5}
          onClick={onSubmit}
          className="w-full flex items-center justify-center gap-2 rounded-xl bg-blue-600 py-3.5 text-sm font-bold text-white shadow-md hover:bg-blue-700 active:scale-98 transition disabled:opacity-50"
        >
          {isAnalyzing ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>AI整備士が連鎖故障リスクを解析中...</span>
            </>
          ) : (
            <>
              <Sparkles className="h-5 w-5" />
              <span>Geminiで連鎖故障診断を実行する</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}

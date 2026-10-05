'use client';

import React from 'react';
import { Sparkles } from 'lucide-react';
import type { VehicleSpec } from '@/features/inspection/types/inspection.types';

interface VehicleSpecFormProps {
  values: VehicleSpec;
  errors: Partial<Record<keyof VehicleSpec, string>>;
  aiFilledFields: Set<keyof VehicleSpec>;
  onChange: (field: keyof VehicleSpec, value: string | number | null) => void;
}

export function VehicleSpecForm({
  values,
  errors,
  aiFilledFields,
  onChange,
}: VehicleSpecFormProps) {
  const renderAiBadge = (field: keyof VehicleSpec) => {
    if (!aiFilledFields.has(field)) return null;
    return (
      <span className="inline-flex items-center gap-1 rounded-md bg-blue-50 dark:bg-blue-950/60 px-1.5 py-0.5 text-[10px] font-medium text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
        <Sparkles className="h-2.5 w-2.5" />
        AI抽出
      </span>
    );
  };

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {/* メーカー */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
            メーカー <span className="text-red-500">*</span>
          </label>
          {renderAiBadge('maker')}
        </div>
        <input
          type="text"
          value={values.maker}
          placeholder="例: トヨタ, ホンダ"
          onChange={(e) => onChange('maker', e.target.value)}
          className={`w-full rounded-xl border px-3 py-2 text-sm outline-none transition dark:bg-zinc-900 ${
            errors.maker
              ? 'border-red-500 focus:ring-2 focus:ring-red-200'
              : 'border-zinc-300 focus:border-blue-500 dark:border-zinc-700'
          }`}
        />
        {errors.maker && <p className="text-xs text-red-500">{errors.maker}</p>}
      </div>

      {/* 車種名 */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
            車種名 <span className="text-red-500">*</span>
          </label>
          {renderAiBadge('modelName')}
        </div>
        <input
          type="text"
          value={values.modelName}
          placeholder="例: プリウス, フィット"
          onChange={(e) => onChange('modelName', e.target.value)}
          className={`w-full rounded-xl border px-3 py-2 text-sm outline-none transition dark:bg-zinc-900 ${
            errors.modelName
              ? 'border-red-500 focus:ring-2 focus:ring-red-200'
              : 'border-zinc-300 focus:border-blue-500 dark:border-zinc-700'
          }`}
        />
        {errors.modelName && <p className="text-xs text-red-500">{errors.modelName}</p>}
      </div>

      {/* 初度登録年月 */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
            初度登録年月
          </label>
          {renderAiBadge('modelYear')}
        </div>
        <input
          type="text"
          value={values.modelYear ?? ''}
          placeholder="例: 2018-04, 令和2年3月"
          onChange={(e) => onChange('modelYear', e.target.value || null)}
          className="w-full rounded-xl border border-zinc-300 px-3 py-2 text-sm outline-none transition focus:border-blue-500 dark:border-zinc-700 dark:bg-zinc-900"
        />
      </div>

      {/* 型式 */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
            型式
          </label>
          {renderAiBadge('modelCode')}
        </div>
        <input
          type="text"
          value={values.modelCode ?? ''}
          placeholder="例: DAA-ZVW51"
          onChange={(e) => onChange('modelCode', e.target.value || null)}
          className="w-full rounded-xl border border-zinc-300 px-3 py-2 text-sm outline-none transition focus:border-blue-500 dark:border-zinc-700 dark:bg-zinc-900"
        />
      </div>

      {/* 原動機型式 */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
            原動機型式
          </label>
          {renderAiBadge('engineCode')}
        </div>
        <input
          type="text"
          value={values.engineCode ?? ''}
          placeholder="例: 2ZR-1NM"
          onChange={(e) => onChange('engineCode', e.target.value || null)}
          className="w-full rounded-xl border border-zinc-300 px-3 py-2 text-sm outline-none transition focus:border-blue-500 dark:border-zinc-700 dark:bg-zinc-900"
        />
      </div>

      {/* 走行距離 */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
            走行距離 (km)
          </label>
          {renderAiBadge('mileage')}
        </div>
        <input
          type="number"
          value={values.mileage ?? ''}
          placeholder="例: 54000"
          onChange={(e) => {
            const val = e.target.value;
            onChange('mileage', val === '' ? null : parseInt(val, 10));
          }}
          className="w-full rounded-xl border border-zinc-300 px-3 py-2 text-sm outline-none transition focus:border-blue-500 dark:border-zinc-700 dark:bg-zinc-900"
        />
      </div>
    </div>
  );
}

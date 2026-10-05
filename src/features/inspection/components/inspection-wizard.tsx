'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FileText, ArrowRight, CheckCircle2 } from 'lucide-react';
import { VehicleUploader } from '@/features/inspection/components/vehicle-uploader';
import { VehicleSpecForm } from '@/features/inspection/components/vehicle-spec-form';
import { useVehicleOcr } from '@/features/inspection/hooks/use-vehicle-ocr';
import { useVehicleSpecForm } from '@/features/inspection/hooks/use-vehicle-spec-form';
import type { VehicleSpec } from '@/features/inspection/types/inspection.types';

export function InspectionWizard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'ocr' | 'manual'>('ocr');
  const [isSuccessOcr, setIsSuccessOcr] = useState(false);

  const {
    values,
    errors,
    aiFilledFields,
    setFieldValue,
    setFromOcr,
    validate,
  } = useVehicleSpecForm();

  const { isProcessing, error: ocrError, handleFileSelect } = useVehicleOcr();

  const onOcrSuccess = (spec: VehicleSpec) => {
    setFromOcr(spec);
    setIsSuccessOcr(true);
    // 抽出完了後はフォームの確認エリアへスクロールまたはタブ切替
    setActiveTab('manual');
  };

  const handleProceed = () => {
    if (!validate()) return;

    // 次画面（故障診断）へ諸元データを引き継ぐためsessionStorageへ退避
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('current_vehicle_spec', JSON.stringify(values));
    }
    router.push('/diagnosis');
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      {/* タブ切り替え */}
      <div className="flex rounded-xl bg-zinc-100 p-1 dark:bg-zinc-800">
        <button
          type="button"
          onClick={() => setActiveTab('ocr')}
          className={`flex-1 rounded-lg py-2.5 text-xs font-semibold transition ${
            activeTab === 'ocr'
              ? 'bg-white text-zinc-900 shadow-sm dark:bg-zinc-700 dark:text-white'
              : 'text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white'
          }`}
        >
          車検証を読み取る (推奨)
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('manual')}
          className={`flex-1 rounded-lg py-2.5 text-xs font-semibold transition ${
            activeTab === 'manual'
              ? 'bg-white text-zinc-900 shadow-sm dark:bg-zinc-700 dark:text-white'
              : 'text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white'
          }`}
        >
          手動で入力・確認する
        </button>
      </div>

      {/* OCRアップローダー */}
      {activeTab === 'ocr' && (
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <VehicleUploader
            onFileSelect={(file) => handleFileSelect(file, onOcrSuccess)}
            isProcessing={isProcessing}
            error={ocrError}
          />
        </div>
      )}

      {/* 諸元入力・確認フォーム */}
      <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <div className="mb-4 flex items-center justify-between border-b pb-3 dark:border-zinc-800">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-blue-600" />
            <h2 className="text-sm font-bold text-zinc-900 dark:text-white">
              車両諸元情報
            </h2>
          </div>
          {isSuccessOcr && (
            <span className="flex items-center gap-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="h-4 w-4" />
              AI抽出完了（修正可能）
            </span>
          )}
        </div>

        <VehicleSpecForm
          values={values}
          errors={errors}
          aiFilledFields={aiFilledFields}
          onChange={setFieldValue}
        />

        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={handleProceed}
            className="flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-blue-700 active:scale-95"
          >
            <span>次へ進む（症状入力）</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

'use client';

import React from 'react';
import { useDiagnosis } from '@/features/diagnosis/hooks/use-diagnosis';
import { SymptomInputForm } from '@/features/diagnosis/components/symptom-input-form';
import { DiagnosisResultView } from '@/features/diagnosis/components/diagnosis-result-view';

export default function DiagnosisPage() {
  const {
    vehicleSpec,
    symptoms,
    setSymptoms,
    addSymptomChip,
    isAnalyzing,
    error,
    diagnosisResult,
    recordId,
    executeDiagnosis,
    resetDiagnosis,
  } = useDiagnosis();

  const isCompleted = !!diagnosisResult;

  return (
    <main className="min-h-screen bg-zinc-50 px-4 py-10 dark:bg-zinc-950 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        {/* ステップインジケーター */}
        <div className="mb-8">
          <div className="flex items-center justify-center gap-2">
            <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
              ✓ Step 1 車両情報
            </span>
            <div className="h-0.5 w-6 bg-emerald-500" />
            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold border transition ${
                !isCompleted
                  ? 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300 border-blue-200 dark:border-blue-800'
                  : 'text-emerald-600 dark:text-emerald-400 border-transparent'
              }`}
            >
              <span className={`flex h-4 w-4 items-center justify-center rounded-full text-[10px] text-white ${!isCompleted ? 'bg-blue-600' : 'bg-emerald-600'}`}>
                2
              </span>
              Step 2 症状入力
            </span>
            <div className={`h-0.5 w-6 ${isCompleted ? 'bg-blue-600' : 'bg-zinc-200 dark:bg-zinc-800'}`} />
            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold border transition ${
                isCompleted
                  ? 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300 border-blue-200 dark:border-blue-800'
                  : 'text-zinc-400 border-transparent'
              }`}
            >
              <span className={`flex h-4 w-4 items-center justify-center rounded-full text-[10px] text-white ${isCompleted ? 'bg-blue-600' : 'bg-zinc-400'}`}>
                3
              </span>
              Step 3 診断結果
            </span>
          </div>

          <header className="mt-6 text-center">
            <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-3xl">
              {isCompleted ? 'Gemini連鎖故障診断結果' : '車両の異変・症状の入力'}
            </h1>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
              {isCompleted
                ? '直接の故障原因および放置による二次被害リスクです'
                : '気になる音・振動・警告灯などの異変を教えてください'}
            </p>
          </header>
        </div>

        {/* コンテンツ切り替え */}
        {!isCompleted ? (
          <SymptomInputForm
            vehicleSpec={vehicleSpec}
            symptoms={symptoms}
            isAnalyzing={isAnalyzing}
            error={error}
            onSymptomsChange={setSymptoms}
            onAddChip={addSymptomChip}
            onSubmit={executeDiagnosis}
          />
        ) : (
          <DiagnosisResultView
            vehicleSpec={vehicleSpec}
            symptoms={symptoms}
            result={diagnosisResult}
            recordId={recordId}
            onReset={resetDiagnosis}
          />
        )}
      </div>
    </main>
  );
}

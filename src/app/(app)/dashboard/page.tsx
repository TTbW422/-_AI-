'use client';

import React from 'react';
import { useDiagnosisHistory } from '@/features/diagnosis/hooks/use-diagnosis-history';
import { HistoryList } from '@/features/diagnosis/components/history-list';

export default function DashboardPage() {
  const { records, isLoading, error } = useDiagnosisHistory();

  return (
    <main className="min-h-screen bg-zinc-50 px-4 py-10 dark:bg-zinc-950 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl space-y-8">
        <header>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-3xl">
            マイカルテ・診断履歴一覧
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-zinc-500">
            過去にGemini AIで診断した愛車の連鎖故障カルテをいつでも確認できます
          </p>
        </header>

        <HistoryList
          records={records}
          isLoading={isLoading}
          error={error}
        />
      </div>
    </main>
  );
}

'use client';

import React from 'react';
import Link from 'next/link';
import { FileText, Loader2, ArrowRight, AlertCircle, Plus } from 'lucide-react';
import { HistoryCard } from '@/features/diagnosis/components/history-card';
import type { DiagnosisRecordItem } from '@/features/diagnosis/services/history-api';

interface HistoryListProps {
  records: DiagnosisRecordItem[];
  isLoading: boolean;
  error: string | null;
}

export function HistoryList({ records, isLoading, error }: HistoryListProps) {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <p className="text-xs text-zinc-500">カルテ履歴を読み込み中...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl bg-red-50 p-6 text-center dark:bg-red-950/40 border border-red-200 dark:border-red-900 space-y-3">
        <AlertCircle className="h-6 w-6 text-red-600 dark:text-red-400 mx-auto" />
        <p className="text-xs text-red-600 dark:text-red-400">{error}</p>
        <Link
          href="/login"
          className="inline-flex items-center gap-1.5 rounded-xl bg-red-600 px-4 py-2 text-xs font-semibold text-white"
        >
          ログイン画面へ
        </Link>
      </div>
    );
  }

  if (records.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-zinc-300 p-12 text-center dark:border-zinc-800 space-y-4">
        <div className="w-fit mx-auto rounded-full bg-blue-50 p-4 text-blue-600 dark:bg-blue-950 dark:text-blue-400">
          <FileText className="h-8 w-8" />
        </div>
        <div className="space-y-1">
          <h3 className="text-base font-bold text-zinc-800 dark:text-zinc-200">
            診断カルテがまだありません
          </h3>
          <p className="text-xs text-zinc-500 max-w-sm mx-auto">
            車検証をスキャンして症状を入力すると、Gemini AIによる連鎖故障カルテがここに自動保存されます。
          </p>
        </div>
        <Link
          href="/inspection"
          className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-xs font-bold text-white shadow-md hover:bg-blue-700 transition"
        >
          <Plus className="h-4 w-4" />
          <span>新しい愛車診断を開始する</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-zinc-500">
          保存済みカルテ: {records.length}件
        </span>
        <Link
          href="/inspection"
          className="flex items-center gap-1 text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline"
        >
          <span>+ 新規診断</span>
          <ArrowRight className="h-3 w-3" />
        </Link>
      </div>

      <div className="space-y-4">
        {records.map((record) => (
          <HistoryCard key={record.id} record={record} />
        ))}
      </div>
    </div>
  );
}

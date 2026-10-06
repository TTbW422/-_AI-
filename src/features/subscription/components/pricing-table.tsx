'use client';

import React from 'react';
import { Sparkles, Loader2, Zap } from 'lucide-react';
import type { SubscriptionStatus } from '@/shared/types/database.types';
import { PlanFeatureList, type PlanFeature } from '@/features/subscription/components/plan-feature-list';

const FREE_FEATURES: PlanFeature[] = [
  { text: '車検証OCR・諸元読み取り', included: true },
  { text: '基本故障診断（直接原因部品の特定）', included: true },
  { text: '診断回数: 1日1回まで', included: true },
  { text: '連鎖故障・道連れ破壊予測', included: false },
  { text: '概算修理費用レンジ算出', included: false },
  { text: '整備士向け問診アドバイス', included: false },
  { text: 'カルテ無制限保存・PDF共有', included: false },
];

const PRO_FEATURES: PlanFeature[] = [
  { text: '車検証OCR・諸元読み取り', included: true },
  { text: '高精度Gemini連鎖故障診断', included: true, highlight: true },
  { text: '診断回数: 完全無制限', included: true, highlight: true },
  { text: '上流老朽化・下流道連れ破壊シナリオ予測', included: true, highlight: true },
  { text: '概算修理費用レンジ（部品代＋工賃）', included: true, highlight: true },
  { text: '整備工場・ディーラー向け伝達ポイント', included: true, highlight: true },
  { text: 'カルテ無制限クラウド保存・リンク共有', included: true, highlight: true },
];

interface PricingTableProps {
  status: SubscriptionStatus;
  isLoading: boolean;
  onUpgrade: () => void;
}

export function PricingTable({
  status,
  isLoading,
  onUpgrade,
}: PricingTableProps) {
  const isPro = status === 'active';

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      {/* 無料プラン */}
      <div className="flex flex-col justify-between rounded-3xl border border-zinc-200 bg-white p-7 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <div>
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-zinc-900 dark:text-white">フリープラン</h3>
            <span className="rounded-full bg-zinc-100 dark:bg-zinc-800 px-2.5 py-0.5 text-xs font-semibold text-zinc-600 dark:text-zinc-400">
              無料
            </span>
          </div>
          <p className="mt-2 text-xs text-zinc-500">
            愛車の基本情報登録と簡易的な故障部位チェック
          </p>

          <div className="mt-5 border-b pb-5 dark:border-zinc-800">
            <span className="text-3xl font-black text-zinc-900 dark:text-white">¥0</span>
            <span className="text-xs text-zinc-400 ml-1">/ ずっと無料</span>
          </div>

          <div className="mt-5">
            <PlanFeatureList features={FREE_FEATURES} />
          </div>
        </div>

        <div className="mt-8">
          <button
            type="button"
            disabled
            className="w-full rounded-xl bg-zinc-100 dark:bg-zinc-800 py-3 text-xs font-bold text-zinc-400 cursor-not-allowed text-center"
          >
            {isPro ? '利用可能' : '現在のプラン'}
          </button>
        </div>
      </div>

      {/* プロプラン */}
      <div className="relative flex flex-col justify-between rounded-3xl border-2 border-blue-600 bg-gradient-to-b from-blue-50/50 to-white p-7 shadow-lg dark:from-blue-950/20 dark:to-zinc-900">
        <div className="absolute -top-3 right-6 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 px-3 py-1 text-[11px] font-bold text-white shadow-md">
          一番人気
        </div>

        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            <h3 className="text-base font-bold text-zinc-900 dark:text-white">メカドック プロ</h3>
          </div>
          <p className="mt-2 text-xs text-zinc-500">
            国家一級整備士レベルの連鎖故障予測・費用算出を完全解放
          </p>

          <div className="mt-5 border-b border-blue-100 pb-5 dark:border-blue-900/50">
            <span className="text-3xl font-black text-blue-600 dark:text-blue-400">¥980</span>
            <span className="text-xs text-zinc-500 ml-1">/ 月（税込）</span>
          </div>

          <div className="mt-5">
            <PlanFeatureList features={PRO_FEATURES} />
          </div>
        </div>

        <div className="mt-8">
          {isPro ? (
            <div className="w-full rounded-xl bg-emerald-50 dark:bg-emerald-950 py-3 text-xs font-bold text-emerald-700 dark:text-emerald-300 text-center border border-emerald-200 dark:border-emerald-800">
              ✓ 現在加入中です
            </div>
          ) : (
            <button
              type="button"
              disabled={isLoading}
              onClick={onUpgrade}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 py-3 text-xs font-bold text-white shadow-md hover:opacity-95 active:scale-98 transition disabled:opacity-50"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Zap className="h-4 w-4" />
              )}
              <span>プロプランにアップグレード（月額980円）</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

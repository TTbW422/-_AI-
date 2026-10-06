'use client';

import React from 'react';
import { AlertCircle } from 'lucide-react';
import { useSubscription } from '@/features/subscription/hooks/use-subscription';
import { PricingTable } from '@/features/subscription/components/pricing-table';
import { SubscriptionStatusCard } from '@/features/subscription/components/subscription-status-card';

export default function PricingPage() {
  const {
    status,
    hasCustomerId,
    isLoading,
    error,
    startCheckout,
    openPortal,
  } = useSubscription();

  return (
    <main className="min-h-screen bg-zinc-50 px-4 py-12 dark:bg-zinc-950 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl space-y-8">
        <header className="text-center">
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-4xl">
            料金プランのご案内
          </h1>
          <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-400 max-w-xl mx-auto">
            愛車の思わぬ連鎖破壊や高額修理リスクを事前に防ぐためのプロフェッショナル診断プラン
          </p>
        </header>

        {error && (
          <div className="flex items-center gap-2 rounded-2xl bg-red-50 p-4 text-sm text-red-600 dark:bg-red-950/40 dark:text-red-400 border border-red-200 dark:border-red-900">
            <AlertCircle className="h-5 w-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* 現在のステータス ＆ カスタマーポータル */}
        <SubscriptionStatusCard
          status={status}
          hasCustomerId={hasCustomerId}
          isLoading={isLoading}
          onOpenPortal={openPortal}
        />

        {/* 料金テーブル */}
        <PricingTable
          status={status}
          isLoading={isLoading}
          onUpgrade={startCheckout}
        />

        {/* セキュリティ・特定商取引注記 */}
        <div className="rounded-2xl border border-zinc-200 bg-white p-5 text-center text-xs text-zinc-400 dark:border-zinc-800 dark:bg-zinc-900">
          <p>
            ※決済処理は Stripe Inc. の高セキュリティ暗号化決済システムを介して行われます。
          </p>
          <p className="mt-1">
            クレジットカード情報は弊社サーバーを一切通過・保持いたしません。いつでもポータルから解約可能です。
          </p>
        </div>
      </div>
    </main>
  );
}

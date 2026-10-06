import React from 'react';
import Link from 'next/link';
import { Camera, Sparkles, ArrowRight, ShieldCheck, Cpu, Flame } from 'lucide-react';

export function HeroSection() {
  return (
    <section className="relative overflow-hidden py-16 sm:py-24">
      {/* 背景装飾 */}
      <div className="absolute inset-0 -z-10 flex items-center justify-center">
        <div className="h-[400px] w-[600px] rounded-full bg-blue-500/10 blur-[120px] dark:bg-blue-600/10" />
      </div>

      <div className="mx-auto max-w-5xl px-4 sm:px-6 text-center space-y-8">
        {/* バッジ */}
        <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3.5 py-1.5 text-xs font-bold text-blue-700 dark:border-blue-800 dark:bg-blue-950/60 dark:text-blue-300">
          <Sparkles className="h-3.5 w-3.5" />
          <span>Gemini 2.5 搭載・国家一級整備士AI</span>
        </div>

        {/* メインコピー */}
        <h1 className="text-3xl font-black tracking-tight sm:text-5xl lg:text-6xl text-zinc-900 dark:text-white leading-tight">
          愛車の異変、その放置が<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-red-600">
            「道連れ破壊」
          </span>
          を招く。
        </h1>

        {/* サブコピー */}
        <p className="mx-auto max-w-2xl text-sm sm:text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
          車検証をスマホで撮るだけ。AIメカドックが直接の故障原因だけでなく、放置によって壊れる二次被害部品・概算修理費用・整備士への伝え方を科学的に予測します。
        </p>

        {/* CTA ボタン群 */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5">
          <Link
            href="/inspection"
            className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-2xl bg-blue-600 px-7 py-4 text-sm font-bold text-white shadow-lg hover:bg-blue-700 active:scale-95 transition"
          >
            <Camera className="h-4 w-4" />
            <span>車検証をスキャンして診断</span>
            <ArrowRight className="h-4 w-4" />
          </Link>

          <Link
            href="/diagnosis"
            className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-2xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-6 py-4 text-sm font-bold text-zinc-800 dark:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition"
          >
            <span>直接症状を入力する</span>
          </Link>
        </div>

        {/* セキュリティ・信頼性バッジ */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-4 text-xs text-zinc-500">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
            <span>氏名・車台番号の完全非保持</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Cpu className="h-4 w-4 text-blue-600" />
            <span>Structured Outputs 型安全推論</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Flame className="h-4 w-4 text-red-500" />
            <span>連鎖悪影響リスク判定</span>
          </div>
        </div>
      </div>
    </section>
  );
}

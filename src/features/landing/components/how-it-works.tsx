import React from 'react';
import Link from 'next/link';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

const STEPS = [
  {
    number: '01',
    title: '車検証の撮影または手入力',
    desc: 'スマホで車検証を撮影するか、メーカー・車種・年式を選択。個人情報は完全非保持なので安心です。',
  },
  {
    number: '02',
    title: '異音や症状の簡単入力',
    desc: '「走行中にカタカタ音がする」「加速が重い」など、気になる症状をチップや自由文で入力します。',
  },
  {
    number: '03',
    title: '連鎖故障ツリーと費用の確認',
    desc: 'Gemini AIが直接原因・道連れ破壊予測・修理費用相場・整備士への伝え方を即座にレポートします。',
  },
];

export function HowItWorks() {
  return (
    <section className="py-16">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <div className="text-center space-y-3 mb-12">
          <h2 className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
            How It Works
          </h2>
          <p className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-white">
            診断完了までわずか3ステップ
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {STEPS.map((step, idx) => (
            <div
              key={idx}
              className="relative rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 space-y-3"
            >
              <span className="text-3xl font-black text-blue-600/30 dark:text-blue-400/20">
                {step.number}
              </span>
              <h3 className="text-sm font-bold text-zinc-900 dark:text-white">
                {step.title}
              </h3>
              <p className="text-xs leading-relaxed text-zinc-500">
                {step.desc}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/inspection"
            className="inline-flex items-center gap-2 rounded-2xl bg-blue-600 px-8 py-4 text-sm font-bold text-white shadow-lg hover:bg-blue-700 active:scale-95 transition"
          >
            <CheckCircle2 className="h-4 w-4" />
            <span>今すぐ愛車の診断を開始する</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

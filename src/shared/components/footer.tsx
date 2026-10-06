import React from 'react';
import Link from 'next/link';
import { Wrench, ShieldCheck } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-zinc-200 bg-white py-12 dark:border-zinc-800 dark:bg-zinc-950 text-xs text-zinc-500">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 space-y-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-600 text-white">
              <Wrench className="h-4 w-4" />
            </div>
            <span className="text-sm font-bold text-zinc-900 dark:text-white">
              新型 AIメカドック
            </span>
          </div>

          <div className="flex flex-wrap gap-6 text-zinc-600 dark:text-zinc-400">
            <Link href="/inspection" className="hover:text-blue-600">車検証読取</Link>
            <Link href="/diagnosis" className="hover:text-blue-600">故障診断</Link>
            <Link href="/pricing" className="hover:text-blue-600">料金プラン</Link>
            <Link href="/dashboard" className="hover:text-blue-600">マイカルテ</Link>
          </div>
        </div>

        <div className="flex items-center gap-2 rounded-xl bg-zinc-50 dark:bg-zinc-900 p-3.5 border border-zinc-100 dark:border-zinc-800">
          <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
          <p className="text-[11px] leading-relaxed text-zinc-600 dark:text-zinc-400">
            【完全非保持セキュリティ】車検証の氏名・住所・車台番号・ナンバープレート情報は一切保存されません。決済情報はStripe社が最高水準で保護します。
          </p>
        </div>

        <div className="text-center text-[11px] text-zinc-400 pt-4 border-t dark:border-zinc-800">
          © 2026 AIメカドック (Car Diagnosis AI). All rights reserved.
        </div>
      </div>
    </footer>
  );
}

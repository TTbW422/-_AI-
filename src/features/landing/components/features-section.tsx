import React from 'react';
import { Camera, GitFork, Banknote, ShieldAlert } from 'lucide-react';

const FEATURES = [
  {
    icon: Camera,
    color: 'text-blue-600 bg-blue-100 dark:bg-blue-950 dark:text-blue-400',
    title: '車検証OCRで瞬時に諸元登録',
    description:
      'スマホカメラで車検証を撮影するだけ。個人情報や車台番号（VIN）を完全除外した上で、メーカー・車種・型式・エンジン型式をAIが自動抽出します。',
  },
  {
    icon: GitFork,
    color: 'text-indigo-600 bg-indigo-100 dark:bg-indigo-950 dark:text-indigo-400',
    title: '道連れ破壊を暴く「連鎖故障予測」',
    description:
      '「なぜ壊れたのか（上流老朽化）」と「放置すると次に何が壊れるのか（下流二次被害）」を工学的にシミュレーション。高額修理の未然防止をサポートします。',
  },
  {
    icon: Banknote,
    color: 'text-emerald-600 bg-emerald-100 dark:bg-emerald-950 dark:text-emerald-400',
    title: '概算修理費用 ＆ 整備士への伝え方',
    description:
      '部品代と工賃を含めた修理相場（min〜max）を算出。さらに、整備工場やディーラーでそのまま使える「問診伝達用アドバイス」を自動生成します。',
  },
  {
    icon: ShieldAlert,
    color: 'text-amber-600 bg-amber-100 dark:bg-amber-950 dark:text-amber-400',
    title: '3段階の走行可否アラート',
    description:
      '「走行可能」「要注意・早期入庫」「直ちに走行停止」の3段階で判定。無理な走行による重大事故やエンジンブローを防止します。',
  },
];

export function FeaturesSection() {
  return (
    <section className="py-16 bg-white dark:bg-zinc-900 border-y border-zinc-200 dark:border-zinc-800">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <div className="text-center space-y-3 mb-12">
          <h2 className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
            Features
          </h2>
          <p className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-white">
            なぜ、従来の故障診断と違うのか？
          </p>
          <p className="text-xs sm:text-sm text-zinc-500 max-w-xl mx-auto">
            単なる部品名チェックにとどまらない、国家一級整備士の推論ロジックを再現
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {FEATURES.map((f, idx) => {
            const Icon = f.icon;
            return (
              <div
                key={idx}
                className="rounded-3xl border border-zinc-200 p-6 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/50 space-y-3 hover:border-blue-400 transition"
              >
                <div className={`w-fit rounded-2xl p-3 ${f.color}`}>
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="text-base font-bold text-zinc-900 dark:text-white">
                  {f.title}
                </h3>
                <p className="text-xs leading-relaxed text-zinc-600 dark:text-zinc-400">
                  {f.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

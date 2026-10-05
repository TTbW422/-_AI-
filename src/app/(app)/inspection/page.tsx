import { InspectionWizard } from '@/features/inspection/components/inspection-wizard';

export default function InspectionPage() {
  return (
    <main className="min-h-screen bg-zinc-50 px-4 py-10 dark:bg-zinc-950 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        {/* ステップインジケーター */}
        <div className="mb-8">
          <div className="flex items-center justify-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-100 dark:bg-blue-950 px-3 py-1 text-xs font-semibold text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-blue-600 text-[10px] text-white">
                1
              </span>
              Step 1 車両情報の登録
            </span>
            <div className="h-0.5 w-6 bg-zinc-200 dark:bg-zinc-800" />
            <span className="text-xs font-medium text-zinc-400">Step 2 症状入力</span>
            <div className="h-0.5 w-6 bg-zinc-200 dark:bg-zinc-800" />
            <span className="text-xs font-medium text-zinc-400">Step 3 診断結果</span>
          </div>

          <header className="mt-6 text-center">
            <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-3xl">
              車両情報の登録
            </h1>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
              車検証を撮影するか、直接諸元を入力してください
            </p>
          </header>
        </div>

        <InspectionWizard />
      </div>
    </main>
  );
}

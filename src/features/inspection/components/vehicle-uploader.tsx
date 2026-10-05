'use client';

import React, { useRef, useState } from 'react';
import { Upload, Camera, Loader2, ShieldCheck, AlertCircle } from 'lucide-react';

interface VehicleUploaderProps {
  onFileSelect: (file: File) => void;
  isProcessing: boolean;
  error: string | null;
}

export function VehicleUploader({
  onFileSelect,
  isProcessing,
  error,
}: VehicleUploaderProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    if (isProcessing) return;
    const file = e.dataTransfer.files?.[0];
    if (file) onFileSelect(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileSelect(file);
      e.target.value = '';
    }
  };

  return (
    <div className="w-full space-y-4">
      {/* ドラッグ＆ドロップ / クリックアップロード領域 */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragOver(true);
        }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={handleDrop}
        onClick={() => !isProcessing && fileInputRef.current?.click()}
        className={`relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-8 text-center transition-all cursor-pointer ${
          isDragOver
            ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-950/20'
            : 'border-zinc-300 dark:border-zinc-700 hover:border-blue-400 bg-zinc-50/50 dark:bg-zinc-900/50'
        } ${isProcessing ? 'pointer-events-none opacity-60' : ''}`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={handleFileChange}
          className="hidden"
        />

        {isProcessing ? (
          <div className="flex flex-col items-center gap-3 py-4">
            <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
            <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
              AIが車検証から車両諸元を抽出中...
            </p>
            <span className="text-xs text-zinc-500">
              （個人情報・車台番号は自動で除外されます）
            </span>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3 py-2">
            <div className="rounded-full bg-blue-100 dark:bg-blue-900/40 p-3.5 text-blue-600 dark:text-blue-400">
              <Upload className="h-6 w-6" />
            </div>
            <div>
              <p className="text-base font-semibold text-zinc-800 dark:text-zinc-200">
                車検証画像をドラッグ＆ドロップ、または選択
              </p>
              <p className="mt-1 text-xs text-zinc-500">
                JPEG, PNG, WebP（最大5MB）
              </p>
            </div>
          </div>
        )}
      </div>

      {/* スマホ用カメラ撮影ボタン */}
      <div className="flex items-center gap-3">
        <input
          ref={cameraInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleFileChange}
          className="hidden"
        />
        <button
          type="button"
          disabled={isProcessing}
          onClick={() => cameraInputRef.current?.click()}
          className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-zinc-900 dark:bg-zinc-100 px-4 py-3 text-sm font-medium text-white dark:text-zinc-900 shadow-sm transition hover:bg-zinc-800 dark:hover:bg-zinc-200 disabled:opacity-50"
        >
          <Camera className="h-4 w-4" />
          <span>カメラで車検証を撮影する</span>
        </button>
      </div>

      {/* エラー表示 */}
      {error && (
        <div className="flex items-center gap-2 rounded-xl bg-red-50 dark:bg-red-950/40 p-3 text-sm text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* セキュリティバッジ */}
      <div className="flex items-center gap-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 px-3.5 py-2.5 text-xs text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900/50">
        <ShieldCheck className="h-4 w-4 shrink-0 text-emerald-600" />
        <span>
          書類の氏名・住所・車台番号・ナンバープレート情報は一切保存されません。
        </span>
      </div>
    </div>
  );
}

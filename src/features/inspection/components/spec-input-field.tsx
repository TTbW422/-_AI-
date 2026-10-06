'use client';

import React from 'react';
import { Sparkles } from 'lucide-react';

interface SpecInputFieldProps {
  label: string;
  value: string | number | null;
  placeholder?: string;
  type?: 'text' | 'number';
  required?: boolean;
  isAiFilled?: boolean;
  error?: string;
  onChange: (val: string) => void;
}

export function SpecInputField({
  label,
  value,
  placeholder,
  type = 'text',
  required = false,
  isAiFilled = false,
  error,
  onChange,
}: SpecInputFieldProps) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        {isAiFilled && (
          <span className="inline-flex items-center gap-1 rounded-md bg-blue-50 dark:bg-blue-950/60 px-1.5 py-0.5 text-[10px] font-medium text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
            <Sparkles className="h-2.5 w-2.5" />
            AI抽出
          </span>
        )}
      </div>
      <input
        type={type}
        value={value ?? ''}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full rounded-xl border px-3 py-2 text-sm outline-none transition dark:bg-zinc-900 ${
          error
            ? 'border-red-500 focus:ring-2 focus:ring-red-200'
            : 'border-zinc-300 focus:border-blue-500 dark:border-zinc-700'
        }`}
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}

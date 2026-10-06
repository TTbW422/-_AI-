'use client';

import React from 'react';
import { Mail, Lock, Loader2, AlertCircle, CheckCircle2, LogIn, UserPlus } from 'lucide-react';
import { useAuthForm } from '@/features/auth/hooks/use-auth-form';

export function AuthForm() {
  const {
    mode,
    email,
    password,
    isLoading,
    error,
    successMessage,
    setEmail,
    setPassword,
    toggleMode,
    handleSubmit,
  } = useAuthForm();

  return (
    <div className="mx-auto max-w-md w-full rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-black text-zinc-900 dark:text-white">
          {mode === 'login' ? 'ログイン' : '新規アカウント登録'}
        </h2>
        <p className="text-xs text-zinc-500">
          {mode === 'login'
            ? '診断カルテの保存・プロプラン機能をご利用いただけます'
            : '無料でアカウントを作成してカルテをクラウド保存'}
        </p>
      </div>

      {error && (
        <div className="flex items-center gap-2 rounded-2xl bg-red-50 p-3.5 text-xs text-red-600 dark:bg-red-950/40 dark:text-red-400 border border-red-200 dark:border-red-900">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {successMessage && (
        <div className="flex items-center gap-2 rounded-2xl bg-emerald-50 p-3.5 text-xs text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
            メールアドレス
          </label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-3 h-4 w-4 text-zinc-400" />
            <input
              type="email"
              required
              value={email}
              placeholder="name@example.com"
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-zinc-300 pl-10 pr-3.5 py-2.5 text-sm outline-none transition focus:border-blue-500 dark:border-zinc-700 dark:bg-zinc-900"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
            パスワード
          </label>
          <div className="relative">
            <Lock className="absolute left-3.5 top-3 h-4 w-4 text-zinc-400" />
            <input
              type="password"
              required
              minLength={6}
              value={password}
              placeholder="••••••••"
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-zinc-300 pl-10 pr-3.5 py-2.5 text-sm outline-none transition focus:border-blue-500 dark:border-zinc-700 dark:bg-zinc-900"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 text-sm font-bold text-white shadow-md hover:bg-blue-700 active:scale-98 transition disabled:opacity-50"
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : mode === 'login' ? (
            <LogIn className="h-4 w-4" />
          ) : (
            <UserPlus className="h-4 w-4" />
          )}
          <span>{mode === 'login' ? 'ログイン' : 'アカウントを作成'}</span>
        </button>
      </form>

      <div className="text-center pt-2 border-t dark:border-zinc-800">
        <button
          type="button"
          onClick={toggleMode}
          className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
        >
          {mode === 'login'
            ? 'アカウントをお持ちでない方はこちら（新規登録）'
            : 'すでにアカウントをお持ちの方はこちら（ログイン）'}
        </button>
      </div>
    </div>
  );
}

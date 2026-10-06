'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Wrench, User, LogOut, Menu, X } from 'lucide-react';
import { createBrowserSupabaseClient } from '@/shared/lib/supabase/client';

const NAV_LINKS = [
  { href: '/inspection', label: '車検証スキャン' },
  { href: '/diagnosis', label: '故障診断' },
  { href: '/pricing', label: '料金プラン' },
  { href: '/dashboard', label: 'マイカルテ' },
];

export function Header() {
  const router = useRouter();
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const supabase = createBrowserSupabaseClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUserEmail(user?.email ?? null);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUserEmail(session?.user?.email ?? null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleSignOut = async () => {
    const supabase = createBrowserSupabaseClient();
    await supabase.auth.signOut();
    setUserEmail(null);
    router.push('/login');
  };

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-200 bg-white/80 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-950/80">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3.5 sm:px-6">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white shadow-md">
            <Wrench className="h-5 w-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-base font-black tracking-tight text-zinc-900 dark:text-white">
              AIメカドック
            </span>
            <span className="text-[10px] font-semibold text-blue-600 dark:text-blue-400">
              連鎖故障予測AI
            </span>
          </div>
        </Link>

        {/* デスクトップ ナビゲーション */}
        <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-zinc-600 dark:text-zinc-300">
          {NAV_LINKS.map((link) => (
            <Link key={link.href} href={link.href} className="hover:text-blue-600 transition">
              {link.label}
            </Link>
          ))}
        </nav>

        {/* ログイン・ユーザー操作 */}
        <div className="hidden md:flex items-center gap-3">
          {userEmail ? (
            <div className="flex items-center gap-3">
              <span className="text-xs text-zinc-500 max-w-[150px] truncate">{userEmail}</span>
              <button
                type="button"
                onClick={handleSignOut}
                className="flex items-center gap-1 rounded-xl border border-zinc-200 px-3 py-1.5 text-xs font-semibold text-zinc-700 hover:bg-zinc-100 dark:border-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-900 transition"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span>ログアウト</span>
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-blue-700 transition"
            >
              <User className="h-3.5 w-3.5" />
              <span>ログイン / 新規登録</span>
            </Link>
          )}
        </div>

        {/* モバイルメニューボタン */}
        <button
          type="button"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden p-2 text-zinc-600 dark:text-zinc-300"
        >
          {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* モバイルドロワー */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-zinc-200 bg-white p-4 space-y-3 dark:border-zinc-800 dark:bg-zinc-950">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsMenuOpen(false)}
              className="block py-2 text-sm font-semibold text-zinc-700 dark:text-zinc-200"
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-2 border-t dark:border-zinc-800">
            {userEmail ? (
              <button
                type="button"
                onClick={() => {
                  setIsMenuOpen(false);
                  handleSignOut();
                }}
                className="w-full flex items-center justify-center gap-1.5 rounded-xl bg-zinc-100 py-2.5 text-xs font-semibold text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
              >
                <LogOut className="h-4 w-4" />
                <span>ログアウト ({userEmail})</span>
              </button>
            ) : (
              <Link
                href="/login"
                onClick={() => setIsMenuOpen(false)}
                className="w-full flex items-center justify-center gap-1.5 rounded-xl bg-blue-600 py-2.5 text-xs font-semibold text-white"
              >
                <User className="h-4 w-4" />
                <span>ログイン / 新規登録</span>
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

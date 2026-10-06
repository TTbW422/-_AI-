'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { createBrowserSupabaseClient } from '@/shared/lib/supabase/client';

export type AuthMode = 'login' | 'signup';

export function useAuthForm() {
  const router = useRouter();
  const [mode, setMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const toggleMode = useCallback(() => {
    setMode((prev) => (prev === 'login' ? 'signup' : 'login'));
    setError(null);
    setSuccessMessage(null);
  }, []);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setError(null);
      setSuccessMessage(null);

      if (!email || !password) {
        setError('メールアドレスとパスワードを入力してください。');
        return;
      }
      if (password.length < 6) {
        setError('パスワードは6文字以上で設定してください。');
        return;
      }

      setIsLoading(true);
      try {
        const supabase = createBrowserSupabaseClient();

        if (mode === 'signup') {
          const { error: signUpError } = await supabase.auth.signUp({
            email,
            password,
          });
          if (signUpError) throw signUpError;
          setSuccessMessage(
            '確認用メールを送信しました。メール内のリンクをクリックして登録を完了してください。'
          );
        } else {
          const { error: signInError } = await supabase.auth.signInWithPassword({
            email,
            password,
          });
          if (signInError) throw signInError;
          router.push('/dashboard');
        }
      } catch (err) {
        const message =
          err instanceof Error ? err.message : '認証に失敗しました。';
        setError(message);
      } finally {
        setIsLoading(false);
      }
    },
    [email, password, mode, router]
  );

  return {
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
  };
}

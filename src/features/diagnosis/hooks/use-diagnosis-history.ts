'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  fetchDiagnosisHistory,
  type DiagnosisRecordItem,
} from '@/features/diagnosis/services/history-api';

export function useDiagnosisHistory() {
  const [records, setRecords] = useState<DiagnosisRecordItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadHistory = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await fetchDiagnosisHistory();
      setRecords(data);
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : '履歴の取得中にエラーが発生しました。';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    async function init() {
      try {
        const data = await fetchDiagnosisHistory();
        if (isMounted) {
          setRecords(data);
          setIsLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          const message =
            err instanceof Error
              ? err.message
              : '履歴の取得中にエラーが発生しました。';
          setError(message);
          setIsLoading(false);
        }
      }
    }

    init();

    return () => {
      isMounted = false;
    };
  }, []);

  return {
    records,
    isLoading,
    error,
    refetch: loadHistory,
  };
}

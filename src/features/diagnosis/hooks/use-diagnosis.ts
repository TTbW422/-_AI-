'use client';

import { useState, useCallback, useSyncExternalStore } from 'react';
import type { VehicleSpec } from '@/features/inspection/types/inspection.types';
import type { DiagnosisResult } from '@/features/diagnosis/types/diagnosis.types';
import { requestDiagnosis } from '@/features/diagnosis/services/diagnosis-api';

const DEFAULT_SPEC: VehicleSpec = {
  maker: 'トヨタ',
  modelName: 'プリウス',
  modelYear: '2019',
  modelCode: '6AA-ZVW51',
  engineCode: '2ZR-1NM',
  mileage: 65000,
};

function subscribe(callback: () => void) {
  window.addEventListener('storage', callback);
  return () => window.removeEventListener('storage', callback);
}

function getStorageSnapshot(): string | null {
  try {
    return sessionStorage.getItem('current_vehicle_spec');
  } catch {
    return null;
  }
}

function getServerSnapshot(): string | null {
  return null;
}

export function useDiagnosis() {
  const storedSpecString = useSyncExternalStore(
    subscribe,
    getStorageSnapshot,
    getServerSnapshot
  );

  let vehicleSpec = DEFAULT_SPEC;
  if (storedSpecString) {
    try {
      const parsed = JSON.parse(storedSpecString);
      if (parsed.maker && parsed.modelName) {
        vehicleSpec = parsed;
      }
    } catch {
      // ignore parsing error
    }
  }

  const [symptoms, setSymptoms] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [diagnosisResult, setDiagnosisResult] = useState<DiagnosisResult | null>(null);
  const [recordId, setRecordId] = useState<string | null>(null);

  const addSymptomChip = useCallback((chipText: string) => {
    setSymptoms((prev) => {
      const trimmed = prev.trim();
      if (!trimmed) return chipText;
      if (trimmed.includes(chipText)) return prev;
      return `${trimmed}\n${chipText}`;
    });
  }, []);

  const executeDiagnosis = useCallback(async () => {
    setError(null);

    if (symptoms.trim().length < 5) {
      setError('症状を5文字以上で詳しく入力してください。');
      return;
    }
    if (symptoms.trim().length > 1000) {
      setError('症状は1000文字以内で入力してください。');
      return;
    }

    setIsAnalyzing(true);
    try {
      const res = await requestDiagnosis(vehicleSpec, symptoms.trim());
      setDiagnosisResult(res.data);
      if (res.recordId) {
        setRecordId(res.recordId);
      }
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : '診断中にエラーが発生しました。時間をおいて再試行してください。';
      setError(message);
    } finally {
      setIsAnalyzing(false);
    }
  }, [vehicleSpec, symptoms]);

  const resetDiagnosis = useCallback(() => {
    setDiagnosisResult(null);
    setRecordId(null);
    setError(null);
  }, []);

  return {
    vehicleSpec,
    symptoms,
    setSymptoms,
    addSymptomChip,
    isAnalyzing,
    error,
    diagnosisResult,
    recordId,
    executeDiagnosis,
    resetDiagnosis,
  };
}

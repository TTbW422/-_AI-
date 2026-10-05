'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import type { VehicleSpec } from '@/features/inspection/types/inspection.types';
import { uploadVehicleInspection } from '@/features/inspection/services/inspection-api';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export function useVehicleOcr() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const previewUrlRef = useRef<string | null>(null);

  const clearPreview = useCallback(() => {
    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current);
      previewUrlRef.current = null;
    }
    setPreviewUrl(null);
    setSelectedFile(null);
    setError(null);
  }, []);

  useEffect(() => {
    return () => {
      if (previewUrlRef.current) {
        URL.revokeObjectURL(previewUrlRef.current);
      }
    };
  }, []);

  const handleFileSelect = useCallback(
    async (file: File, onSuccess?: (spec: VehicleSpec) => void) => {
      setError(null);

      if (!ALLOWED_TYPES.includes(file.type)) {
        setError('対応していないファイル形式です（JPEG, PNG, WebPのみ対応）。');
        return;
      }

      if (file.size > MAX_FILE_SIZE) {
        setError('ファイルサイズが大きすぎます（上限5MB）。');
        return;
      }

      clearPreview();

      const objectUrl = URL.createObjectURL(file);
      previewUrlRef.current = objectUrl;
      setPreviewUrl(objectUrl);
      setSelectedFile(file);
      setIsProcessing(true);

      try {
        const spec = await uploadVehicleInspection(file);
        if (onSuccess) {
          onSuccess(spec);
        }
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : '車検証の解析中にエラーが発生しました。';
        setError(message);
      } finally {
        setIsProcessing(false);
      }
    },
    [clearPreview]
  );

  return {
    selectedFile,
    previewUrl,
    isProcessing,
    error,
    handleFileSelect,
    clearPreview,
  };
}

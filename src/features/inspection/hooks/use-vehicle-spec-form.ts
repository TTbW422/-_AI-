'use client';

import { useState, useCallback } from 'react';
import {
  type VehicleSpec,
  VehicleSpecSchema,
} from '@/features/inspection/types/inspection.types';

const INITIAL_SPEC: VehicleSpec = {
  maker: '',
  modelName: '',
  modelYear: null,
  modelCode: null,
  engineCode: null,
  mileage: null,
};

export function useVehicleSpecForm(initialValues: VehicleSpec = INITIAL_SPEC) {
  const [values, setValues] = useState<VehicleSpec>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof VehicleSpec, string>>>({});
  const [aiFilledFields, setAiFilledFields] = useState<Set<keyof VehicleSpec>>(new Set());

  const setFieldValue = useCallback(
    (field: keyof VehicleSpec, value: string | number | null) => {
      setValues((prev) => ({
        ...prev,
        [field]: value,
      }));

      // 手動で編集された場合はAIフラグを解除
      setAiFilledFields((prev) => {
        const next = new Set(prev);
        next.delete(field);
        return next;
      });

      // エラーをクリア
      setErrors((prev) => {
        if (!prev[field]) return prev;
        const next = { ...prev };
        delete next[field];
        return next;
      });
    },
    []
  );

  const setFromOcr = useCallback((spec: VehicleSpec) => {
    setValues(spec);
    const filled = new Set<keyof VehicleSpec>();
    (Object.keys(spec) as Array<keyof VehicleSpec>).forEach((key) => {
      if (spec[key] !== null && spec[key] !== '') {
        filled.add(key);
      }
    });
    setAiFilledFields(filled);
    setErrors({});
  }, []);

  const validate = useCallback((): boolean => {
    const result = VehicleSpecSchema.safeParse(values);
    if (!result.success) {
      const fieldErrors: Partial<Record<keyof VehicleSpec, string>> = {};
      result.error.issues.forEach((issue) => {
        const path = issue.path[0] as keyof VehicleSpec;
        if (path) {
          fieldErrors[path] = issue.message;
        }
      });
      setErrors(fieldErrors);
      return false;
    }
    setErrors({});
    return true;
  }, [values]);

  const resetForm = useCallback(() => {
    setValues(INITIAL_SPEC);
    setErrors({});
    setAiFilledFields(new Set());
  }, []);

  return {
    values,
    errors,
    aiFilledFields,
    setFieldValue,
    setFromOcr,
    validate,
    resetForm,
  };
}

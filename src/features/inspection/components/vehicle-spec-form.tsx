'use client';

import React from 'react';
import type { VehicleSpec } from '@/features/inspection/types/inspection.types';
import { SpecInputField } from '@/features/inspection/components/spec-input-field';

interface VehicleSpecFormProps {
  values: VehicleSpec;
  errors: Partial<Record<keyof VehicleSpec, string>>;
  aiFilledFields: Set<keyof VehicleSpec>;
  onChange: (field: keyof VehicleSpec, value: string | number | null) => void;
}

export function VehicleSpecForm({
  values,
  errors,
  aiFilledFields,
  onChange,
}: VehicleSpecFormProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <SpecInputField
        label="メーカー"
        required
        value={values.maker}
        placeholder="例: トヨタ, ホンダ"
        isAiFilled={aiFilledFields.has('maker')}
        error={errors.maker}
        onChange={(val) => onChange('maker', val)}
      />

      <SpecInputField
        label="車種名"
        required
        value={values.modelName}
        placeholder="例: プリウス, フィット"
        isAiFilled={aiFilledFields.has('modelName')}
        error={errors.modelName}
        onChange={(val) => onChange('modelName', val)}
      />

      <SpecInputField
        label="初度登録年月"
        value={values.modelYear}
        placeholder="例: 2018-04, 令和2年3月"
        isAiFilled={aiFilledFields.has('modelYear')}
        error={errors.modelYear}
        onChange={(val) => onChange('modelYear', val || null)}
      />

      <SpecInputField
        label="型式"
        value={values.modelCode}
        placeholder="例: DAA-ZVW51"
        isAiFilled={aiFilledFields.has('modelCode')}
        error={errors.modelCode}
        onChange={(val) => onChange('modelCode', val || null)}
      />

      <SpecInputField
        label="原動機型式"
        value={values.engineCode}
        placeholder="例: 2ZR-1NM"
        isAiFilled={aiFilledFields.has('engineCode')}
        error={errors.engineCode}
        onChange={(val) => onChange('engineCode', val || null)}
      />

      <SpecInputField
        label="走行距離 (km)"
        type="number"
        value={values.mileage}
        placeholder="例: 54000"
        isAiFilled={aiFilledFields.has('mileage')}
        error={errors.mileage}
        onChange={(val) => onChange('mileage', val === '' ? null : parseInt(val, 10))}
      />
    </div>
  );
}

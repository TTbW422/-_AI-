'use client';

import React from 'react';
import { Check, X } from 'lucide-react';

export interface PlanFeature {
  text: string;
  included: boolean;
  highlight?: boolean;
}

interface PlanFeatureListProps {
  features: PlanFeature[];
}

export function PlanFeatureList({ features }: PlanFeatureListProps) {
  return (
    <ul className="space-y-3 text-xs">
      {features.map((feature, idx) => (
        <li key={idx} className="flex items-start gap-2.5">
          {feature.included ? (
            <div className="rounded-full bg-emerald-100 p-0.5 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400 mt-0.5">
              <Check className="h-3 w-3 shrink-0" />
            </div>
          ) : (
            <div className="rounded-full bg-zinc-100 p-0.5 text-zinc-400 dark:bg-zinc-800 mt-0.5">
              <X className="h-3 w-3 shrink-0" />
            </div>
          )}
          <span
            className={`${
              feature.included
                ? feature.highlight
                  ? 'font-bold text-blue-600 dark:text-blue-400'
                  : 'text-zinc-700 dark:text-zinc-300'
                : 'text-zinc-400 dark:text-zinc-600 line-through'
            }`}
          >
            {feature.text}
          </span>
        </li>
      ))}
    </ul>
  );
}

'use client';

import React from 'react';
import type { LanguageSelectorProps, LanguageCode } from '@/types';

export default function LanguageSelector({
  targetLang,
  onTargetChange,
}: LanguageSelectorProps) {
  const targetLanguages: { value: LanguageCode; label: string }[] = [
    { value: 'en', label: 'English' },
    { value: 'ja', label: 'Japanese' },
    { value: 'zh', label: 'Chinese' },
  ];

  return (
    <div className="flex flex-col sm:flex-row gap-4 w-full items-center">
      <div className="text-sm font-medium text-gray-600 dark:text-gray-400">
        自动检测 →
      </div>

      <div className="flex-1">
        <label
          htmlFor="target-lang"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
        >
          翻译为
        </label>
        <select
          id="target-lang"
          value={targetLang}
          onChange={(e) => onTargetChange(e.target.value as LanguageCode)}
          className="w-full px-3 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 transition-colors"
        >
          {targetLanguages.map((lang) => (
            <option key={lang.value} value={lang.value}>
              {lang.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

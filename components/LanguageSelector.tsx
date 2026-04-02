'use client';

import React from 'react';
import type { LanguageSelectorProps, LanguageCode, SourceLanguageCode } from '@/types';

export default function LanguageSelector({
  sourceLang,
  targetLang,
  onSourceChange,
  onTargetChange,
}: LanguageSelectorProps) {
  const sourceLanguages: { value: SourceLanguageCode; label: string }[] = [
    { value: 'auto', label: '自动检测' },
    { value: 'en', label: 'English' },
    { value: 'ja', label: 'Japanese' },
    { value: 'zh', label: 'Chinese' },
  ];

  const targetLanguages: { value: LanguageCode; label: string }[] = [
    { value: 'en', label: 'English' },
    { value: 'ja', label: 'Japanese' },
    { value: 'zh', label: 'Chinese' },
  ];

  return (
    <div className="flex flex-row gap-2 w-full items-center">
      <div className="flex-1">
        <label
          htmlFor="source-lang"
          className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-2"
        >
          源语言
        </label>
        <select
          id="source-lang"
          value={sourceLang}
          onChange={(e) => onSourceChange(e.target.value as SourceLanguageCode)}
          className="w-full px-2 sm:px-3 py-2 text-sm sm:text-base border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 transition-colors"
        >
          {sourceLanguages.map((lang) => (
            <option key={lang.value} value={lang.value}>
              {lang.label}
            </option>
          ))}
        </select>
      </div>

      <div className="text-sm font-medium text-gray-600 dark:text-gray-400 mt-6">
        →
      </div>

      <div className="flex-1">
        <label
          htmlFor="target-lang"
          className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-2"
        >
          翻译为
        </label>
        <select
          id="target-lang"
          value={targetLang}
          onChange={(e) => onTargetChange(e.target.value as LanguageCode)}
          className="w-full px-2 sm:px-3 py-2 text-sm sm:text-base border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 transition-colors"
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

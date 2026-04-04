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
    { value: 'auto', label: 'Auto-detect' },
    { value: 'en', label: 'English' },
    { value: 'ja', label: 'Japanese' },
    { value: 'zh', label: 'Chinese' },
  ];

  const targetLanguages: { value: LanguageCode; label: string }[] = [
    { value: 'en', label: 'English' },
    { value: 'ja', label: 'Japanese' },
    { value: 'zh', label: 'Chinese' },
  ];

  const getLanguageLabel = (code: string) => {
    return [...sourceLanguages, ...targetLanguages].find(l => l.value === code)?.label || code;
  };

  return (
    <>
      <div className="flex-1">
        <label className="block text-[10px] font-bold text-secondary uppercase tracking-widest mb-1 ml-1">
          Source
        </label>
        <select
          id="source-lang"
          value={sourceLang}
          onChange={(e) => onSourceChange(e.target.value as SourceLanguageCode)}
          className="w-full flex items-center justify-between px-4 py-2.5 bg-surface-container-lowest border border-outline-variant/30 rounded-xl text-primary font-semibold text-sm shadow-sm active:bg-surface-container transition-colors cursor-pointer"
        >
          {sourceLanguages.map((lang) => (
            <option key={lang.value} value={lang.value}>
              {lang.label}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-5">
        <button className="p-2 rounded-full bg-primary text-on-primary shadow-md active:scale-90 transition-transform flex items-center justify-center">
          <span className="material-symbols-outlined text-lg">swap_horiz</span>
        </button>
      </div>

      <div className="flex-1">
        <label className="block text-[10px] font-bold text-secondary uppercase tracking-widest mb-1 ml-1 text-right">
          Target
        </label>
        <select
          id="target-lang"
          value={targetLang}
          onChange={(e) => onTargetChange(e.target.value as LanguageCode)}
          className="w-full flex items-center justify-between px-4 py-2.5 bg-surface-container-lowest border border-outline-variant/30 rounded-xl text-primary font-semibold text-sm shadow-sm active:bg-surface-container transition-colors cursor-pointer"
        >
          {targetLanguages.map((lang) => (
            <option key={lang.value} value={lang.value}>
              {lang.label}
            </option>
          ))}
        </select>
      </div>
    </>
  );
}

'use client';

import React from 'react';
import AudioButton from './AudioButton';
import type { TranslationResultProps } from '@/types';

export default function TranslationResult({ data }: TranslationResultProps) {
  const { sourceText, translation, sourcePhonetic, targetPhonetic, sourceLang, targetLang } = data;

  // Map language codes to audio language codes
  const getAudioLang = (lang: string): 'en-US' | 'ja-JP' | 'zh-CN' => {
    switch (lang) {
      case 'en':
        return 'en-US';
      case 'ja':
        return 'ja-JP';
      case 'zh':
        return 'zh-CN';
      default:
        return 'en-US';
    }
  };

  // Check if language uses CJK characters
  const isCJK = (lang: string) => ['zh', 'ja'].includes(lang);

  return (
    <section className="mt-8 relative">
      {/* Translation Result */}
      <div className="flex items-baseline gap-4 mb-4">
        <h2 className={`font-headline text-6xl font-bold text-on-surface ${isCJK(targetLang) ? 'serif-cjk' : ''}`}>
          {translation}
        </h2>
        <AudioButton text={translation} lang={getAudioLang(targetLang)} size="large" />
      </div>

      {targetPhonetic && (
        <div className="flex items-center gap-3 mb-6">
          <span className="text-secondary font-medium tracking-widest text-sm uppercase">
            {targetLang === 'en' ? `/${targetPhonetic}/` : targetPhonetic}
          </span>
        </div>
      )}

      {/* Original Text Card */}
      <div className="mt-6 p-5 bg-surface-container-low rounded-2xl">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] uppercase tracking-widest font-bold text-secondary">
            Original: {sourceLang.toUpperCase()}
          </span>
          <AudioButton text={sourceText} lang={getAudioLang(sourceLang)} size="small" />
        </div>
        <p className={`text-lg font-semibold text-on-surface ${isCJK(sourceLang) ? 'serif-cjk' : ''}`}>
          {sourceText}
        </p>
        {sourcePhonetic && (
          <p className="text-sm text-on-surface-variant mt-1">
            {sourceLang === 'en' ? `/${sourcePhonetic}/` : sourcePhonetic}
          </p>
        )}
      </div>
    </section>
  );
}

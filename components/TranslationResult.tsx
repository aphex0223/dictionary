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

  return (
    <div className="w-full space-y-6 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
      {/* Source Text Section */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 uppercase">
            Source
          </h3>
          <AudioButton text={sourceText} lang={getAudioLang(sourceLang)} size="large" />
        </div>
        <p className="text-2xl font-semibold text-gray-900 dark:text-gray-100">{sourceText}</p>
        {sourcePhonetic && (
          <p className="text-sm text-gray-600 dark:text-gray-400 italic">/{sourcePhonetic}/</p>
        )}
      </div>

      {/* Divider */}
      <div className="border-t border-gray-200 dark:border-gray-700"></div>

      {/* Translation Section */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 uppercase">
            Translation
          </h3>
          <AudioButton text={translation} lang={getAudioLang(targetLang)} size="large" />
        </div>
        <p className="text-2xl font-semibold text-gray-900 dark:text-gray-100">{translation}</p>
        {targetPhonetic && (
          <p className="text-sm text-gray-600 dark:text-gray-400 italic">/{targetPhonetic}/</p>
        )}
      </div>
    </div>
  );
}

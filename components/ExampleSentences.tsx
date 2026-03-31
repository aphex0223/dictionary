'use client';

import React from 'react';
import AudioButton from './AudioButton';
import type { ExampleSentencesProps } from '@/types';

export default function ExampleSentences({ examples, targetLang }: ExampleSentencesProps) {
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

  if (examples.length === 0) {
    return null;
  }

  return (
    <div className="w-full space-y-4 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
        Example Sentences
      </h3>
      <div className="space-y-4">
        {examples.map((example, index) => (
          <div
            key={index}
            className="p-4 bg-gray-50 dark:bg-gray-700 rounded-md space-y-3"
          >
            {/* Source Example */}
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 mt-1">
                <AudioButton text={example.source} lang={getAudioLang('en')} size="small" />
              </div>
              <p className="flex-1 text-gray-900 dark:text-gray-100">{example.source}</p>
            </div>

            {/* Translation Example */}
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 mt-1">
                <AudioButton
                  text={example.translation}
                  lang={getAudioLang(targetLang)}
                  size="small"
                />
              </div>
              <p className="flex-1 text-gray-700 dark:text-gray-300">{example.translation}</p>
            </div>

            {/* Generated Badge */}
            {example.isGenerated && (
              <div className="flex justify-end">
                <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-200 dark:bg-gray-600 px-2 py-1 rounded">
                  AI Generated
                </span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

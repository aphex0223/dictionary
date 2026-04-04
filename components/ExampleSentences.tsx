'use client';

import React from 'react';
import AudioButton from './AudioButton';
import type { ExampleSentencesProps } from '@/types';

export default function ExampleSentences({ examples, targetLang, isLoading }: ExampleSentencesProps & { isLoading?: boolean }) {
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

  // Show loading state
  if (isLoading) {
    return (
      <section className="mt-12">
        <h3 className="font-headline text-xs font-bold text-secondary uppercase tracking-[0.2em] mb-6">
          Usage Examples
        </h3>
        <div className="animate-pulse space-y-4">
          <div className="p-5 bg-surface-container-low rounded-2xl">
            <div className="h-4 bg-surface-container rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-surface-container rounded w-2/3"></div>
          </div>
        </div>
      </section>
    );
  }

  if (examples.length === 0) {
    return null;
  }

  return (
    <section className="mt-12">
      <h3 className="font-headline text-xs font-bold text-secondary uppercase tracking-[0.2em] mb-6">
        Usage Examples
      </h3>
      <div className="space-y-4">
        {examples.map((example, index) => (
          <div
            key={index}
            className="p-5 bg-surface-container-lowest rounded-2xl border border-outline-variant/15 flex gap-4 items-start"
          >
            <div className="flex-1">
              <p className={`font-bold text-on-surface mb-2 leading-tight ${isCJK(targetLang) ? 'serif-cjk' : ''}`}>
                {example.source}
              </p>
              <p className="text-sm text-on-surface-variant italic">
                {example.translation}
              </p>
              {example.isGenerated && (
                <span className="inline-block mt-2 text-[10px] px-2 py-1 rounded bg-tertiary-fixed text-on-tertiary-fixed-variant font-bold uppercase">
                  AI Generated
                </span>
              )}
            </div>
            <AudioButton text={example.source} lang={getAudioLang(targetLang)} size="small" />
          </div>
        ))}
      </div>
    </section>
  );
}

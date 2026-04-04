'use client';

import { useState, useCallback, useEffect } from 'react';
import useSWR from 'swr';
import ThemeToggle from '@/components/ThemeToggle';
import SearchBar from '@/components/SearchBar';
import LanguageSelector from '@/components/LanguageSelector';
import TranslationResult from '@/components/TranslationResult';
import ExampleSentences from '@/components/ExampleSentences';
import type { LanguageCode, SourceLanguageCode, TranslateResponse, Example } from '@/types';

// SWR fetcher
const fetcher = async (url: string, text: string, sourceLang: SourceLanguageCode, targetLang: LanguageCode) => {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ text, sourceLang: sourceLang === 'auto' ? undefined : sourceLang, targetLang }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Translation failed');
  }

  return response.json();
};

export default function HomePage() {
  const [searchText, setSearchText] = useState('');
  const [activeSearchText, setActiveSearchText] = useState('');
  const [sourceLang, setSourceLang] = useState<SourceLanguageCode>('auto');
  const [targetLang, setTargetLang] = useState<LanguageCode>('zh');
  const [examples, setExamples] = useState<Example[]>([]);
  const [examplesLoading, setExamplesLoading] = useState(false);

  // Use SWR for data fetching with caching
  const { data, error, isLoading } = useSWR<TranslateResponse>(
    activeSearchText ? ['/api/translate', activeSearchText, sourceLang, targetLang] : null,
    ([url, text, srcLang, tgtLang]: [string, string, SourceLanguageCode, LanguageCode]) => fetcher(url, text, srcLang, tgtLang),
    {
      revalidateOnFocus: false,
      shouldRetryOnError: false,
    }
  );

  // Load examples asynchronously after translation completes
  useEffect(() => {
    if (data && !isLoading) {
      setExamplesLoading(true);
      setExamples([]);

      fetch('/api/examples', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          word: data.translation,
          sourceLang: data.sourceLang,
          targetLang: data.targetLang,
        }),
      })
        .then(res => res.json())
        .then(result => {
          setExamples(result.examples || []);
          setExamplesLoading(false);
        })
        .catch(err => {
          console.error('Failed to load examples:', err);
          setExamples([]);
          setExamplesLoading(false);
        });
    }
  }, [data, isLoading]);

  const handleSearch = useCallback(() => {
    if (searchText.trim()) {
      setActiveSearchText(searchText.trim());
    }
  }, [searchText]);

  return (
    <>
      {/* TopAppBar */}
      <header className="fixed top-0 w-full z-50 flex justify-between items-center px-6 h-16 bg-background border-b border-outline-variant/20">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-black tracking-tighter text-primary font-headline">
            Jake&apos;s
          </h1>
        </div>
        <ThemeToggle />
      </header>

      <main className="pt-16 pb-8 px-4 max-w-md mx-auto">
        {/* Language Switcher */}
        <nav className="flex items-center justify-between gap-2 py-6">
          <LanguageSelector
            sourceLang={sourceLang}
            targetLang={targetLang}
            onSourceChange={setSourceLang}
            onTargetChange={setTargetLang}
          />
        </nav>

        {/* Input Area */}
        <section className="mt-2 bg-surface-container-low rounded-2xl p-6 relative shadow-sm">
          <SearchBar
            value={searchText}
            onChange={setSearchText}
            onSearch={handleSearch}
            isLoading={isLoading}
          />
        </section>

        {/* Loading State */}
        {isLoading && (
          <section className="mt-8">
            <div className="animate-pulse space-y-4">
              <div className="h-12 bg-surface-container rounded-2xl w-3/4"></div>
              <div className="h-6 bg-surface-container-low rounded-xl w-1/4"></div>
              <div className="h-20 bg-surface-container-low rounded-2xl"></div>
            </div>
          </section>
        )}

        {/* Error State */}
        {error && (
          <section className="mt-8 bg-error-container rounded-2xl p-6">
            <div className="text-on-error-container">
              <p className="font-semibold">翻译失败</p>
              <p className="text-sm mt-1">{error.message}</p>
            </div>
          </section>
        )}

        {/* Result Section */}
        {data && !isLoading && !error && (
          <>
            <TranslationResult data={data} />
            <ExampleSentences examples={examples} targetLang={data.targetLang} isLoading={examplesLoading} />
          </>
        )}

        {/* Empty state */}
        {!activeSearchText && !isLoading && !error && (
          <section className="mt-16 text-center">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-surface-container mb-4">
              <span className="material-symbols-outlined text-5xl text-outline">translate</span>
            </div>
            <p className="text-on-surface-variant font-label">
              输入词汇开始翻译
            </p>
          </section>
        )}
      </main>
    </>
  );
}

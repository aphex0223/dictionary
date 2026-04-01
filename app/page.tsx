'use client';

import { useState, useCallback } from 'react';
import useSWR from 'swr';
import ThemeToggle from '@/components/ThemeToggle';
import SearchBar from '@/components/SearchBar';
import LanguageSelector from '@/components/LanguageSelector';
import TranslationResult from '@/components/TranslationResult';
import ExampleSentences from '@/components/ExampleSentences';
import type { LanguageCode, SourceLanguageCode, TranslateResponse } from '@/types';

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

  // Use SWR for data fetching with caching
  const { data, error, isLoading } = useSWR<TranslateResponse>(
    activeSearchText ? ['/api/translate', activeSearchText, sourceLang, targetLang] : null,
    ([url, text, srcLang, tgtLang]: [string, string, SourceLanguageCode, LanguageCode]) => fetcher(url, text, srcLang, tgtLang),
    {
      revalidateOnFocus: false,
      shouldRetryOnError: false,
    }
  );

  const handleSearch = useCallback(() => {
    if (searchText.trim()) {
      setActiveSearchText(searchText.trim());
    }
  }, [searchText]);

  return (
    <div className="min-h-screen p-4 sm:p-8">
      <div className="max-w-lg mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center px-4 mb-4">
          <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            日英汉词典
          </h1>
          <ThemeToggle />
        </div>

        {/* Search Card */}
        <div className="
          bg-white dark:bg-[#252525]
          rounded-xl
          p-6
          shadow-md dark:shadow-gray-900
          mb-4
        ">
          <SearchBar
            value={searchText}
            onChange={setSearchText}
            onSearch={handleSearch}
            isLoading={isLoading}
          />

          <div className="mt-4">
            <LanguageSelector
              sourceLang={sourceLang}
              targetLang={targetLang}
              onSourceChange={setSourceLang}
              onTargetChange={setTargetLang}
            />
          </div>
        </div>

        {/* Results Card */}
        {isLoading && (
          <div className="
            bg-white dark:bg-[#252525]
            rounded-xl
            p-6
            shadow-lg dark:shadow-gray-900
          ">
            <div className="animate-pulse space-y-4">
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
              <div className="h-20 bg-gray-100 dark:bg-gray-800 rounded"></div>
            </div>
          </div>
        )}

        {error && (
          <div className="
            bg-white dark:bg-[#252525]
            rounded-xl
            p-6
            shadow-lg dark:shadow-gray-900
          ">
            <div className="text-red-500 dark:text-red-400">
              <p className="font-semibold">翻译失败</p>
              <p className="text-sm mt-1">{error.message}</p>
            </div>
          </div>
        )}

        {data && !isLoading && !error && (
          <div className="
            bg-white dark:bg-[#252525]
            rounded-xl
            p-6
            shadow-lg dark:shadow-gray-900
          ">
            <TranslationResult data={data} />
            <ExampleSentences examples={data.examples} targetLang={data.targetLang} />
          </div>
        )}

        {/* Empty state */}
        {!activeSearchText && !isLoading && !error && (
          <div className="
            bg-white dark:bg-[#252525]
            rounded-xl
            p-12
            shadow-md dark:shadow-gray-900
            text-center
          ">
            <p className="text-gray-400 dark:text-gray-500">
              输入词汇开始翻译
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

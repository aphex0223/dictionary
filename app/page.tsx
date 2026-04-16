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
  // Fix API endpoint path - make sure it includes basePath if configured
  const isProduction = process.env.NODE_ENV === 'production';
  const apiUrl = isProduction ? `/dict${url}` : url;
  
  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ text, sourceLang: sourceLang === 'auto' ? undefined : sourceLang, targetLang }),
  });

  // Read response body once
  const responseText = await response.text();
  
  if (!response.ok) {
    let errorMessage = 'Translation failed';
    try {
      const error = JSON.parse(responseText);
      errorMessage = error.message || errorMessage;
    } catch {
      console.error('API error response:', responseText);
      // Try to extract meaningful error from HTML
      if (responseText.includes('404') || responseText.includes('Not Found')) {
        errorMessage = 'API endpoint not found';
      } else if (responseText.includes('500') || responseText.includes('Internal Server Error')) {
        errorMessage = 'Internal server error';
      }
    }
    throw new Error(errorMessage);
  }

  // Ensure response is valid JSON
  try {
    return JSON.parse(responseText);
  } catch {
    console.error('Invalid JSON response:', responseText);
    throw new Error('Invalid response from server');
  }
};

export default function HomePage() {
  const [searchText, setSearchText] = useState('');
  const [activeSearchText, setActiveSearchText] = useState('');
  const [sourceLang, setSourceLang] = useState<SourceLanguageCode>('auto');
  const [targetLang, setTargetLang] = useState<LanguageCode>('ja');
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

      // Fix API endpoint path - make sure it includes basePath if configured
      const isProduction = process.env.NODE_ENV === 'production';
      const examplesUrl = isProduction ? '/dict/api/examples' : '/api/examples';
      
      fetch(examplesUrl, {
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
        .then(async res => {
          // Read response body once
          const responseText = await res.text();
          
          if (!res.ok) {
            console.error('Examples API error response:', responseText);
            throw new Error(`API error: ${res.status}`);
          }
          
          try {
            return JSON.parse(responseText);
          } catch {
            console.error('Invalid JSON response from examples API:', responseText);
            throw new Error('Invalid response from examples server');
          }
        })
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

'use client';

import React from 'react';
import type { SearchBarProps } from '@/types';

export default function SearchBar({ value, onChange, onSearch, isLoading }: SearchBarProps) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !isLoading && value.trim()) {
      onSearch();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    // Enforce 500 character limit
    if (newValue.length <= 500) {
      onChange(newValue);
    }
  };

  const handleClear = () => {
    onChange('');
  };

  return (
    <div className="w-full">
      <div className="relative">
        <input
          type="text"
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder="Enter text to translate..."
          disabled={isLoading}
          className="w-full font-headline text-4xl font-extrabold text-primary tracking-tight bg-transparent border-none outline-none placeholder:text-outline placeholder:font-normal placeholder:text-2xl disabled:opacity-50"
          maxLength={500}
        />
        <div className="absolute bottom-0 right-0 flex gap-4 text-outline">
          {value && (
            <button
              onClick={handleClear}
              className="hover:text-primary transition-colors"
              aria-label="Clear input"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          )}
          <button
            onClick={onSearch}
            disabled={isLoading || !value.trim()}
            className="hover:text-primary transition-colors disabled:opacity-30"
            aria-label="Translate"
          >
            <span className="material-symbols-outlined">search</span>
          </button>
        </div>
      </div>
    </div>
  );
}

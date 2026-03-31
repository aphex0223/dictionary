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

  return (
    <div className="w-full">
      <input
        type="text"
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder="Enter text to translate..."
        disabled={isLoading}
        className="w-full px-4 py-3 text-lg border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        maxLength={500}
      />
      <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 text-right">
        {value.length} / 500
      </div>
    </div>
  );
}

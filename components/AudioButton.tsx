'use client';

import React, { useState } from 'react';
import type { AudioButtonProps } from '@/types';

export default function AudioButton({ text, lang, size = 'large' }: AudioButtonProps) {
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlay = () => {
    if ('speechSynthesis' in window) {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang;

      utterance.onstart = () => setIsPlaying(true);
      utterance.onend = () => setIsPlaying(false);
      utterance.onerror = () => setIsPlaying(false);

      window.speechSynthesis.speak(utterance);
    }
  };

  const buttonSize = size === 'small' ? 'w-6 h-6 text-sm' : 'w-8 h-8 text-base';

  return (
    <button
      onClick={handlePlay}
      disabled={isPlaying}
      className={`${buttonSize} flex items-center justify-center rounded-full text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors`}
      aria-label="Play audio"
      title="Play audio"
    >
      {isPlaying ? '⏸' : '🔊'}
    </button>
  );
}

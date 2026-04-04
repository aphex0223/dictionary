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

  return (
    <button
      onClick={handlePlay}
      disabled={isPlaying}
      className={`p-2 rounded-full ${size === 'large' ? 'bg-surface-container-high' : ''} text-primary hover:bg-surface-container-highest transition-colors disabled:opacity-50`}
      aria-label="Play audio"
      title="Play audio"
    >
      <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
        {isPlaying ? 'pause_circle' : 'volume_up'}
      </span>
    </button>
  );
}

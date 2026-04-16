import type { Metadata } from 'next';
// 使用系统字体而不是从 Google Fonts 加载，以避免网络依赖
// import { Manrope, Inter } from 'next/font/google';
import { Providers } from './providers';
import './globals.css';

export const metadata: Metadata = {
  title: 'Curator - Academic Translation',
  description: 'Trilingual dictionary with Japanese, English, and Chinese translation',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" suppressHydrationWarning>
      <head>
        {/* 移除 Google Fonts 引用，避免网络依赖 */}
        {/* <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        /> */}
      </head>
      <body className="antialiased font-body">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}

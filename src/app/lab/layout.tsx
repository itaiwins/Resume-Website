import localFont from 'next/font/local';
import type { Metadata } from 'next';
import type { ReactNode } from 'react';

// The root layout still describes the old site ("neural network of
// technology and finance"), which shows up in the tab while you're
// reviewing its replacement. Override it here.
export const metadata: Metadata = {
  title: 'Concept Lab — Portfolio Rebuild',
  description: 'Three 3D scroll directions for the portfolio rebuild.',
  robots: { index: false, follow: false },
};

// Self-hosted so the lab renders identically offline and in CI.
const sans = localFont({
  src: [
    { path: '../../../public/fonts/Inter-Regular.ttf', weight: '400', style: 'normal' },
    { path: '../../../public/fonts/Inter-SemiBold.ttf', weight: '600', style: 'normal' },
    { path: '../../../public/fonts/Inter-ExtraBold.ttf', weight: '800', style: 'normal' },
  ],
  variable: '--lab-sans',
  display: 'swap',
});

const mono = localFont({
  src: [
    { path: '../../../public/fonts/JetBrainsMono-Regular.ttf', weight: '400', style: 'normal' },
    { path: '../../../public/fonts/JetBrainsMono-Bold.ttf', weight: '700', style: 'normal' },
  ],
  variable: '--lab-mono',
  display: 'swap',
});

const serif = localFont({
  src: [
    { path: '../../../public/fonts/InstrumentSerif-Regular.ttf', weight: '400', style: 'normal' },
    { path: '../../../public/fonts/InstrumentSerif-Italic.ttf', weight: '400', style: 'italic' },
  ],
  variable: '--lab-serif',
  display: 'swap',
});

export default function LabLayout({ children }: { children: ReactNode }) {
  return (
    <div className={`${sans.variable} ${mono.variable} ${serif.variable}`}>
      <style>{`
        html { scroll-behavior: auto; }
        .lab-root * { box-sizing: border-box; }
        .lab-root a { text-decoration: none; }
        .lab-root ::-webkit-scrollbar { width: 0; height: 0; }
      `}</style>
      {children}
    </div>
  );
}

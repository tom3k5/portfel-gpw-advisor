import type { Metadata } from 'next';

import './globals.css';

export const metadata: Metadata = {
  title: 'Portfel GPW Advisor',
  description: 'Investment advisor app for Warsaw Stock Exchange with AI-powered portfolio optimization',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  return (
    <html lang="pl">
      <body>{children}</body>
    </html>
  );
}

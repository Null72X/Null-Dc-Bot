import './globals.css';
import { Metadata } from 'next';
import { botIdentity } from '@null-bot/config';

export const metadata: Metadata = {
  title: `${botIdentity.name} — All-in-One Discord Bot & Dashboard`,
  description: 'Production-ready modern all-in-one Discord bot management dashboard.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-dark-bg text-slate-100 antialiased">
        {children}
      </body>
    </html>
  );
}

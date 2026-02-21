import type { Metadata } from 'next';
import './globals.css';
import NavBar from '@/components/NavBar';

export const metadata: Metadata = {
  title: 'BJJ Journal',
  description: 'Track your Brazilian Jiu-Jitsu training sessions',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <NavBar />
        <main
          style={{
            maxWidth: '72rem',
            margin: '0 auto',
            padding: '2rem 1rem',
            minHeight: 'calc(100vh - 3.5rem)',
          }}
        >
          {children}
        </main>
      </body>
    </html>
  );
}

// src/app/layout.tsx - Update this
import type { Metadata } from 'next';
import { Providers } from './providers';
import MainLayout from '@/components/layout/MainLayout';

export const metadata: Metadata = {
  title: 'Anycomp - Company Registration & Management',
  description: 'Professional company registration and management platform',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <MainLayout>{children}</MainLayout>
        </Providers>
      </body>
    </html>
  );
}
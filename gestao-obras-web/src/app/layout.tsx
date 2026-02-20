import type { Metadata } from 'next';
import { Providers } from './Providers';

export const metadata: Metadata = {
  title: 'Gestão de Obras',
  description: 'Sistema de gestão de orçamentos e medições',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
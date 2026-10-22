import type { Metadata } from 'next';
import { Inter, Outfit } from 'next/font/google';
import { NextIntlClientProvider } from 'next-intl';
import { getLocale, getMessages, getTranslations } from 'next-intl/server';
import ErrorBoundary from '@/components/ErrorBoundary';
import { AuthProvider } from '@/contexts/AuthContext';
import { ChatProvider } from '@/contexts/ChatContext';
import './globals.css';

const inter = Inter({ subsets: ['latin', 'latin-ext'], variable: '--font-inter' });
const outfit = Outfit({ subsets: ['latin', 'latin-ext'], variable: '--font-outfit' });

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('metadata');
  return {
    title: 'FootyNet',
    description: t('description'),
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body className={`${inter.variable} ${outfit.variable}`}>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <ErrorBoundary>
            <AuthProvider>
              <ChatProvider>
                {children}
              </ChatProvider>
            </AuthProvider>
          </ErrorBoundary>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

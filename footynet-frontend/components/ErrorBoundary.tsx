'use client';

import { Component, ReactNode } from 'react';
import { useTranslations } from 'next-intl';

// Class components can't use hooks, so the translated fallback UI lives in its own function component
function ErrorFallback({ error }: { error?: Error }) {
  const t = useTranslations('errorBoundary');
  return (
    <div className="min-h-screen bg-neutral-50 grid place-items-center p-8">
      <div className="max-w-md text-center">
        <h1 className="text-4xl font-bold tracking-tight text-neutral-900 mb-4">{t('title')}</h1>
        <p className="text-sm text-neutral-600 mb-8">{error?.message || t('unexpected')}</p>
        <button
          onClick={() => window.location.reload()}
          className="bg-neutral-900 text-white px-6 py-3 text-[11px] font-medium uppercase tracking-[0.15em] hover:bg-neutral-700 transition-colors"
        >
          {t('reload')}
        </button>
      </div>
    </div>
  );
}

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback error={this.state.error} />;
    }

    return this.props.children;
  }
}

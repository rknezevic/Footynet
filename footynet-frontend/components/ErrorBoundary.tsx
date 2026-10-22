'use client';

import { Component, ReactNode } from 'react';
import { useTranslations } from 'next-intl';

// Class components can't use hooks, so the translated fallback UI lives in its own function component
function ErrorFallback({ error }: { error?: Error }) {
  const t = useTranslations('errorBoundary');
  return (
    <div className="grid min-h-screen place-items-center p-8">
      <div className="max-w-md rounded-2xl border border-ink-200 bg-white p-10 text-center shadow-card">
        <div className="mb-4 text-5xl" aria-hidden="true">🥅</div>
        <h1 className="mb-2 text-2xl font-bold tracking-tight text-ink-900">{t('title')}</h1>
        <p className="mb-8 text-sm text-ink-600">{error?.message || t('unexpected')}</p>
        <button
          onClick={() => window.location.reload()}
          className="rounded-lg bg-pitch-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-pitch-700"
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

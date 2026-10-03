'use client';

import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';
import { ErrorScreen } from './error-screen';

interface Props {
  children: ReactNode;
  /** Custom fallback; receives a function that clears the error and re-renders the children. */
  fallback?: (reset: () => void) => ReactNode;
  homeHref?: string;
  homeLabel?: string;
}

interface State {
  error: Error | null;
}

/**
 * Section-level boundary: if one block throws while rendering (bad content, a failed widget) only that block is replaced
 * by a retry card. The rest of the page keeps working. Route-wide failures are handled by the error.tsx files.
 */
export class SectionBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error('Section failed to render', error.message, info.componentStack);
  }

  private reset = () => this.setState({ error: null });

  render() {
    if (!this.state.error) return this.props.children;
    if (this.props.fallback) return this.props.fallback(this.reset);
    return (
      <div className="mx-auto w-full max-w-3xl px-5 py-10 sm:px-8">
        <ErrorScreen error={this.state.error} reset={this.reset} homeHref={this.props.homeHref} homeLabel={this.props.homeLabel} compact />
      </div>
    );
  }
}

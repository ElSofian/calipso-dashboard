"use client";

import React, { Component, ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="flex flex-col items-center justify-center p-8 text-center bg-gray-200 dark:bg-neutral-900 rounded-xl shadow-md">
            <div className="text-red-500 text-xl font-bold mb-4">
              Une erreur est survenue
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {this.state.error?.message || "Erreur inconnue"}
            </p>
            <button
              onClick={() =>
                this.setState({ hasError: false, error: undefined })
              }
              className="px-4 py-2 bg-black dark:bg-neutral-800 text-white rounded border dark:border-neutral-700 cursor-pointer"
            >
              Réessayer
            </button>
          </div>
        )
      );
    }

    return this.props.children;
  }
}

export const withErrorBoundary = <P extends object>(
  Component: React.ComponentType<P>,
  fallback?: ReactNode
) => {
  const WrappedComponent = (props: P) => (
    <ErrorBoundary fallback={fallback}>
      <Component {...props} />
    </ErrorBoundary>
  );

  WrappedComponent.displayName = `withErrorBoundary(${
    Component.displayName || Component.name || "Component"
  })`;

  return WrappedComponent;
};

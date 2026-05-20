import { Component, type ErrorInfo, type ReactNode } from "react";

type AppErrorBoundaryProps = {
  children: ReactNode;
};

type AppErrorBoundaryState = {
  error: Error | null;
};

export default class AppErrorBoundary extends Component<AppErrorBoundaryProps, AppErrorBoundaryState> {
  state: AppErrorBoundaryState = {
    error: null,
  };

  static getDerivedStateFromError(error: Error): AppErrorBoundaryState {
    return { error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Wallet as Gallery render error", error, errorInfo);
  }

  render() {
    const { error } = this.state;

    if (error) {
      return (
        <main className="flex min-h-screen items-center justify-center bg-background px-6 py-10 text-foreground">
          <section className="w-full max-w-md rounded-lg border bg-white/80 p-6 text-center shadow-sm dark:bg-slate-950/70">
            <p className="text-sm font-medium text-rose-600 dark:text-rose-400">Something went wrong</p>
            <h1 className="mt-2 text-2xl font-semibold tracking-tight">The gallery needs a quick reset</h1>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">{error.message}</p>
            <button
              className="mt-5 inline-flex h-10 items-center justify-center rounded-md bg-accent px-4 text-sm font-medium text-accent-foreground transition hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-accent/30"
              onClick={() => window.location.assign("/")}
              type="button"
            >
              Back home
            </button>
          </section>
        </main>
      );
    }

    return this.props.children;
  }
}

import { isRouteErrorResponse, useRouteError } from "react-router-dom";

function getRouteErrorMessage(error: unknown) {
  if (isRouteErrorResponse(error)) {
    return `${error.status} ${error.statusText}`;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "The page could not be rendered.";
}

export default function RouteErrorFallback() {
  const error = useRouteError();

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6 py-10 text-foreground">
      <section className="w-full max-w-md rounded-lg border bg-white/80 p-6 text-center shadow-sm dark:bg-slate-950/70">
        <p className="text-sm font-medium text-rose-600 dark:text-rose-400">Something went wrong</p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight">The gallery needs a quick reset</h1>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">{getRouteErrorMessage(error)}</p>
        <a
          className="mt-5 inline-flex h-10 items-center justify-center rounded-md bg-accent px-4 text-sm font-medium text-accent-foreground transition hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-accent/30"
          href="/"
        >
          Back home
        </a>
      </section>
    </main>
  );
}

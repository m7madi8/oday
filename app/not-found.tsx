import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[60svh] max-w-lg flex-col items-center justify-center px-6 py-16 text-center">
      <p className="text-xs uppercase tracking-[0.2em] text-gold">404</p>
      <h1 className="mt-3 font-outfit text-2xl font-medium text-ink-primary">Page not found</h1>
      <p className="mt-4 text-sm leading-relaxed text-ink-secondary">
        The page you requested does not exist or was moved.
      </p>
      <Link
        href="/"
        className="mt-8 rounded-full border border-gold/40 bg-bg-card px-6 py-3 text-xs uppercase tracking-[0.12em] text-ink-primary transition-colors hover:border-gold hover:bg-bg-secondary"
      >
        Back to home
      </Link>
    </div>
  );
}

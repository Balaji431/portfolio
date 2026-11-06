import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-10 py-32 sm:py-44 flex flex-col items-start">
      <span className="font-mono text-xs text-mute border border-line px-2 py-0.5 mb-6">
        404 · Route not found
      </span>
      <h1 className="font-serif text-5xl sm:text-7xl md:text-8xl text-ink font-normal leading-tight tracking-tight">
        This route doesn’t exist in production or staging.
      </h1>
      <p className="mt-6 text-lg sm:text-xl text-mute max-w-[55ch] leading-relaxed">
        The resource you are looking for has either been moved to another cluster or was never committed to this branch.
      </p>
      <div className="mt-10">
        <Link
          href="/"
          className="font-mono text-sm text-ink border-b border-accent pb-1 hover:underline decoration-accent dark:hover:text-accent transition-colors duration-200 inline-block"
        >
          Return to index
        </Link>
      </div>
    </div>
  );
}

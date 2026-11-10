export function Footer() {
  return (
    <footer className="relative z-10 w-full border-t border-line py-12 bg-transparent text-mute text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <p className="text-ink font-serif text-lg">Balaji Dasetti</p>
          <p className="text-xs text-mute mt-1">Chennai, India · UTC+05:30</p>
        </div>
        <p className="text-xs text-mute font-mono">
          © 2026 Balaji Dasetti. All rights reserved.
        </p>
      </div>
    </footer>
  );
}


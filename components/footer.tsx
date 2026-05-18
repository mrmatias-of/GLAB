export default function Footer() {
  return (
    <footer className="border-t border-border py-6 px-4">
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
        <a href="#inicio" className="flex items-center gap-2 text-cyan font-bold text-sm">
          <span className="w-2 h-2 rounded-full bg-cyan inline-block" />
          G•Hub
        </a>
        <p className="text-xs text-foreground/40 text-center">
          &copy; 2026 G•Hub &mdash; Feito por{" "}
          <strong className="text-foreground/60">Guilherme Julião</strong>
        </p>
        <span className="text-xs text-foreground/30">v1.0.0</span>
      </div>
    </footer>
  )
}

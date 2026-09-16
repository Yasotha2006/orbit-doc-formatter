import { cn } from "@/lib/utils";

export function GlassCard({ className, children, ...rest }) {
  return (
    <div className={cn("glass-card p-6", className)} {...rest}>
      {children}
    </div>
  );
}

export function Chip({ tone = "cyan", className, children }) {
  const tones = {
    cyan: "border-primary/40 text-primary bg-primary/10",
    violet: "border-accent/40 text-accent bg-accent/10",
    amber: "border-chart-3/40 text-chart-3 bg-chart-3/10",
    danger: "border-destructive/50 text-destructive bg-destructive/10",
    muted: "border-border text-muted-foreground bg-secondary/40",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 font-mono text-[11px] tracking-wide uppercase",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

export function SectionTitle({ eyebrow, title, subtitle }) {
  return (
    <header className="mb-8 space-y-3">
      {eyebrow ? <Chip tone="violet">{eyebrow}</Chip> : null}
      <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">{title}</h1>
      {subtitle ? <p className="max-w-2xl text-sm text-muted-foreground sm:text-base">{subtitle}</p> : null}
    </header>
  );
}

export function OrbitButton({ variant = "primary", className, ...rest }) {
  const variants = {
    primary:
      "bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_0_30px_-8px_var(--color-cyan-orbit)]",
    ghost: "border border-border text-foreground hover:bg-secondary/60",
  };
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50",
        variants[variant],
        className,
      )}
      {...rest}
    />
  );
}

export function Meter({ value }) {
  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-secondary">
      <div
        className="h-full rounded-full bg-gradient-to-r from-primary to-accent transition-all duration-500"
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  );
}

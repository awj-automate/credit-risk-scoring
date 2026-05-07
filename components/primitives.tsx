"use client";

import { ArrowDown, ArrowUp, Minus } from "lucide-react";
import { cn } from "@/lib/cn";
import type { Tier } from "@/lib/data";

export function TierPill({ tier, size = "sm" }: { tier: Tier; size?: "sm" | "md" }) {
  const styles: Record<Tier, { pill: string; dot: string; label: string }> = {
    green: { pill: "bg-emerald-50 text-emerald-700 border-emerald-200", dot: "bg-emerald-500", label: "Green" },
    yellow: { pill: "bg-amber-50 text-amber-700 border-amber-200", dot: "bg-amber-500", label: "Yellow" },
    red: { pill: "bg-rose-50 text-rose-700 border-rose-200", dot: "bg-rose-500", label: "Red" },
  };
  const s = styles[tier];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border font-semibold",
        s.pill,
        size === "md" ? "px-2.5 py-1 text-[12px]" : "px-2 py-0.5 text-[11px]",
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", s.dot)} />
      {s.label}
    </span>
  );
}

export function TrendIndicator({ delta }: { delta: number }) {
  if (delta > 0) {
    return (
      <span className="inline-flex items-center gap-0.5 text-[11px] font-semibold text-emerald-600">
        <ArrowUp className="h-3 w-3" />+{delta}
      </span>
    );
  }
  if (delta < 0) {
    return (
      <span className="inline-flex items-center gap-0.5 text-[11px] font-semibold text-rose-600">
        <ArrowDown className="h-3 w-3" />{delta}
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-0.5 text-[11px] font-semibold text-slate-500">
      <Minus className="h-3 w-3" />0
    </span>
  );
}

export function ScoreBar({ score, max = 10 }: { score: number; max?: number }) {
  const pct = Math.max(0, Math.min(100, (score / max) * 100));
  const color =
    score >= 8 ? "bg-emerald-500"
    : score >= 6 ? "bg-navy-600"
    : score >= 4 ? "bg-amber-500"
    : "bg-rose-500";
  return (
    <div className="h-1.5 w-full rounded-full bg-slate-100">
      <div className={cn("h-full rounded-full transition-all", color)} style={{ width: `${pct}%` }} />
    </div>
  );
}

export function OverallScoreBar({ score }: { score: number }) {
  const pct = Math.max(0, Math.min(100, score));
  const color =
    score >= 70 ? "bg-emerald-500"
    : score >= 40 ? "bg-amber-500"
    : "bg-rose-500";
  return (
    <div className="h-2 w-full rounded-full bg-slate-100">
      <div className={cn("h-full rounded-full transition-all", color)} style={{ width: `${pct}%` }} />
    </div>
  );
}

export function Sparkline({
  data,
  height = 36,
  width = 120,
  color = "#24477b",
}: {
  data: number[];
  height?: number;
  width?: number;
  color?: string;
}) {
  if (data.length === 0) return null;
  const min = Math.min(...data, 0);
  const max = Math.max(...data, 100);
  const range = max - min || 1;
  const step = data.length > 1 ? width / (data.length - 1) : 0;
  const points = data.map((v, i) => {
    const x = i * step;
    const y = height - ((v - min) / range) * height;
    return `${x},${y}`;
  });
  const areaPath = `M0,${height} L${points.join(" L")} L${width},${height} Z`;
  const linePath = `M${points.join(" L")}`;
  return (
    <svg width={width} height={height} className="overflow-visible">
      <path d={areaPath} fill={color} fillOpacity={0.08} />
      <path d={linePath} fill="none" stroke={color} strokeWidth={1.6} strokeLinejoin="round" strokeLinecap="round" />
      <circle
        cx={(data.length - 1) * step}
        cy={height - ((data[data.length - 1] - min) / range) * height}
        r={2.5}
        fill={color}
      />
    </svg>
  );
}

export function KpiCard({
  label,
  value,
  hint,
  accent,
  children,
}: {
  label: string;
  value: string | number;
  hint?: string;
  accent?: "navy" | "green" | "amber" | "rose";
  children?: React.ReactNode;
}) {
  const accentClass = !accent
    ? ""
    : accent === "navy"
      ? "text-navy-700"
      : accent === "green"
        ? "text-emerald-600"
        : accent === "amber"
          ? "text-amber-600"
          : "text-rose-600";
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-soft">
      <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">{label}</div>
      <div className={cn("mt-2 text-3xl font-semibold tracking-tight text-slate-900", accentClass)}>{value}</div>
      {hint ? <div className="mt-1 text-[12px] text-slate-500">{hint}</div> : null}
      {children}
    </div>
  );
}

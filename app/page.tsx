"use client";

import { useMemo, useState } from "react";
import {
  AlertTriangle,
  BarChart3,
  Building2,
  ChevronRight,
  Cog,
  FileText,
  RefreshCw,
  Search,
  ShieldCheck,
} from "lucide-react";
import {
  categoryAverages,
  categoryDefs,
  customers as allCustomers,
  portfolioStats,
  type Customer,
  type Tier,
} from "@/lib/data";
import {
  KpiCard,
  OverallScoreBar,
  ScoreBar,
  Sparkline,
  TierPill,
  TrendIndicator,
} from "@/components/primitives";
import { cn } from "@/lib/cn";

type View = "portfolio" | "watchlist" | "reports" | "settings";

const navItems: { key: View; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { key: "portfolio", label: "Portfolio", icon: BarChart3 },
  { key: "watchlist", label: "Watchlist", icon: AlertTriangle },
  { key: "reports", label: "Reports", icon: FileText },
  { key: "settings", label: "Settings", icon: Cog },
];

function fmtMoney(n: number): string {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1000) return `$${(n / 1000).toFixed(0)}k`;
  return `$${n}`;
}

function scoreColor(score: number): string {
  if (score >= 70) return "text-emerald-600";
  if (score >= 40) return "text-amber-600";
  return "text-rose-600";
}

export default function DashboardPage() {
  const [view, setView] = useState<View>("portfolio");
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<string>(allCustomers[0].id);

  return (
    <div className="flex h-screen w-full bg-slate-50 text-slate-900">
      {/* Sidebar */}
      <aside className="hidden w-60 flex-none flex-col border-r border-slate-200 bg-white lg:flex">
        <div className="flex items-center gap-2.5 px-5 py-5 border-b border-slate-200">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-navy-900 text-white">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div className="leading-tight">
            <div className="text-[14px] font-semibold text-slate-900">Portfolio Risk</div>
            <div className="text-[10px] uppercase tracking-wider text-slate-500">Credit scorecard</div>
          </div>
        </div>
        <nav className="flex-1 space-y-0.5 px-3 py-3 text-sm">
          {navItems.map((item) => (
            <button
              key={item.key}
              type="button"
              onClick={() => setView(item.key)}
              className={cn(
                "flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-sm transition",
                view === item.key
                  ? "bg-navy-900 text-white"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
              )}
            >
              <item.icon className="h-4 w-4" />
              <span className="flex-1 text-left">{item.label}</span>
            </button>
          ))}
        </nav>
        <div className="border-t border-slate-200 px-5 py-4">
          <div className="text-[10px] uppercase tracking-wider text-slate-500">Refreshed</div>
          <div className="mt-0.5 text-[13px] font-semibold text-slate-900">{portfolioStats.refreshedAt}</div>
          <div className="mt-1 text-[11px] text-slate-500">Weekly snapshot</div>
        </div>
      </aside>

      {/* Main column */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Top bar */}
        <header className="flex items-center gap-4 border-b border-slate-200 bg-white px-6 py-3.5">
          <div className="flex flex-1 items-center max-w-xl">
            <div className="relative w-full">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search customers, industries, IDs…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-navy-500"
              />
            </div>
          </div>
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-lg bg-navy-900 px-3 py-2 text-[12px] font-semibold text-white transition hover:bg-navy-800"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Refresh
          </button>
        </header>

        {/* Body */}
        {view === "portfolio" ? (
          <PortfolioView
            customers={allCustomers}
            selectedId={selectedId}
            setSelectedId={setSelectedId}
            search={search}
          />
        ) : view === "watchlist" ? (
          <WatchlistView
            customers={allCustomers.filter((c) => c.tier !== "green")}
            selectedId={selectedId}
            setSelectedId={setSelectedId}
            search={search}
          />
        ) : view === "reports" ? (
          <ReportsView />
        ) : (
          <SettingsView />
        )}
      </div>
    </div>
  );
}

/* ---------------- Portfolio view ---------------- */

function PortfolioView({
  customers,
  selectedId,
  setSelectedId,
  search,
}: {
  customers: Customer[];
  selectedId: string;
  setSelectedId: (id: string) => void;
  search: string;
}) {
  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-auto">
      <div className="border-b border-slate-200 bg-white px-7 py-6">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Portfolio</h1>
        <p className="mt-1 text-sm text-slate-500">{customers.length} customers · refreshed weekly</p>

        <div className="mt-5 grid gap-3 md:grid-cols-2 lg:grid-cols-4">
          <KpiCard label="Avg portfolio score" value={`${portfolioStats.avgScore}`} hint="Weighted across 10 categories" accent="navy" />
          <KpiCard label="Total exposure" value={fmtMoney(portfolioStats.totalExposure)} hint={`${portfolioStats.totalCustomers} customers`} />
          <KpiCard label="At-risk" value={portfolioStats.tierCounts.red + portfolioStats.tierCounts.yellow} hint={`${portfolioStats.tierCounts.red} red · ${portfolioStats.tierCounts.yellow} yellow`} accent="rose" />
          <KpiCard label="Avg past due" value={`${portfolioStats.avgPastDue.toFixed(1)}%`} hint="Across all open invoices" accent="amber" />
        </div>
      </div>

      <ListAndDetail
        customers={customers}
        selectedId={selectedId}
        setSelectedId={setSelectedId}
        search={search}
      />
    </div>
  );
}

/* ---------------- Watchlist view ---------------- */

function WatchlistView({
  customers,
  selectedId,
  setSelectedId,
  search,
}: {
  customers: Customer[];
  selectedId: string;
  setSelectedId: (id: string) => void;
  search: string;
}) {
  // ensure selection is in this filtered list
  const fallbackSelected = customers.find((c) => c.id === selectedId) ? selectedId : customers[0]?.id ?? "";
  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-auto">
      <div className="border-b border-slate-200 bg-white px-7 py-6">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Watchlist</h1>
        <p className="mt-1 text-sm text-slate-500">Customers in red or yellow tier · {customers.length} total</p>
      </div>
      <ListAndDetail
        customers={customers}
        selectedId={fallbackSelected}
        setSelectedId={setSelectedId}
        search={search}
      />
    </div>
  );
}

/* ---------------- List + Detail split ---------------- */

function ListAndDetail({
  customers,
  selectedId,
  setSelectedId,
  search,
}: {
  customers: Customer[];
  selectedId: string;
  setSelectedId: (id: string) => void;
  search: string;
}) {
  const filtered = useMemo(() => {
    const sorted = [...customers].sort((a, b) => a.overall - b.overall);
    if (!search) return sorted;
    const q = search.toLowerCase();
    return sorted.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.industry.toLowerCase().includes(q) ||
        c.id.toLowerCase().includes(q),
    );
  }, [customers, search]);

  const selected = filtered.find((c) => c.id === selectedId) ?? customers.find((c) => c.id === selectedId) ?? customers[0];

  return (
    <div className="grid min-h-0 flex-1 grid-cols-1 lg:grid-cols-[420px_1fr]">
      {/* List */}
      <div className="flex min-h-0 flex-col border-r border-slate-200 bg-white">
        <div className="border-b border-slate-200 px-5 py-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
          Customers · sorted by score (low to high)
        </div>
        <div className="flex-1 overflow-auto">
          {filtered.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setSelectedId(c.id)}
              className={cn(
                "block w-full border-b border-slate-100 px-5 py-3.5 text-left transition",
                selected?.id === c.id ? "bg-slate-50" : "hover:bg-slate-50/60",
              )}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono text-slate-500">{c.id}</span>
                    <span className="text-[10px] uppercase tracking-wider text-slate-500">{c.industry}</span>
                  </div>
                  <div className="mt-1 truncate text-sm font-semibold text-slate-900">{c.name}</div>
                  <div className="mt-2 flex items-center gap-2">
                    <TierPill tier={c.tier} />
                    <TrendIndicator delta={c.weeklyDelta} />
                  </div>
                </div>
                <div className="text-right">
                  <div className={cn("text-2xl font-semibold tabular-nums", scoreColor(c.overall))}>
                    {c.overall}
                  </div>
                  <div className="text-[10px] uppercase tracking-wider text-slate-500">/100</div>
                </div>
              </div>
            </button>
          ))}
          {filtered.length === 0 ? (
            <div className="px-5 py-8 text-center text-xs text-slate-500">No customers match this search.</div>
          ) : null}
        </div>
      </div>

      {/* Detail */}
      {selected ? <CustomerDetail customer={selected} /> : null}
    </div>
  );
}

/* ---------------- Customer Detail ---------------- */

function CustomerDetail({ customer }: { customer: Customer }) {
  return (
    <div className="flex min-h-0 flex-col overflow-auto bg-slate-50">
      <div className="border-b border-slate-200 bg-white px-7 py-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2 text-[11px] uppercase tracking-wider text-slate-500">
              <span className="font-mono text-slate-600">{customer.id}</span>
              <span>·</span>
              <span>{customer.industry}</span>
              <span>·</span>
              <span>{customer.contractType}</span>
            </div>
            <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900">{customer.name}</h1>
            <div className="mt-1 text-sm text-slate-500">
              {customer.tenureYears.toFixed(1)} yrs on program · {customer.enrolled.toLocaleString()} enrolled
            </div>
          </div>
          <TierPill tier={customer.tier} size="md" />
        </div>

        {/* Score block */}
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          <div className="md:col-span-2 rounded-xl border border-navy-200 bg-navy-50/50 p-5">
            <div className="flex items-end justify-between gap-3">
              <div>
                <div className="text-[11px] font-semibold uppercase tracking-wider text-navy-700">Overall risk score</div>
                <div className="mt-1 flex items-baseline gap-2">
                  <span className={cn("text-5xl font-semibold tabular-nums", scoreColor(customer.overall))}>
                    {customer.overall}
                  </span>
                  <span className="text-lg text-slate-400">/ 100</span>
                  <TrendIndicator delta={customer.weeklyDelta} />
                </div>
              </div>
              <div className="text-right">
                <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">12-week trend</div>
                <div className="mt-1 text-navy-700">
                  <Sparkline data={customer.history} height={40} width={140} />
                </div>
              </div>
            </div>
            <div className="mt-4">
              <OverallScoreBar score={customer.overall} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <MiniStat label="Exposure" value={fmtMoney(customer.exposure)} />
            <MiniStat label="Past due" value={`${customer.pastDuePct.toFixed(1)}%`} tone={customer.pastDuePct > 10 ? "rose" : customer.pastDuePct > 5 ? "amber" : "slate"} />
            <MiniStat label="Tenure" value={`${customer.tenureYears.toFixed(1)} yrs`} />
            <MiniStat label="Enrolled" value={customer.enrolled.toLocaleString()} />
          </div>
        </div>
      </div>

      <div className="grid gap-5 px-7 py-6 md:grid-cols-3">
        <div className="md:col-span-2">
          <div className="rounded-xl border border-slate-200 bg-white p-5">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-slate-900">Risk categories</h2>
              <span className="text-[11px] text-slate-500">10 categories · weighted</span>
            </div>
            <div className="space-y-3.5">
              {categoryDefs.map((cat) => {
                const score = customer.scores[cat.key];
                return (
                  <div key={cat.key}>
                    <div className="flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <div className="text-[13px] font-semibold text-slate-900">{cat.label}</div>
                        <div className="text-[11px] text-slate-500">{cat.hint} · weight {(cat.weight * 100).toFixed(0)}%</div>
                      </div>
                      <div className="flex flex-none items-baseline gap-1 text-slate-900">
                        <span className="text-base font-semibold tabular-nums">{score}</span>
                        <span className="text-[11px] text-slate-400">/10</span>
                      </div>
                    </div>
                    <div className="mt-1.5">
                      <ScoreBar score={score} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="space-y-5">
          <div className="rounded-xl border border-slate-200 bg-white p-5">
            <h2 className="text-sm font-semibold text-slate-900">Notes</h2>
            <p className="mt-2 text-[13px] leading-relaxed text-slate-700">{customer.notes}</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-5">
            <h2 className="text-sm font-semibold text-slate-900">Next action</h2>
            <p className="mt-2 text-[13px] leading-relaxed text-slate-700">{nextAction(customer.tier)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function MiniStat({
  label,
  value,
  tone = "slate",
}: {
  label: string;
  value: string;
  tone?: "slate" | "amber" | "rose";
}) {
  const valueColor =
    tone === "rose" ? "text-rose-600" : tone === "amber" ? "text-amber-600" : "text-slate-900";
  return (
    <div className="rounded-lg border border-slate-200 bg-white px-3 py-2.5">
      <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">{label}</div>
      <div className={cn("mt-1 text-base font-semibold", valueColor)}>{value}</div>
    </div>
  );
}

function nextAction(tier: Tier): string {
  if (tier === "red") return "Escalate to credit committee. Reduce exposure where possible and require updated forecasts before next billing cycle.";
  if (tier === "yellow") return "Schedule a review call. Watch past-due aging and forecast variance for two more weeks.";
  return "No action required. Customer is performing within expected bands.";
}

/* ---------------- Reports view ---------------- */

function ReportsView() {
  const totalCust = portfolioStats.totalCustomers;
  const greenPct = (portfolioStats.tierCounts.green / totalCust) * 100;
  const yellowPct = (portfolioStats.tierCounts.yellow / totalCust) * 100;
  const redPct = (portfolioStats.tierCounts.red / totalCust) * 100;

  // industry breakdown
  const byIndustry = useMemo(() => {
    const map = new Map<string, { count: number; sum: number; exposure: number }>();
    for (const c of allCustomers) {
      const e = map.get(c.industry) ?? { count: 0, sum: 0, exposure: 0 };
      e.count += 1;
      e.sum += c.overall;
      e.exposure += c.exposure;
      map.set(c.industry, e);
    }
    return Array.from(map.entries())
      .map(([industry, v]) => ({ industry, count: v.count, avg: Math.round(v.sum / v.count), exposure: v.exposure }))
      .sort((a, b) => a.avg - b.avg);
  }, []);

  // top concerns (lowest 5)
  const concerns = useMemo(() => [...allCustomers].sort((a, b) => a.overall - b.overall).slice(0, 5), []);

  // portfolio history (avg per week)
  const portfolioHistory = useMemo(() => {
    const len = allCustomers[0].history.length;
    return Array.from({ length: len }, (_, i) => {
      const sum = allCustomers.reduce((s, c) => s + c.history[i], 0);
      return Math.round(sum / allCustomers.length);
    });
  }, []);

  return (
    <div className="flex-1 overflow-auto">
      <div className="mx-auto max-w-6xl px-7 py-8">
        <header className="mb-6">
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Board snapshot</h1>
          <p className="mt-1 text-sm text-slate-500">Week of {portfolioStats.refreshedAt}</p>
        </header>

        <div className="grid gap-3 md:grid-cols-4">
          <KpiCard label="Avg score" value={portfolioStats.avgScore} hint="Portfolio weighted" accent="navy" />
          <KpiCard label="Customers" value={portfolioStats.totalCustomers} />
          <KpiCard label="Exposure" value={fmtMoney(portfolioStats.totalExposure)} />
          <KpiCard label="Avg past due" value={`${portfolioStats.avgPastDue.toFixed(1)}%`} accent="amber" />
        </div>

        <div className="mt-6 grid gap-5 lg:grid-cols-3">
          {/* Tier distribution */}
          <div className="rounded-xl border border-slate-200 bg-white p-5 lg:col-span-2">
            <h2 className="text-sm font-semibold text-slate-900">Tier distribution</h2>
            <div className="mt-4 flex h-8 w-full overflow-hidden rounded-md ring-1 ring-slate-200">
              <div className="bg-emerald-500 transition-all" style={{ width: `${greenPct}%` }} />
              <div className="bg-amber-500 transition-all" style={{ width: `${yellowPct}%` }} />
              <div className="bg-rose-500 transition-all" style={{ width: `${redPct}%` }} />
            </div>
            <div className="mt-3 grid grid-cols-3 gap-3 text-[12px]">
              <TierLegend dot="bg-emerald-500" label="Green" count={portfolioStats.tierCounts.green} pct={greenPct} />
              <TierLegend dot="bg-amber-500" label="Yellow" count={portfolioStats.tierCounts.yellow} pct={yellowPct} />
              <TierLegend dot="bg-rose-500" label="Red" count={portfolioStats.tierCounts.red} pct={redPct} />
            </div>
          </div>

          {/* Portfolio history */}
          <div className="rounded-xl border border-slate-200 bg-white p-5">
            <h2 className="text-sm font-semibold text-slate-900">Portfolio score · 12 weeks</h2>
            <div className="mt-3 flex items-end justify-between gap-2">
              <div>
                <div className={cn("text-3xl font-semibold tabular-nums", scoreColor(portfolioStats.avgScore))}>
                  {portfolioHistory[portfolioHistory.length - 1]}
                </div>
                <div className="text-[11px] text-slate-500">latest avg</div>
              </div>
              <div className="text-navy-700">
                <Sparkline data={portfolioHistory} height={40} width={140} />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-5 lg:grid-cols-2">
          {/* Top concerns */}
          <div className="rounded-xl border border-slate-200 bg-white p-5">
            <h2 className="text-sm font-semibold text-slate-900">Top concerns</h2>
            <p className="mt-1 text-[12px] text-slate-500">Five lowest scores in the portfolio</p>
            <ul className="mt-4 divide-y divide-slate-100">
              {concerns.map((c) => (
                <li key={c.id} className="flex items-center justify-between gap-3 py-2.5">
                  <div className="min-w-0">
                    <div className="text-[13px] font-semibold text-slate-900">{c.name}</div>
                    <div className="text-[11px] text-slate-500">{c.industry} · {fmtMoney(c.exposure)} exposure</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <TierPill tier={c.tier} />
                    <div className={cn("text-lg font-semibold tabular-nums", scoreColor(c.overall))}>{c.overall}</div>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Industry breakdown */}
          <div className="rounded-xl border border-slate-200 bg-white p-5">
            <h2 className="text-sm font-semibold text-slate-900">Average score by industry</h2>
            <p className="mt-1 text-[12px] text-slate-500">Lowest first</p>
            <ul className="mt-4 divide-y divide-slate-100">
              {byIndustry.map((row) => (
                <li key={row.industry} className="flex items-center justify-between gap-3 py-2.5">
                  <div className="flex items-center gap-2">
                    <Building2 className="h-3.5 w-3.5 text-slate-400" />
                    <span className="text-[13px] font-semibold text-slate-900">{row.industry}</span>
                    <span className="text-[11px] text-slate-500">· {row.count} cust.</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[11px] text-slate-500">{fmtMoney(row.exposure)}</span>
                    <span className={cn("text-lg font-semibold tabular-nums", scoreColor(row.avg))}>{row.avg}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-6 rounded-xl border border-slate-200 bg-white p-5">
          <h2 className="text-sm font-semibold text-slate-900">Category averages</h2>
          <p className="mt-1 text-[12px] text-slate-500">Portfolio-wide average per category (1-10)</p>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {categoryAverages.map((cat) => (
              <div key={cat.key}>
                <div className="flex items-baseline justify-between gap-3">
                  <span className="text-[13px] font-semibold text-slate-900">{cat.label}</span>
                  <span className="text-[12px] tabular-nums text-slate-700">{cat.avg.toFixed(1)} <span className="text-slate-400">/10</span></span>
                </div>
                <div className="mt-1.5">
                  <ScoreBar score={cat.avg} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function TierLegend({
  dot,
  label,
  count,
  pct,
}: {
  dot: string;
  label: string;
  count: number;
  pct: number;
}) {
  return (
    <div className="flex items-center gap-2">
      <span className={cn("h-2 w-2 flex-none rounded-full", dot)} />
      <div className="leading-tight">
        <div className="text-[12px] font-semibold text-slate-900">{label}</div>
        <div className="text-[11px] text-slate-500">{count} · {pct.toFixed(0)}%</div>
      </div>
    </div>
  );
}

/* ---------------- Settings view ---------------- */

function SettingsView() {
  const [redCutoff, setRedCutoff] = useState(40);
  const [greenCutoff, setGreenCutoff] = useState(70);
  const [refreshDay, setRefreshDay] = useState("Monday");

  return (
    <div className="flex-1 overflow-auto">
      <div className="mx-auto max-w-3xl px-7 py-8 space-y-6">
        <header>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Settings</h1>
          <p className="mt-1 text-sm text-slate-500">Thresholds, weights, and refresh schedule.</p>
        </header>

        <section className="rounded-xl border border-slate-200 bg-white">
          <div className="border-b border-slate-200 px-5 py-4">
            <h2 className="text-sm font-semibold text-slate-900">Tier thresholds</h2>
            <p className="mt-1 text-[12px] text-slate-500">Cutoffs on the 0-100 overall score.</p>
          </div>
          <div className="grid gap-4 px-5 py-4 md:grid-cols-2">
            <ThresholdField
              label="Red below"
              value={redCutoff}
              onChange={setRedCutoff}
              tone="rose"
              hint={`Below ${redCutoff} → Red`}
            />
            <ThresholdField
              label="Green at or above"
              value={greenCutoff}
              onChange={setGreenCutoff}
              tone="green"
              hint={`At or above ${greenCutoff} → Green; in between → Yellow`}
            />
          </div>
        </section>

        <section className="rounded-xl border border-slate-200 bg-white">
          <div className="border-b border-slate-200 px-5 py-4">
            <h2 className="text-sm font-semibold text-slate-900">Category weights</h2>
            <p className="mt-1 text-[12px] text-slate-500">Sum to 100% — used in the weighted overall score.</p>
          </div>
          <ul className="divide-y divide-slate-100">
            {categoryDefs.map((cat) => (
              <li key={cat.key} className="flex items-center justify-between gap-3 px-5 py-3">
                <div className="min-w-0">
                  <div className="text-[13.5px] font-semibold text-slate-900">{cat.label}</div>
                  <div className="text-[12px] text-slate-500">{cat.hint}</div>
                </div>
                <div className="flex items-center gap-1.5 rounded-md border border-slate-200 px-2.5 py-1 font-mono text-[12px] text-slate-800">
                  {(cat.weight * 100).toFixed(0)}%
                  <ChevronRight className="h-3 w-3 text-slate-400" />
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-xl border border-slate-200 bg-white">
          <div className="border-b border-slate-200 px-5 py-4">
            <h2 className="text-sm font-semibold text-slate-900">Refresh schedule</h2>
            <p className="mt-1 text-[12px] text-slate-500">Day of week the scorecard recomputes.</p>
          </div>
          <div className="px-5 py-4">
            <div className="flex flex-wrap gap-2">
              {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"].map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setRefreshDay(d)}
                  className={cn(
                    "rounded-md px-3 py-1.5 text-[12px] font-semibold transition",
                    refreshDay === d
                      ? "bg-navy-900 text-white"
                      : "border border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50",
                  )}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

function ThresholdField({
  label,
  value,
  onChange,
  tone,
  hint,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  tone: "rose" | "green";
  hint: string;
}) {
  const ringColor = tone === "rose" ? "border-rose-200" : "border-emerald-200";
  return (
    <div className={cn("rounded-lg border bg-white p-4", ringColor)}>
      <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">{label}</div>
      <div className="mt-2 flex items-center gap-2">
        <input
          type="number"
          min={0}
          max={100}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-20 rounded-md border border-slate-200 bg-white px-2 py-1 text-base font-semibold tabular-nums text-slate-900 outline-none focus:border-navy-500"
        />
        <span className="text-[12px] text-slate-500">/ 100</span>
      </div>
      <div className="mt-2 text-[11px] text-slate-500">{hint}</div>
    </div>
  );
}

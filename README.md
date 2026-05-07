# Portfolio Credit Risk

Portfolio-wide credit risk dashboard. Each customer is scored across 10 categories (1–10), rolled up into a 0–100 overall score and a Green / Yellow / Red tier. Refreshed weekly. Built for early intervention, cash forecasting, board reporting, and pre-contract diligence.

- `/` — single-page dashboard (no landing page)

## Risk categories

1. Payment Timeliness (15%)
2. Exposure Level (10%)
3. Past Due Trend (12%)
4. Enrollment Trends (8%)
5. Customer Type (5%)
6. Operational Maturity (10%)
7. Tenure on Program (8%)
8. Stability Indicators (12%)
9. Behavioral Risk Flags (12%)
10. Forecast Reliability (8%)

Weighted average × 10 → 0–100 score. Default tier cutoffs: ≥70 Green, 40–69 Yellow, <40 Red. All editable in **Settings**.

## Views

- **Portfolio** — all customers with KPIs, list (sorted low→high), and detail pane with category breakdown + 12-week trend.
- **Watchlist** — same UX, filtered to Yellow + Red.
- **Reports** — board-level snapshot: tier distribution, portfolio score trend, top concerns, score by industry, category averages.
- **Settings** — tier thresholds, category weights, refresh day.

## Stack

- Next.js 14 (App Router) + TypeScript strict
- Tailwind CSS, Inter (next/font/google)
- lucide-react for iconography
- Pure-SVG sparklines, no chart library

## Deploy

Push to GitHub, import into Vercel, free tier covers it.

```bash
pnpm install
pnpm build
```

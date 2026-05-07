export type Tier = "green" | "yellow" | "red";

export type CategoryDef = {
  key: CategoryKey;
  label: string;
  weight: number;
  hint: string;
};

export type CategoryKey =
  | "payment-timeliness"
  | "exposure-level"
  | "past-due-trend"
  | "enrollment-trends"
  | "customer-type"
  | "operational-maturity"
  | "tenure-on-program"
  | "stability-indicators"
  | "behavioral-risk-flags"
  | "forecast-reliability";

export const categoryDefs: CategoryDef[] = [
  { key: "payment-timeliness", label: "Payment Timeliness", weight: 0.15, hint: "On-time payment rate and days-to-pay" },
  { key: "exposure-level", label: "Exposure Level", weight: 0.10, hint: "Share of portfolio and concentration" },
  { key: "past-due-trend", label: "Past Due Trend", weight: 0.12, hint: "Direction of aging buckets" },
  { key: "enrollment-trends", label: "Enrollment Trends", weight: 0.08, hint: "Net account growth or decline" },
  { key: "customer-type", label: "Customer Type", weight: 0.05, hint: "Industry risk profile" },
  { key: "operational-maturity", label: "Operational Maturity", weight: 0.10, hint: "Process readiness, internal controls" },
  { key: "tenure-on-program", label: "Tenure on Program", weight: 0.08, hint: "Years as customer" },
  { key: "stability-indicators", label: "Stability Indicators", weight: 0.12, hint: "Revenue and headcount volatility" },
  { key: "behavioral-risk-flags", label: "Behavioral Risk Flags", weight: 0.12, hint: "Disputes, NSFs, escalations" },
  { key: "forecast-reliability", label: "Forecast Reliability", weight: 0.08, hint: "Variance vs. submitted forecasts" },
];

export type CustomerRaw = {
  id: string;
  name: string;
  industry: string;
  enrolled: number;
  exposure: number;
  tenureYears: number;
  contractType: "Annual" | "Multi-year" | "Month-to-month";
  pastDuePct: number;
  weeklyDelta: number;
  scores: Record<CategoryKey, number>;
  history: number[];
  notes: string;
};

export type Customer = CustomerRaw & {
  overall: number;
  tier: Tier;
};

const customersRaw: CustomerRaw[] = [
  {
    id: "CST-0001",
    name: "Apex Industrial Holdings",
    industry: "Manufacturing",
    enrolled: 248,
    exposure: 2_400_000,
    tenureYears: 4.2,
    contractType: "Multi-year",
    pastDuePct: 1.2,
    weeklyDelta: 2,
    scores: {
      "payment-timeliness": 9,
      "exposure-level": 8,
      "past-due-trend": 9,
      "enrollment-trends": 8,
      "customer-type": 8,
      "operational-maturity": 9,
      "tenure-on-program": 9,
      "stability-indicators": 8,
      "behavioral-risk-flags": 9,
      "forecast-reliability": 8,
    },
    history: [80, 82, 81, 83, 84, 83, 84, 85, 84, 85, 86, 86],
    notes: "Strong, consistent payer. Slight enrollment uptick this quarter. No flags.",
  },
  {
    id: "CST-0002",
    name: "Northwind Manufacturing Co",
    industry: "Manufacturing",
    enrolled: 142,
    exposure: 1_800_000,
    tenureYears: 3.1,
    contractType: "Annual",
    pastDuePct: 8.4,
    weeklyDelta: -4,
    scores: {
      "payment-timeliness": 5,
      "exposure-level": 6,
      "past-due-trend": 4,
      "enrollment-trends": 5,
      "customer-type": 7,
      "operational-maturity": 6,
      "tenure-on-program": 7,
      "stability-indicators": 5,
      "behavioral-risk-flags": 5,
      "forecast-reliability": 6,
    },
    history: [68, 66, 65, 64, 62, 61, 60, 58, 58, 57, 55, 54],
    notes: "Past-due rate climbing. Recent dispute on invoice #N-4421. Schedule QBR.",
  },
  {
    id: "CST-0003",
    name: "Brightpath Healthcare Group",
    industry: "Healthcare",
    enrolled: 412,
    exposure: 3_100_000,
    tenureYears: 5.4,
    contractType: "Multi-year",
    pastDuePct: 0.4,
    weeklyDelta: 1,
    scores: {
      "payment-timeliness": 10,
      "exposure-level": 9,
      "past-due-trend": 10,
      "enrollment-trends": 9,
      "customer-type": 9,
      "operational-maturity": 9,
      "tenure-on-program": 9,
      "stability-indicators": 9,
      "behavioral-risk-flags": 9,
      "forecast-reliability": 9,
    },
    history: [90, 91, 92, 91, 92, 92, 93, 92, 93, 93, 92, 93],
    notes: "Anchor account. Predictable cash flow. Candidate for tier upgrade.",
  },
  {
    id: "CST-0004",
    name: "Cedar Ridge Construction",
    industry: "Construction",
    enrolled: 64,
    exposure: 1_200_000,
    tenureYears: 2.8,
    contractType: "Annual",
    pastDuePct: 11.2,
    weeklyDelta: -3,
    scores: {
      "payment-timeliness": 4,
      "exposure-level": 5,
      "past-due-trend": 4,
      "enrollment-trends": 6,
      "customer-type": 5,
      "operational-maturity": 5,
      "tenure-on-program": 7,
      "stability-indicators": 4,
      "behavioral-risk-flags": 5,
      "forecast-reliability": 5,
    },
    history: [60, 58, 57, 56, 55, 53, 52, 52, 51, 50, 49, 49],
    notes: "Seasonal volatility worsening. Engage on Q3 forecast accuracy.",
  },
  {
    id: "CST-0005",
    name: "Meridian Logistics",
    industry: "Logistics",
    enrolled: 198,
    exposure: 1_900_000,
    tenureYears: 4.8,
    contractType: "Multi-year",
    pastDuePct: 2.1,
    weeklyDelta: 0,
    scores: {
      "payment-timeliness": 8,
      "exposure-level": 7,
      "past-due-trend": 8,
      "enrollment-trends": 9,
      "customer-type": 7,
      "operational-maturity": 8,
      "tenure-on-program": 9,
      "stability-indicators": 8,
      "behavioral-risk-flags": 9,
      "forecast-reliability": 7,
    },
    history: [80, 81, 80, 82, 81, 80, 81, 81, 82, 81, 81, 81],
    notes: "Stable. No action required.",
  },
  {
    id: "CST-0006",
    name: "Summit Data Systems",
    industry: "Technology",
    enrolled: 88,
    exposure: 850_000,
    tenureYears: 1.4,
    contractType: "Annual",
    pastDuePct: 0.8,
    weeklyDelta: 5,
    scores: {
      "payment-timeliness": 9,
      "exposure-level": 7,
      "past-due-trend": 9,
      "enrollment-trends": 10,
      "customer-type": 9,
      "operational-maturity": 9,
      "tenure-on-program": 6,
      "stability-indicators": 8,
      "behavioral-risk-flags": 8,
      "forecast-reliability": 8,
    },
    history: [70, 72, 73, 74, 76, 77, 79, 80, 81, 81, 82, 83],
    notes: "Rapid growth, now mid-size. Watch operational maturity as scale increases.",
  },
  {
    id: "CST-0007",
    name: "Polaris Restaurant Group",
    industry: "Hospitality",
    enrolled: 56,
    exposure: 1_400_000,
    tenureYears: 3.6,
    contractType: "Annual",
    pastDuePct: 24.8,
    weeklyDelta: -7,
    scores: {
      "payment-timeliness": 2,
      "exposure-level": 4,
      "past-due-trend": 2,
      "enrollment-trends": 2,
      "customer-type": 4,
      "operational-maturity": 3,
      "tenure-on-program": 5,
      "stability-indicators": 2,
      "behavioral-risk-flags": 3,
      "forecast-reliability": 3,
    },
    history: [60, 57, 53, 50, 46, 42, 39, 36, 33, 31, 29, 28],
    notes: "Material distress signals: 24.8% past due, repeated NSFs, late forecast submissions. Escalate to credit committee.",
  },
  {
    id: "CST-0008",
    name: "Riverstone Realty Partners",
    industry: "Real Estate",
    enrolled: 41,
    exposure: 640_000,
    tenureYears: 2.1,
    contractType: "Annual",
    pastDuePct: 7.4,
    weeklyDelta: -1,
    scores: {
      "payment-timeliness": 5,
      "exposure-level": 6,
      "past-due-trend": 5,
      "enrollment-trends": 4,
      "customer-type": 6,
      "operational-maturity": 5,
      "tenure-on-program": 6,
      "stability-indicators": 5,
      "behavioral-risk-flags": 6,
      "forecast-reliability": 5,
    },
    history: [58, 57, 56, 56, 55, 55, 54, 54, 53, 53, 53, 53],
    notes: "Slow drift. Monitor; not urgent.",
  },
  {
    id: "CST-0009",
    name: "Vanguard Energy Solutions",
    industry: "Energy",
    enrolled: 174,
    exposure: 2_100_000,
    tenureYears: 3.9,
    contractType: "Multi-year",
    pastDuePct: 1.8,
    weeklyDelta: 1,
    scores: {
      "payment-timeliness": 8,
      "exposure-level": 7,
      "past-due-trend": 8,
      "enrollment-trends": 7,
      "customer-type": 7,
      "operational-maturity": 8,
      "tenure-on-program": 8,
      "stability-indicators": 8,
      "behavioral-risk-flags": 9,
      "forecast-reliability": 7,
    },
    history: [75, 76, 76, 77, 76, 77, 77, 78, 77, 78, 78, 78],
    notes: "Reliable, large account. Renegotiation window in Q4.",
  },
  {
    id: "CST-0010",
    name: "Harbor Foods Inc",
    industry: "Food Services",
    enrolled: 78,
    exposure: 720_000,
    tenureYears: 2.4,
    contractType: "Month-to-month",
    pastDuePct: 18.6,
    weeklyDelta: -3,
    scores: {
      "payment-timeliness": 3,
      "exposure-level": 5,
      "past-due-trend": 3,
      "enrollment-trends": 3,
      "customer-type": 5,
      "operational-maturity": 4,
      "tenure-on-program": 5,
      "stability-indicators": 3,
      "behavioral-risk-flags": 4,
      "forecast-reliability": 4,
    },
    history: [50, 48, 47, 46, 45, 43, 42, 41, 40, 39, 39, 38],
    notes: "Multiple short-pay events in last 60 days. Site visit recommended.",
  },
  {
    id: "CST-0011",
    name: "Pinecrest Industrial",
    industry: "Manufacturing",
    enrolled: 52,
    exposure: 560_000,
    tenureYears: 1.9,
    contractType: "Annual",
    pastDuePct: 5.2,
    weeklyDelta: -2,
    scores: {
      "payment-timeliness": 6,
      "exposure-level": 6,
      "past-due-trend": 5,
      "enrollment-trends": 6,
      "customer-type": 7,
      "operational-maturity": 5,
      "tenure-on-program": 5,
      "stability-indicators": 6,
      "behavioral-risk-flags": 6,
      "forecast-reliability": 6,
    },
    history: [65, 64, 63, 62, 62, 61, 60, 60, 59, 58, 58, 58],
    notes: "Smaller account, slipping. Relationship manager engaged.",
  },
  {
    id: "CST-0012",
    name: "Kestrel Manufacturing",
    industry: "Manufacturing",
    enrolled: 38,
    exposure: 480_000,
    tenureYears: 1.6,
    contractType: "Month-to-month",
    pastDuePct: 16.4,
    weeklyDelta: -5,
    scores: {
      "payment-timeliness": 3,
      "exposure-level": 4,
      "past-due-trend": 3,
      "enrollment-trends": 4,
      "customer-type": 6,
      "operational-maturity": 4,
      "tenure-on-program": 4,
      "stability-indicators": 3,
      "behavioral-risk-flags": 3,
      "forecast-reliability": 4,
    },
    history: [55, 53, 50, 47, 44, 42, 41, 40, 38, 37, 36, 36],
    notes: "Operational instability — recent leadership change. Reduce exposure.",
  },
];

export function computeOverall(scores: Record<CategoryKey, number>): number {
  const total = categoryDefs.reduce((sum, cat) => sum + scores[cat.key] * cat.weight, 0);
  return Math.round(total * 10);
}

export function tierFromScore(s: number): Tier {
  if (s >= 70) return "green";
  if (s >= 40) return "yellow";
  return "red";
}

export const customers: Customer[] = customersRaw.map((c) => {
  const overall = computeOverall(c.scores);
  return { ...c, overall, tier: tierFromScore(overall) };
});

export const portfolioStats = {
  totalCustomers: customers.length,
  totalExposure: customers.reduce((s, c) => s + c.exposure, 0),
  avgScore: Math.round(customers.reduce((s, c) => s + c.overall, 0) / customers.length),
  tierCounts: {
    green: customers.filter((c) => c.tier === "green").length,
    yellow: customers.filter((c) => c.tier === "yellow").length,
    red: customers.filter((c) => c.tier === "red").length,
  },
  avgPastDue:
    customers.reduce((s, c) => s + c.pastDuePct, 0) / customers.length,
  refreshedAt: "2026-05-04",
};

export const categoryAverages = categoryDefs.map((cat) => {
  const avg =
    customers.reduce((s, c) => s + c.scores[cat.key], 0) / customers.length;
  return { ...cat, avg: Math.round(avg * 10) / 10 };
});

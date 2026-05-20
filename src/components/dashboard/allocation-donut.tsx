import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { formatPercent, formatUsd } from "@/lib/format";
import type { TokenBalance } from "@/types/token";

type AllocationDonutProps = {
  tokens: TokenBalance[];
};

const COLORS = ["#0f766e", "#2563eb", "#e11d48", "#ca8a04", "#7c3aed", "#0891b2"];

export default function AllocationDonut({ tokens }: AllocationDonutProps) {
  const chartData = tokens.map((token) => ({
    name: token.symbol,
    value: token.valueUsd,
    allocationPercent: token.allocationPercent,
  }));

  return (
    <div className="relative h-64 w-full">
      <ResponsiveContainer height="100%" width="100%">
        <PieChart>
          <Pie
            cx="50%"
            cy="50%"
            data={chartData}
            dataKey="value"
            innerRadius="58%"
            nameKey="name"
            outerRadius="82%"
            paddingAngle={2}
            stroke="transparent"
          >
            {chartData.map((entry, index) => (
              <Cell fill={COLORS[index % COLORS.length]} key={entry.name} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value, name) => [formatUsd(Number(value)), String(name)]}
            labelFormatter={(label) => `${label} allocation`}
          />
        </PieChart>
      </ResponsiveContainer>
      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
        <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Top asset</p>
        <p className="mt-1 text-lg font-semibold">{tokens[0]?.symbol ?? "N/A"}</p>
        <p className="text-sm text-muted-foreground">{formatPercent(tokens[0]?.allocationPercent ?? 0)}</p>
      </div>
    </div>
  );
}

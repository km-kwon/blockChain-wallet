import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { formatCompactNumber, formatUsd } from "@/lib/format";
import type { WalletValuePoint } from "@/types/wallet";

type ValueChartProps = {
  data: WalletValuePoint[];
};

export default function ValueChart({ data }: ValueChartProps) {
  return (
    <section className="rounded-lg border bg-white/75 p-5 shadow-sm dark:bg-slate-950/60">
      <div>
        <h2 className="text-xl font-semibold tracking-tight">Value History</h2>
        <p className="mt-1 text-sm text-muted-foreground">Seven-day movement across tokens and NFTs.</p>
      </div>
      <div className="mt-5 h-72">
        <ResponsiveContainer height="100%" width="100%">
          <AreaChart data={data} margin={{ bottom: 0, left: 0, right: 4, top: 10 }}>
            <defs>
              <linearGradient id="valueGradient" x1="0" x2="0" y1="0" y2="1">
                <stop offset="5%" stopColor="#0f766e" stopOpacity={0.32} />
                <stop offset="95%" stopColor="#0f766e" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="3 3" vertical={false} />
            <XAxis
              axisLine={false}
              dataKey="date"
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
              tickLine={false}
              tickFormatter={(value) => String(value).slice(5)}
            />
            <YAxis
              axisLine={false}
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
              tickFormatter={(value) => formatCompactNumber(Number(value))}
              tickLine={false}
              width={58}
            />
            <Tooltip
              formatter={(value, name) => [formatUsd(Number(value)), String(name)]}
              labelFormatter={(label) => `Date ${label}`}
            />
            <Area
              activeDot={{ r: 5 }}
              dataKey="valueUsd"
              fill="url(#valueGradient)"
              name="Total value"
              stroke="#0f766e"
              strokeWidth={2}
              type="monotone"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}

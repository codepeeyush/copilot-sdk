"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { type BalanceHistoryPoint } from "@/lib/mock-data/analytics";

interface BalanceChartProps {
  data: BalanceHistoryPoint[];
}

const CHART_COLOR = "#3b82f6";

export function BalanceChart({ data }: BalanceChartProps) {
  const minBalance = Math.min(...data.map((d) => d.balance));
  const maxBalance = Math.max(...data.map((d) => d.balance));
  const padding = (maxBalance - minBalance) * 0.1;

  return (
    <Card className="bg-card border-border/50 shadow-sm">
      <CardHeader className="p-4 pb-0">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-semibold text-foreground">
            Balance History
          </CardTitle>
          <span className="text-xs text-muted-foreground">30 days</span>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-3">
        <div className="h-[180px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{ top: 5, right: 5, left: -15, bottom: 0 }}
            >
              <defs>
                <linearGradient
                  id="balanceGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="0%" stopColor={CHART_COLOR} stopOpacity={0.3} />
                  <stop
                    offset="100%"
                    stopColor={CHART_COLOR}
                    stopOpacity={0.05}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="currentColor"
                strokeOpacity={0.1}
                vertical={false}
              />
              <XAxis
                dataKey="date"
                stroke="currentColor"
                strokeOpacity={0.5}
                fontSize={10}
                tickLine={false}
                axisLine={false}
                interval="preserveStartEnd"
                tick={{ fill: "currentColor", opacity: 0.6 }}
              />
              <YAxis
                stroke="currentColor"
                strokeOpacity={0.5}
                fontSize={10}
                tickLine={false}
                axisLine={false}
                domain={[minBalance - padding, maxBalance + padding]}
                tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
                tick={{ fill: "currentColor", opacity: 0.6 }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--color-card, #1c1c1c)",
                  border: "1px solid var(--color-border, #333)",
                  borderRadius: "8px",
                  padding: "10px",
                  fontSize: "12px",
                  color: "var(--color-foreground, #fff)",
                }}
                labelStyle={{ color: "var(--color-muted-foreground, #888)" }}
                formatter={(value: number) => [
                  `$${value.toLocaleString("en-US", { minimumFractionDigits: 2 })}`,
                  "Balance",
                ]}
              />
              <Area
                type="monotone"
                dataKey="balance"
                stroke={CHART_COLOR}
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#balanceGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

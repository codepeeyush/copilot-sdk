"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { type SpendingByCategory } from "@/lib/mock-data/analytics";

interface SpendingChartProps {
  data: SpendingByCategory[];
}

const COLORS = [
  "#3b82f6",
  "#10b981",
  "#f59e0b",
  "#8b5cf6",
  "#ec4899",
  "#06b6d4",
  "#f97316",
];

export function SpendingChart({ data }: SpendingChartProps) {
  const totalSpending = data.reduce((sum, item) => sum + item.amount, 0);

  return (
    <Card className="bg-card border-border/50 shadow-sm">
      <CardHeader className="p-4 pb-0">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-semibold text-foreground">
            Spending
          </CardTitle>
          <span className="text-xs text-muted-foreground">This month</span>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-3">
        <div className="flex items-center gap-5">
          <div className="h-[150px] w-[150px] relative flex-shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={65}
                  paddingAngle={2}
                  dataKey="amount"
                  stroke="none"
                >
                  {data.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--color-card, #1c1c1c)",
                    border: "1px solid var(--color-border, #333)",
                    borderRadius: "8px",
                    padding: "10px",
                    fontSize: "12px",
                    color: "var(--color-foreground, #fff)",
                  }}
                  formatter={(
                    value: number,
                    name: string,
                    props: { payload?: SpendingByCategory },
                  ) => [
                    `$${value.toLocaleString("en-US", { minimumFractionDigits: 0 })}`,
                    props.payload?.label ?? name,
                  ]}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="text-center">
                <p className="text-lg font-bold text-foreground">
                  ${(totalSpending / 1000).toFixed(1)}k
                </p>
                <p className="text-[10px] text-muted-foreground uppercase">
                  Total
                </p>
              </div>
            </div>
          </div>
          <div className="flex-1 space-y-2">
            {data.slice(0, 5).map((item, index) => (
              <div
                key={item.category}
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <div
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  <span className="text-sm text-foreground">{item.label}</span>
                </div>
                <span className="text-sm font-medium text-foreground">
                  ${item.amount.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

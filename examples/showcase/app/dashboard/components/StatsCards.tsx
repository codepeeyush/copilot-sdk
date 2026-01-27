"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Users,
  UserCheck,
  UserPlus,
  Clock,
  Eye,
  TrendingUp,
} from "lucide-react";
import { analytics } from "@/lib/mock-data/users";

export function StatsCards() {
  const stats = [
    {
      title: "Total Users",
      value: analytics.totalUsers.toLocaleString(),
      icon: Users,
      change: "+12%",
      changeType: "positive" as const,
    },
    {
      title: "Active Users",
      value: analytics.activeUsers.toLocaleString(),
      icon: UserCheck,
      change: "+8%",
      changeType: "positive" as const,
    },
    {
      title: "New This Month",
      value: analytics.newUsersThisMonth.toLocaleString(),
      icon: UserPlus,
      change: "+23%",
      changeType: "positive" as const,
    },
    {
      title: "Avg Session",
      value: analytics.avgSessionDuration,
      icon: Clock,
      change: "+5%",
      changeType: "positive" as const,
    },
    {
      title: "Page Views",
      value: analytics.pageViews.toLocaleString(),
      icon: Eye,
      change: "-3%",
      changeType: "negative" as const,
    },
    {
      title: "Conversion Rate",
      value: analytics.conversionRate,
      icon: TrendingUp,
      change: "+2.1%",
      changeType: "positive" as const,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {stats.map((stat) => (
        <Card
          key={stat.title}
          className="bg-purple-950/20 border-purple-800/30"
        >
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-purple-200 flex items-center justify-between">
              {stat.title}
              <stat.icon className="h-4 w-4 text-purple-400" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stat.value}</div>
            <p
              className={`text-xs mt-1 ${
                stat.changeType === "positive"
                  ? "text-green-400"
                  : "text-red-400"
              }`}
            >
              {stat.change} from last month
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

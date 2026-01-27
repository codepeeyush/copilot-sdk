export interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "user" | "moderator";
  status: "active" | "inactive" | "pending";
  department: string;
  joinDate: string;
  lastActive: string;
  avatar?: string;
}

export const users: User[] = [
  {
    id: "1",
    name: "Sarah Chen",
    email: "sarah.chen@example.com",
    role: "admin",
    status: "active",
    department: "Engineering",
    joinDate: "2023-01-15",
    lastActive: "2024-01-20",
  },
  {
    id: "2",
    name: "Marcus Johnson",
    email: "marcus.j@example.com",
    role: "user",
    status: "active",
    department: "Marketing",
    joinDate: "2023-03-22",
    lastActive: "2024-01-19",
  },
  {
    id: "3",
    name: "Emily Rodriguez",
    email: "emily.r@example.com",
    role: "moderator",
    status: "active",
    department: "Support",
    joinDate: "2023-02-08",
    lastActive: "2024-01-20",
  },
  {
    id: "4",
    name: "David Kim",
    email: "david.kim@example.com",
    role: "user",
    status: "inactive",
    department: "Sales",
    joinDate: "2023-04-11",
    lastActive: "2023-12-15",
  },
  {
    id: "5",
    name: "Lisa Thompson",
    email: "lisa.t@example.com",
    role: "user",
    status: "pending",
    department: "HR",
    joinDate: "2024-01-10",
    lastActive: "2024-01-10",
  },
  {
    id: "6",
    name: "James Wilson",
    email: "james.w@example.com",
    role: "admin",
    status: "active",
    department: "Engineering",
    joinDate: "2022-11-30",
    lastActive: "2024-01-20",
  },
  {
    id: "7",
    name: "Amanda Foster",
    email: "amanda.f@example.com",
    role: "user",
    status: "active",
    department: "Design",
    joinDate: "2023-06-14",
    lastActive: "2024-01-18",
  },
  {
    id: "8",
    name: "Robert Martinez",
    email: "robert.m@example.com",
    role: "moderator",
    status: "active",
    department: "Support",
    joinDate: "2023-05-20",
    lastActive: "2024-01-19",
  },
];

export const departments = [
  "Engineering",
  "Marketing",
  "Support",
  "Sales",
  "HR",
  "Design",
];
export const roles = ["admin", "user", "moderator"] as const;
export const statuses = ["active", "inactive", "pending"] as const;

export const analytics = {
  totalUsers: 1247,
  activeUsers: 892,
  newUsersThisMonth: 156,
  avgSessionDuration: "12m 34s",
  pageViews: 45678,
  bounceRate: "32.5%",
  conversionRate: "4.8%",
};

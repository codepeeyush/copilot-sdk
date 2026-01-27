"use client";

import { useState, useCallback } from "react";
import {
  CopilotProvider,
  useAIContext,
  useTool,
} from "@yourgpt/copilot-sdk/react";
import { CopilotChat } from "@yourgpt/copilot-sdk/ui";
import { DemoLayout } from "@/components/shared/DemoLayout";
import { Sidebar, type DashboardView } from "./components/Sidebar";
import { StatsCards } from "./components/StatsCards";
import { DataTable } from "./components/DataTable";
import { UserForm } from "./components/UserForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  users as initialUsers,
  analytics,
  type User,
  departments,
} from "@/lib/mock-data/users";
import { Download, FileText, Settings, BarChart3 } from "lucide-react";
import "@yourgpt/copilot-sdk/ui/themes/linear.css";

function DashboardContent() {
  const [currentView, setCurrentView] = useState<DashboardView>("overview");
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("All");
  const [editingUser, setEditingUser] = useState<Partial<User> | null>(null);
  const [isCreatingUser, setIsCreatingUser] = useState(false);
  const [lastExport, setLastExport] = useState<string | null>(null);

  // Provide context to AI
  useAIContext({
    key: "dashboard_view",
    data: {
      currentView,
      searchQuery,
      selectedDepartment,
      isEditingUser: !!editingUser,
      isCreatingUser,
    },
    description: "Current dashboard view and filter state",
  });

  useAIContext({
    key: "users_data",
    data: {
      totalUsers: users.length,
      byRole: {
        admin: users.filter((u) => u.role === "admin").length,
        moderator: users.filter((u) => u.role === "moderator").length,
        user: users.filter((u) => u.role === "user").length,
      },
      byStatus: {
        active: users.filter((u) => u.status === "active").length,
        inactive: users.filter((u) => u.status === "inactive").length,
        pending: users.filter((u) => u.status === "pending").length,
      },
      byDepartment: departments.reduce(
        (acc, dept) => {
          acc[dept] = users.filter((u) => u.department === dept).length;
          return acc;
        },
        {} as Record<string, number>,
      ),
    },
    description: "User statistics by role, status, and department",
  });

  useAIContext({
    key: "analytics",
    data: analytics,
    description:
      "Dashboard analytics including page views, conversion rate, etc.",
  });

  // User management functions
  const handleEditUser = useCallback((user: User) => {
    setEditingUser(user);
    setIsCreatingUser(false);
    setCurrentView("users");
  }, []);

  const handleDeleteUser = useCallback((userId: string) => {
    setUsers((prev) => prev.filter((u) => u.id !== userId));
  }, []);

  const handleCreateNew = useCallback(() => {
    setEditingUser({
      id: `new-${Date.now()}`,
      name: "",
      email: "",
      role: "user",
      status: "pending",
      department: "Engineering",
      joinDate: new Date().toISOString().split("T")[0],
      lastActive: new Date().toISOString().split("T")[0],
    });
    setIsCreatingUser(true);
    setCurrentView("users");
  }, []);

  const handleSaveUser = useCallback(
    (user: Partial<User>) => {
      if (isCreatingUser) {
        setUsers((prev) => [...prev, user as User]);
      } else {
        setUsers((prev) =>
          prev.map((u) => (u.id === user.id ? ({ ...u, ...user } as User) : u)),
        );
      }
      setEditingUser(null);
      setIsCreatingUser(false);
    },
    [isCreatingUser],
  );

  const handleCancelEdit = useCallback(() => {
    setEditingUser(null);
    setIsCreatingUser(false);
  }, []);

  // Register AI tools
  useTool({
    name: "query_users",
    description:
      "Query and filter users by name, email, role, status, or department",
    inputSchema: {
      type: "object",
      properties: {
        search: {
          type: "string",
          description: "Search term for name or email",
        },
        role: {
          type: "string",
          description: "Filter by role: admin, moderator, or user",
        },
        status: {
          type: "string",
          description: "Filter by status: active, inactive, or pending",
        },
        department: { type: "string", description: "Filter by department" },
      },
    },
    handler: async ({
      search,
      role,
      status,
      department,
    }: {
      search?: string;
      role?: string;
      status?: string;
      department?: string;
    }) => {
      let filtered = users;

      if (search) {
        filtered = filtered.filter(
          (u) =>
            u.name.toLowerCase().includes(search.toLowerCase()) ||
            u.email.toLowerCase().includes(search.toLowerCase()),
        );
        setSearchQuery(search);
      }

      if (role) {
        filtered = filtered.filter((u) => u.role === role);
      }

      if (status) {
        filtered = filtered.filter((u) => u.status === status);
      }

      if (department) {
        filtered = filtered.filter((u) => u.department === department);
        setSelectedDepartment(department);
      }

      setCurrentView("users");

      return {
        success: true,
        data: {
          count: filtered.length,
          users: filtered.map((u) => ({
            id: u.id,
            name: u.name,
            email: u.email,
            role: u.role,
            status: u.status,
            department: u.department,
          })),
        },
      };
    },
  });

  useTool({
    name: "create_user",
    description: "Create a new user with the provided details",
    inputSchema: {
      type: "object",
      properties: {
        name: { type: "string", description: "User's full name" },
        email: { type: "string", description: "User's email address" },
        role: {
          type: "string",
          description: "User role: admin, moderator, or user",
        },
        department: { type: "string", description: "User's department" },
        status: {
          type: "string",
          description: "User status: active, inactive, or pending",
        },
      },
      required: ["name", "email"],
    },
    needsApproval: true,
    approvalMessage: (params: { name: string; email: string }) =>
      `Create new user: ${params.name} (${params.email})?`,
    handler: async (params: Partial<User>) => {
      const newUser: User = {
        id: `user-${Date.now()}`,
        name: params.name!,
        email: params.email!,
        role: (params.role as User["role"]) || "user",
        status: (params.status as User["status"]) || "pending",
        department: params.department || "Engineering",
        joinDate: new Date().toISOString().split("T")[0],
        lastActive: new Date().toISOString().split("T")[0],
      };
      setUsers((prev) => [...prev, newUser]);
      setCurrentView("users");
      return {
        success: true,
        data: { message: `User ${newUser.name} created`, userId: newUser.id },
      };
    },
    render: ({ status, args }) => {
      if (status === "approval-required" || status === "executing") {
        return (
          <div className="p-3 bg-purple-900/50 rounded-lg border border-purple-700/50 text-sm">
            <p className="font-medium text-purple-200">New User Preview</p>
            <p className="text-purple-300 mt-1">{args.name}</p>
            <p className="text-purple-400 text-xs">{args.email}</p>
            <p className="text-purple-400 text-xs mt-1">
              {args.role || "user"} - {args.department || "Engineering"}
            </p>
          </div>
        );
      }
      return null;
    },
  });

  useTool({
    name: "update_user",
    description: "Update an existing user's information",
    inputSchema: {
      type: "object",
      properties: {
        userId: { type: "string", description: "The user ID to update" },
        name: { type: "string", description: "New name" },
        email: { type: "string", description: "New email" },
        role: { type: "string", description: "New role" },
        department: { type: "string", description: "New department" },
        status: { type: "string", description: "New status" },
      },
      required: ["userId"],
    },
    needsApproval: true,
    approvalMessage: (params: { userId: string }) => {
      const user = users.find((u) => u.id === params.userId);
      return `Update user ${user?.name || params.userId}?`;
    },
    handler: async ({
      userId,
      ...updates
    }: { userId: string } & Partial<User>) => {
      const user = users.find((u) => u.id === userId);
      if (!user) {
        return { success: false, error: "User not found" };
      }
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? ({ ...u, ...updates } as User) : u)),
      );
      return {
        success: true,
        data: { message: `User ${user.name} updated` },
      };
    },
  });

  useTool({
    name: "delete_user",
    description: "Delete a user from the system. This is a destructive action.",
    inputSchema: {
      type: "object",
      properties: {
        userId: { type: "string", description: "The user ID to delete" },
      },
      required: ["userId"],
    },
    needsApproval: true,
    approvalMessage: (params: { userId: string }) => {
      const user = users.find((u) => u.id === params.userId);
      return `Are you sure you want to DELETE user ${user?.name || params.userId}? This cannot be undone.`;
    },
    handler: async ({ userId }: { userId: string }) => {
      const user = users.find((u) => u.id === userId);
      if (!user) {
        return { success: false, error: "User not found" };
      }
      setUsers((prev) => prev.filter((u) => u.id !== userId));
      return {
        success: true,
        data: { message: `User ${user.name} deleted` },
      };
    },
  });

  useTool({
    name: "export_csv",
    description: "Export user data as CSV file",
    inputSchema: {
      type: "object",
      properties: {
        includeAll: {
          type: "boolean",
          description: "Include all users or only filtered",
        },
      },
    },
    handler: async ({ includeAll = true }: { includeAll?: boolean }) => {
      const dataToExport = includeAll
        ? users
        : users.filter((u) => {
            const matchesSearch =
              u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
              u.email.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesDept =
              selectedDepartment === "All" ||
              u.department === selectedDepartment;
            return matchesSearch && matchesDept;
          });

      const csv = [
        [
          "ID",
          "Name",
          "Email",
          "Role",
          "Department",
          "Status",
          "Join Date",
          "Last Active",
        ].join(","),
        ...dataToExport.map((u) =>
          [
            u.id,
            u.name,
            u.email,
            u.role,
            u.department,
            u.status,
            u.joinDate,
            u.lastActive,
          ].join(","),
        ),
      ].join("\n");

      // Simulate download
      const filename = `users-export-${Date.now()}.csv`;
      setLastExport(filename);
      setCurrentView("export");

      return {
        success: true,
        data: {
          filename,
          rowCount: dataToExport.length,
          message: `Exported ${dataToExport.length} users to ${filename}`,
        },
      };
    },
  });

  useTool({
    name: "get_analytics",
    description: "Get dashboard analytics data",
    inputSchema: {
      type: "object",
      properties: {},
    },
    handler: async () => {
      setCurrentView("analytics");
      return {
        success: true,
        data: {
          ...analytics,
          usersByRole: {
            admin: users.filter((u) => u.role === "admin").length,
            moderator: users.filter((u) => u.role === "moderator").length,
            user: users.filter((u) => u.role === "user").length,
          },
        },
      };
    },
  });

  useTool({
    name: "navigate_to",
    description: "Navigate to a specific dashboard view",
    inputSchema: {
      type: "object",
      properties: {
        view: {
          type: "string",
          description:
            "View to navigate to: overview, users, analytics, export, or settings",
        },
      },
      required: ["view"],
    },
    handler: async ({ view }: { view: DashboardView }) => {
      setCurrentView(view);
      return {
        success: true,
        data: { navigatedTo: view },
      };
    },
  });

  return (
    <DemoLayout title="Dashboard Copilot" theme="linear">
      <div className="flex h-[calc(100vh-41px)]">
        {/* Sidebar */}
        <Sidebar currentView={currentView} onViewChange={setCurrentView} />

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto p-6 bg-gradient-to-br from-purple-950 to-purple-900">
          {currentView === "overview" && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white">Overview</h2>
              <StatsCards />
            </div>
          )}

          {currentView === "users" && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white">User Management</h2>
              {(editingUser || isCreatingUser) && (
                <UserForm
                  user={editingUser}
                  isNew={isCreatingUser}
                  onSave={handleSaveUser}
                  onCancel={handleCancelEdit}
                  onChange={setEditingUser}
                />
              )}
              <DataTable
                users={users}
                onEdit={handleEditUser}
                onDelete={handleDeleteUser}
                onCreateNew={handleCreateNew}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                selectedDepartment={selectedDepartment}
                onDepartmentChange={setSelectedDepartment}
              />
            </div>
          )}

          {currentView === "analytics" && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white">Analytics</h2>
              <StatsCards />
              <Card className="bg-purple-950/20 border-purple-800/30">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Activity Overview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center text-purple-400">
                    <p>Chart visualization would go here</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {currentView === "export" && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white">Export Data</h2>
              <Card className="bg-purple-950/20 border-purple-800/30">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Download className="h-5 w-5" />
                    Export Users
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-purple-300">
                    Export user data in various formats for reporting and
                    analysis.
                  </p>
                  <div className="flex gap-4">
                    <Button className="bg-purple-600 hover:bg-purple-700">
                      <FileText className="h-4 w-4 mr-2" />
                      Export as CSV
                    </Button>
                    <Button
                      variant="outline"
                      className="border-purple-800/50 text-purple-300 hover:bg-purple-800/50"
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      Export as JSON
                    </Button>
                  </div>
                  {lastExport && (
                    <p className="text-sm text-green-400">
                      Last export: {lastExport}
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>
          )}

          {currentView === "settings" && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white">Settings</h2>
              <Card className="bg-purple-950/20 border-purple-800/30">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    Dashboard Settings
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-purple-300">
                    Settings panel would go here
                  </p>
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        {/* Chat Panel */}
        <div
          className="w-96 border-l border-purple-800/30 bg-purple-950/50 flex flex-col"
          data-csdk-theme="linear"
        >
          <CopilotChat
            placeholder="Ask about users or data..."
            className="h-full"
            persistence={true}
            showThreadPicker={true}
            header={{
              name: "Dashboard Copilot",
            }}
            suggestions={[
              "Show all active users",
              "Create a new user",
              "Export user data",
            ]}
          />
        </div>
      </div>
    </DemoLayout>
  );
}

export default function DashboardPage() {
  return (
    <CopilotProvider
      runtimeUrl="/api/chat"
      systemPrompt={`You are a dashboard copilot assistant for an enterprise user management system. You can:

1. query_users - Search and filter users by name, email, role, status, or department
2. create_user - Create new users (requires approval)
3. update_user - Update user information (requires approval)
4. delete_user - Delete users (requires approval, destructive action)
5. export_csv - Export user data to CSV
6. get_analytics - View dashboard analytics
7. navigate_to - Navigate to different views (overview, users, analytics, export, settings)

Available departments: Engineering, Marketing, Support, Sales, HR, Design
Available roles: admin, moderator, user
Available statuses: active, inactive, pending

The current view and user statistics are automatically available to you. Help users manage their dashboard efficiently.

When users ask to see users, use query_users. For analytics questions, use get_analytics. For navigation requests, use navigate_to.`}
      debug={process.env.NODE_ENV === "development"}
    >
      <DashboardContent />
    </CopilotProvider>
  );
}

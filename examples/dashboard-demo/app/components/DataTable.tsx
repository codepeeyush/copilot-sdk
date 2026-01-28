"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Search,
  Edit,
  Trash2,
  Plus,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { type User, departments } from "@/lib/mock-data/users";
import { cn } from "@/lib/utils";

interface DataTableProps {
  users: User[];
  onEdit: (user: User) => void;
  onDelete: (userId: string) => void;
  onCreateNew: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedDepartment: string;
  onDepartmentChange: (dept: string) => void;
}

const statusColors = {
  active: "bg-green-500/20 text-green-400 border-green-500/30",
  inactive: "bg-gray-500/20 text-gray-400 border-gray-500/30",
  pending: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
};

const roleColors = {
  admin: "bg-purple-500/20 text-purple-300 border-purple-500/30",
  moderator: "bg-blue-500/20 text-blue-300 border-blue-500/30",
  user: "bg-gray-500/20 text-gray-300 border-gray-500/30",
};

export function DataTable({
  users,
  onEdit,
  onDelete,
  onCreateNew,
  searchQuery,
  onSearchChange,
  selectedDepartment,
  onDepartmentChange,
}: DataTableProps) {
  const [page, setPage] = useState(1);
  const itemsPerPage = 5;

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDept =
      selectedDepartment === "All" || user.department === selectedDepartment;
    return matchesSearch && matchesDept;
  });

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const paginatedUsers = filteredUsers.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage,
  );

  return (
    <Card className="bg-purple-950/20 border-purple-800/30">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-white">Users</CardTitle>
          <Button
            onClick={onCreateNew}
            size="sm"
            className="bg-purple-600 hover:bg-purple-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add User
          </Button>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 mt-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-purple-400" />
            <Input
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10 bg-purple-950/50 border-purple-800/50 text-white placeholder:text-purple-400"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {["All", ...departments].map((dept) => (
              <Button
                key={dept}
                variant={selectedDepartment === dept ? "default" : "outline"}
                size="sm"
                onClick={() => onDepartmentChange(dept)}
                className={cn(
                  selectedDepartment === dept
                    ? "bg-purple-600 hover:bg-purple-700"
                    : "border-purple-800/50 text-purple-300 hover:bg-purple-800/50",
                )}
              >
                {dept}
              </Button>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-purple-800/30">
                <th className="text-left py-3 px-4 text-sm font-medium text-purple-300">
                  User
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-purple-300">
                  Role
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-purple-300">
                  Department
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-purple-300">
                  Status
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-purple-300">
                  Last Active
                </th>
                <th className="text-right py-3 px-4 text-sm font-medium text-purple-300">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedUsers.map((user) => (
                <tr
                  key={user.id}
                  className="border-b border-purple-800/20 hover:bg-purple-800/20 transition-colors"
                >
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-purple-700 text-white text-xs">
                          {user.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-white text-sm">
                          {user.name}
                        </p>
                        <p className="text-xs text-purple-400">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <Badge
                      variant="outline"
                      className={cn(
                        "text-xs capitalize",
                        roleColors[user.role],
                      )}
                    >
                      {user.role}
                    </Badge>
                  </td>
                  <td className="py-3 px-4 text-sm text-purple-200">
                    {user.department}
                  </td>
                  <td className="py-3 px-4">
                    <Badge
                      variant="outline"
                      className={cn(
                        "text-xs capitalize",
                        statusColors[user.status],
                      )}
                    >
                      {user.status}
                    </Badge>
                  </td>
                  <td className="py-3 px-4 text-sm text-purple-300">
                    {user.lastActive}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-purple-300 hover:text-white hover:bg-purple-800/50"
                        onClick={() => onEdit(user)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-red-400 hover:text-red-300 hover:bg-red-950/50"
                        onClick={() => onDelete(user.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-purple-800/30">
            <p className="text-sm text-purple-400">
              Showing {(page - 1) * itemsPerPage + 1} to{" "}
              {Math.min(page * itemsPerPage, filteredUsers.length)} of{" "}
              {filteredUsers.length} users
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
                className="border-purple-800/50 text-purple-300 hover:bg-purple-800/50"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm text-purple-300">
                Page {page} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={page === totalPages}
                onClick={() => setPage(page + 1)}
                className="border-purple-800/50 text-purple-300 hover:bg-purple-800/50"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {filteredUsers.length === 0 && (
          <p className="text-center text-purple-400 py-8">No users found</p>
        )}
      </CardContent>
    </Card>
  );
}

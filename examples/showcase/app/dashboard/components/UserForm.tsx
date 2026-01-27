"use client";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, X } from "lucide-react";
import {
  type User as UserType,
  departments,
  roles,
  statuses,
} from "@/lib/mock-data/users";

interface UserFormProps {
  user: Partial<UserType> | null;
  onSave: (user: Partial<UserType>) => void;
  onCancel: () => void;
  onChange: (user: Partial<UserType>) => void;
  isNew: boolean;
}

export function UserForm({
  user,
  onSave,
  onCancel,
  onChange,
  isNew,
}: UserFormProps) {
  if (!user) return null;

  return (
    <Card className="bg-purple-950/20 border-purple-800/30">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-white flex items-center gap-2">
            <User className="h-5 w-5" />
            {isNew ? "Create New User" : "Edit User"}
          </CardTitle>
          <Button
            variant="ghost"
            size="icon"
            className="text-purple-300 hover:text-white hover:bg-purple-800/50"
            onClick={onCancel}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-purple-200">
              Name
            </Label>
            <Input
              id="name"
              value={user.name || ""}
              onChange={(e) => onChange({ ...user, name: e.target.value })}
              placeholder="John Doe"
              className="bg-purple-950/50 border-purple-800/50 text-white placeholder:text-purple-400"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email" className="text-purple-200">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              value={user.email || ""}
              onChange={(e) => onChange({ ...user, email: e.target.value })}
              placeholder="john@example.com"
              className="bg-purple-950/50 border-purple-800/50 text-white placeholder:text-purple-400"
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="role" className="text-purple-200">
              Role
            </Label>
            <select
              id="role"
              value={user.role || "user"}
              onChange={(e) =>
                onChange({ ...user, role: e.target.value as UserType["role"] })
              }
              className="w-full h-10 rounded-md border border-purple-800/50 bg-purple-950/50 px-3 text-white text-sm"
            >
              {roles.map((role) => (
                <option key={role} value={role} className="bg-purple-950">
                  {role.charAt(0).toUpperCase() + role.slice(1)}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="department" className="text-purple-200">
              Department
            </Label>
            <select
              id="department"
              value={user.department || departments[0]}
              onChange={(e) =>
                onChange({ ...user, department: e.target.value })
              }
              className="w-full h-10 rounded-md border border-purple-800/50 bg-purple-950/50 px-3 text-white text-sm"
            >
              {departments.map((dept) => (
                <option key={dept} value={dept} className="bg-purple-950">
                  {dept}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="status" className="text-purple-200">
              Status
            </Label>
            <select
              id="status"
              value={user.status || "pending"}
              onChange={(e) =>
                onChange({
                  ...user,
                  status: e.target.value as UserType["status"],
                })
              }
              className="w-full h-10 rounded-md border border-purple-800/50 bg-purple-950/50 px-3 text-white text-sm"
            >
              {statuses.map((status) => (
                <option key={status} value={status} className="bg-purple-950">
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end gap-2">
        <Button
          variant="outline"
          onClick={onCancel}
          className="border-purple-800/50 text-purple-300 hover:bg-purple-800/50"
        >
          Cancel
        </Button>
        <Button
          onClick={() => onSave(user)}
          disabled={!user.name || !user.email}
          className="bg-purple-600 hover:bg-purple-700"
        >
          {isNew ? "Create User" : "Save Changes"}
        </Button>
      </CardFooter>
    </Card>
  );
}

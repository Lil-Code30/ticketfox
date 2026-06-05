"use client";

import { useState, useTransition } from "react";
import { updateUserRole } from "@/app/actions/user";

export type UserRoleType = "ADMIN" | "TECHNICIAN" | "MANAGER" | "USER";
const USER_ROLES: UserRoleType[] = ["ADMIN", "TECHNICIAN", "MANAGER", "USER"];

interface UserData {
  id: string;
  email: string | null;
  firstName: string | null;
  lastName: string | null;
  role: UserRoleType;
}

export function UserRoleManager({ initialUsers }: { initialUsers: UserData[] }) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleRoleChange = (userId: string, newRole: UserRoleType) => {
    startTransition(async () => {
      setError(null);
      const res = await updateUserRole(userId, newRole);
      if (!res.success) {
        setError(res.error || "An error occurred");
      }
    });
  };

  return (
    <div className="flex flex-col gap-6 rounded-xl border border-border bg-surface p-6">
      <div className="flex flex-col gap-1">
        <h2 className="text-xl font-semibold text-text">User Management</h2>
        <p className="text-sm text-text-muted">
          Manage system access levels for all registered users. (Admin protection temporarily bypassed)
        </p>
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-border text-text-muted">
              <th className="pb-3 pr-4 font-medium">User</th>
              <th className="pb-3 pr-4 font-medium">Email</th>
              <th className="pb-3 font-medium">Role</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {initialUsers.map((u) => (
              <tr key={u.id} className="group transition-colors hover:bg-surface-2">
                <td className="py-4 pr-4">
                  <span className="font-medium text-text">
                    {u.firstName || u.lastName ? `${u.firstName || ""} ${u.lastName || ""}`.trim() : "Unknown"}
                  </span>
                </td>
                <td className="py-4 pr-4 text-text-muted">{u.email || "No email"}</td>
                <td className="py-4">
                  <select
                    disabled={isPending}
                    value={u.role}
                    onChange={(e) => handleRoleChange(u.id, e.target.value as UserRoleType)}
                    className="rounded-md border border-border bg-background px-3 py-1.5 text-sm text-text transition-colors focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-50"
                  >
                    {USER_ROLES.map((role) => (
                      <option key={role} value={role}>
                        {role}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

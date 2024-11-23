"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { useUsers } from "@/hooks/useUsers";
import { useRoles } from "@/hooks/useRoles";
import { UserData } from "./users/page";
import { Role } from "./roles/page";
import { Loader2 } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const { users, loading: usersLoading, fetchUsers } = useUsers<UserData>();
  const { roles, loading: rolesLoading, fetchRoles } = useRoles<Role>();

  useEffect(() => {
    fetchUsers();
    fetchRoles();
  }, [fetchUsers, fetchRoles]);

  return (
    <DashboardLayout>
      <div className="space-y-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">
            Dashboard
          </h2>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Link href="/users">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Users
                </CardTitle>
                {usersLoading && <Loader2 className="h-4 w-4 animate-spin" />}
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{users?.length || 0}</div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/roles">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Roles
                </CardTitle>
                {rolesLoading && <Loader2 className="h-4 w-4 animate-spin" />}
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{roles?.length || 0}</div>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </DashboardLayout>
  );
}

'use client';

import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { UserTable } from "@/components/tables/UserTable";
import { Button } from "@/components/ui/button";
import { useUsers } from "@/hooks/useUsers";
import Link from "next/link";
import { useEffect } from "react";

export default function UsersPage() {
  const { users, loading, error, fetchUsers } = useUsers();

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return (
    <DashboardLayout>
      <div className="space-y-4">
        <div className="flex justify-between">
          <h2 className="text-2xl font-bold">Users</h2>
          <Button asChild>
            <Link href="/users/add">Add User</Link>
          </Button>
        </div>

        {loading ? (
          <div>Loading...</div>
        ) : error ? (
          <div className="text-red-500">{error}</div>
        ) : (
          <UserTable 
            users={users}
            onEdit={(user) => window.location.href = `/users/${user.id}/edit`}
            onDelete={(user) => console.log('Delete user:', user.id)}
          />
        )}
      </div>
    </DashboardLayout>
  );
} 
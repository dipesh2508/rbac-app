'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { UserTable } from "@/components/tables/UserTable";
import { Button } from "@/components/ui/button";
import { useUsers } from "@/hooks/useUsers";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";
import Link from "next/link";

export interface UserData {
  _id: string;
  name: string;
  email: string;
  roleId: 'admin' | 'user';
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

export default function UsersPage() {
  const router = useRouter();
  const { users, loading, error, fetchUsers, deleteUser } = useUsers<UserData>();
  const [userToDelete, setUserToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleDelete = async () => {
    if (!userToDelete) return;

    try {
      setIsDeleting(true);
      await deleteUser(userToDelete);
      await fetchUsers(); // Refresh the list after deletion
    } catch (error) {
      console.error('Failed to delete user:', error);
    } finally {
      setIsDeleting(false);
      setUserToDelete(null);
    }
  };

  // Show error state if there's an error
  if (error) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center p-8 text-red-500">
          <p>Error loading users: {error}</p>
          <Button 
            onClick={() => fetchUsers()} 
            variant="outline" 
            className="mt-4"
          >
            Retry
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    
    <DashboardLayout>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Users</h2>
          <Button asChild>
            <Link href="/users/add">Add User</Link>
          </Button>
          
        </div>

        {loading ? (
          <div className="flex items-center justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : (
          <div className="rounded-md border">
            <UserTable
              users={users}
              onEdit={(user) => router.push(`/users/${user._id}/edit`)}
              onDelete={(user) => setUserToDelete(user._id)}
            />
          </div>
        )}

        <Dialog open={!!userToDelete} onOpenChange={(open) => !open && setUserToDelete(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete User</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this user? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setUserToDelete(null)}
                disabled={isDeleting}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleDelete}
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  'Delete'
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
} 
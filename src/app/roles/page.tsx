'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { Button } from '@/components/ui/button';
import { useRoles } from '@/hooks/useRoles';
import { Loader2, Plus } from 'lucide-react';
import { RoleDialog } from './role-dialog';
import { DeleteDialog } from '@/components/delete-dialog';
import { RoleTable } from '@/components/tables/RoleTable';

export interface Permission {
  read: boolean;
  write: boolean;
  delete: boolean;
  manage: boolean;
}

export interface Role {
  _id: string;
  name: string;
  description?: string;
  permissions: {
    users: Permission;
    roles: Permission;
    settings: Permission;
  };
}

export default function RolesPage() {
  const router = useRouter();
  const { roles, loading, error, fetchRoles } = useRoles<Role>();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [deletingRole, setDeletingRole] = useState<Role | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchRoles();
  }, [fetchRoles]);

  // Show error state if there's an error
  if (error) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center p-8 text-red-500">
          <p>Error loading roles: {error}</p>
          <Button 
            onClick={() => fetchRoles()} 
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
      <div className="space-y-4 text-slate-900">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Roles</h2>
          <Button onClick={() => setIsAddDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Role
          </Button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : (
          <div className="rounded-md border">
            <RoleTable
              roles={roles}
              onEdit={(role) => setEditingRole(role)}
              onDelete={(role) => setDeletingRole(role)}
            />
          </div>
        )}

        <RoleDialog
          open={isAddDialogOpen}
          onOpenChange={setIsAddDialogOpen}
          onSuccess={() => {
            setIsAddDialogOpen(false);
            fetchRoles();
          }}
        />

        {editingRole && (
          <RoleDialog
            open={!!editingRole}
            onOpenChange={() => setEditingRole(null)}
            role={editingRole}
            onSuccess={() => {
              setEditingRole(null);
              fetchRoles();
            }}
          />
        )}

        {deletingRole && (
          <DeleteDialog
            open={!!deletingRole}
            onOpenChange={() => setDeletingRole(null)}
            onConfirm={async () => {
              try {
                setIsDeleting(true);
                // Add your delete API call here
                // await deleteRole(deletingRole._id);
                setDeletingRole(null);
                await fetchRoles();
              } catch (error) {
                console.error('Failed to delete role:', error);
              } finally {
                setIsDeleting(false);
              }
            }}
            title="Delete Role"
            description={`Are you sure you want to delete the role "${deletingRole.name}"? This action cannot be undone.`}
            isLoading={isDeleting}
          />
        )}
      </div>
    </DashboardLayout>
  );
} 
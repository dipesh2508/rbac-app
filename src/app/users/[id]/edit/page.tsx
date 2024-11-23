'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { useUsers } from "@/hooks/useUsers";
import { useRoles } from "@/hooks/useRoles";
import { Role } from "@/app/roles/page";

interface UserData {
  _id: string;
  name: string;
  email: string;
  roleId: string;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

interface UserFormData {
  name: string;
  email: string;
  roleId: string;
  status: 'active' | 'inactive';
}

export default function EditUserPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { toast } = useToast();
  const { getUser, updateUser } = useUsers<UserData>();
  const { roles, fetchRoles } = useRoles<Role>();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState<UserFormData>({
    name: '',
    email: '',
    roleId: '',
    status: 'active',
  });

  const initializeData = useCallback(async () => {
    try {
      setIsLoading(true);
      const [userData] = await Promise.all([
        getUser(params.id),
        fetchRoles(),
      ]);

      if (!userData) {
        throw new Error('User not found');
      }

      setFormData({
        name: userData.name,
        email: userData.email,
        roleId: userData.roleId,
        status: userData.status,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch user details",
      });
      router.push('/users');
    } finally {
      setIsLoading(false);
    }
  }, [params.id, getUser, fetchRoles, toast, router]);

  useEffect(() => {
    initializeData();
  }, [initializeData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      await updateUser(params.id, formData);
      
      toast({
        title: "Success",
        description: "User updated successfully",
      });
      
      router.push('/users');
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update user",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center p-8">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6 text-slate-900">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Edit User</h2>
          <p className="text-muted-foreground">Update user details and permissions</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Select
                value={formData.roleId}
                onValueChange={(value) => setFormData({ ...formData, roleId: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  {roles?.map((role) => (
                    <SelectItem key={role._id} value={role._id}>
                      {role.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value: 'active' | 'inactive') => 
                  setFormData({ ...formData, status: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push('/users')}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                'Update User'
              )}
            </Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
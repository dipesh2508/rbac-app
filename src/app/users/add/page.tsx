'use client';

import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { UserForm } from "@/components/forms/UserForm";
import { useUsers } from "@/hooks/useUsers";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

export default function AddUserPage() {
  const { createUser } = useUsers();
  const router = useRouter();
  const { toast } = useToast();

  const handleSubmit = async (data: any) => {
    try {
      await createUser(data);
      toast({
        title: "Success",
        description: "User created successfully",
      });
      router.push('/users');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create user",
        variant: "destructive",
      });
    }
  };

  // For now, we'll use dummy roles data
  const dummyRoles = [
    { id: '1', name: 'Admin' },
    { id: '2', name: 'User' },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-4 text-gray-900">
        <h2 className="text-2xl font-bold">Add User</h2>
        <div className="max-w-2xl">
          <UserForm onSubmit={handleSubmit} roles={dummyRoles} />
        </div>
      </div>
    </DashboardLayout>
  );
} 
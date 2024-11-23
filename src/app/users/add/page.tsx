'use client';

import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { UserForm } from "@/components/forms/UserForm";
import { useUsers } from "@/hooks/useUsers";
import { useRouter } from "next/navigation";

export default function AddUserPage() {
  const { createUser, loading } = useUsers();
  const router = useRouter();

  const handleSubmit = async (data: any) => {
    try {
      await createUser(data);
      router.push('/users');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-4 text-gray-900">
        <h2 className="text-2xl font-bold">Add User</h2>
        <div className="max-w-2xl">
          <UserForm 
            onSubmit={handleSubmit} 
            isLoading={loading} 
          />
        </div>
      </div>
    </DashboardLayout>
  );
} 
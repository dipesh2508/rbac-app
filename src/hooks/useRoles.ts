import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { api } from '@/lib/api';
import { Role } from '@/app/roles/page';

export function useRoles<T>() {
  const [roles, setRoles] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchRoles = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get<{ roles: T[]; message: string }>('/roles');
      
      if (!response.data?.roles) {
        throw new Error('No roles data received');
      }
      
      setRoles(response.data.roles);
      setError(null);
      
      toast({
        title: "Success",
        description: response.data.message || "Roles fetched successfully",
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch roles';
      setError(message);
      toast({
        variant: "destructive",
        title: "Error",
        description: message,
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const createRole = async (roleData: Omit<Role, '_id'>) => {
    const response = await api.post<{ role: T; message: string }>('/roles', roleData);
    return response.data;
  };

  const updateRole = async (id: string, roleData: Partial<Role>) => {
    const response = await api.put<{ role: T; message: string }>(`/roles/${id}`, roleData);
    return response.data;
  };

  const deleteRole = async (id: string) => {
    const response = await api.delete<{ message: string }>(`/roles/${id}`);
    return response.data;
  };

  return {
    roles,
    loading,
    error,
    fetchRoles,
    createRole,
    updateRole,
    deleteRole,
  };
} 
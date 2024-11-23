import { useState, useCallback } from 'react';
import { api } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

export function useUsers<T>() {
  const [users, setUsers] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      console.log('Fetching users...');
      
      const response = await api.get<{ users: T[]; message: string }>('/users');
      console.log('API Response:', response.data);
      
      if (!response.data?.users) {
        throw new Error('No users data received');
      }
      
      setUsers(response.data.users);
      setError(null);
      
      toast({
        title: "Success",
        description: response.data.message || "Users fetched successfully",
      });
    } catch (err) {
      console.error('Error in useUsers hook:', err);
      const message = err instanceof Error ? err.message : 'Failed to fetch users';
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

  const createUser = useCallback(async (userData: Omit<T, '_id' | 'createdAt' | 'updatedAt'>) => {
    try {
      setLoading(true);
      const { data } = await api.post<{ success: boolean; message: string; data: { user: T } }>('/users', userData);
      
      if (!data?.success) {
        throw new Error(data?.message || 'Failed to create user');
      }

      setUsers(prev => [...prev, data.data.user]);
      toast({
        title: "Success",
        description: data.message || "User created successfully",
      });
      return data.data.user;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create user';
      toast({
        variant: "destructive",
        title: "Error",
        description: message,
      });
      throw err;
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const deleteUser = useCallback(async (id: string) => {
    try {
      setLoading(true);
      const response = await api.delete<{ message: string }>(`/users/${id}`);
      
      await fetchUsers();
      
      toast({
        title: "Success",
        description: response.data.message || "User deleted successfully",
      });
    } catch (error: any) {
      const message = error.response?.data?.error || error.message || 'Failed to delete user';
      toast({
        variant: "destructive",
        title: "Error",
        description: message,
      });
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  }, [toast, fetchUsers]);

  const getUser = useCallback(async (id: string): Promise<T> => {
    const response = await api.get<{ user: T; message: string }>(`/users/${id}`);
    return response.data.user;
  }, []);

  const updateUser = useCallback(async (id: string, userData: Partial<T>) => {
    const response = await api.put<{ user: T; message: string }>(`/users/${id}`, userData);
    return response.data;
  }, []);

  return {
    users,
    loading,
    error,
    fetchUsers,
    createUser,
    deleteUser,
    getUser,
    updateUser,
  };
} 
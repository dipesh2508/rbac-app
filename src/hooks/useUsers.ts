import { useState, useCallback } from 'react';
import { User, UserFormData } from '@/types';
import { api, isApiError } from '@/lib/api';

export function useUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const data = await api.users.getAll();
      setUsers(data);
      setError(null);
    } catch (err:any) {
      const errorMessage = isApiError(err) ? err.message : 'Failed to fetch users';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const createUser = useCallback(async (userData: UserFormData) => {
    try {
      setLoading(true);
      const newUser = await api.users.create(userData);
      setUsers(prev => [...prev, newUser]);
      return newUser;
    } catch (err:any) {
      const errorMessage = isApiError(err) ? err.message : 'Failed to create user';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateUser = useCallback(async (id: string, userData: Partial<UserFormData>) => {
    try {
      setLoading(true);
      const updatedUser = await api.users.update(id, userData);
      setUsers(prev => prev.map(user => user.id === id ? updatedUser : user));
      return updatedUser;
    } catch (err:any) {
      const errorMessage = isApiError(err) ? err.message : 'Failed to update user';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteUser = useCallback(async (id: string) => {
    try {
      setLoading(true);
      await api.users.delete(id);
      setUsers(prev => prev.filter(user => user.id !== id));
    } catch (err:any) {
      const errorMessage = isApiError(err) ? err.message : 'Failed to delete user';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    users,
    loading,
    error,
    fetchUsers,
    createUser,
    updateUser,
    deleteUser,
  };
} 
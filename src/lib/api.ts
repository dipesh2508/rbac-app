import { UserFormData } from "@/types";

import { User } from "@/types";

import { Role, RoleFormData } from "@/types";

type RequestMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

interface RequestOptions {
  method: RequestMethod;
  headers?: Record<string, string>;
  body?: any;
}

class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public data?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

const createRequest = async <T>(
  endpoint: string,
  options: RequestOptions
): Promise<T> => {
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  const config: RequestInit = {
    method: options.method,
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
  };

  try {
    const response = await fetch(`/api${endpoint}`, config);
    const data = await response.json();

    if (!response.ok) {
      throw new ApiError(
        response.status,
        data.message || 'An error occurred',
        data
      );
    }

    return data;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(500, 'Network error occurred');
  }
};

export const api = {
  get: <T>(endpoint: string) => 
    createRequest<T>(endpoint, { method: 'GET' }),

  post: <T>(endpoint: string, data: any) =>
    createRequest<T>(endpoint, { 
      method: 'POST',
      body: data,
    }),

  put: <T>(endpoint: string, data: any) =>
    createRequest<T>(endpoint, {
      method: 'PUT',
      body: data,
    }),

  delete: <T>(endpoint: string) =>
    createRequest<T>(endpoint, { method: 'DELETE' }),

  // Specific endpoints for Users
  users: {
    getAll: () => api.get<User[]>('/users'),
    getById: (id: string) => api.get<User>(`/users/${id}`),
    create: (data: UserFormData) => api.post<User>('/users', data),
    update: (id: string, data: Partial<UserFormData>) => 
      api.put<User>(`/users/${id}`, data),
    delete: (id: string) => api.delete<void>(`/users/${id}`),
  },

  // Specific endpoints for Roles
  roles: {
    getAll: () => api.get<Role[]>('/roles'),
    getById: (id: string) => api.get<Role>(`/roles/${id}`),
    create: (data: RoleFormData) => api.post<Role>('/roles', data),
    update: (id: string, data: Partial<RoleFormData>) => 
      api.put<Role>(`/roles/${id}`, data),
    delete: (id: string) => api.delete<void>(`/roles/${id}`),
  },
};

// Type guard for checking if an error is an ApiError
export const isApiError = (error: any): error is ApiError => {
  return error instanceof ApiError;
}; 
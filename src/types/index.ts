export interface User {
  id: string;
  name: string;
  email: string;
  roleId: string;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

export interface Role {
  id: string;
  name: string;
  permissions: Permission[];
  createdAt: string;
  updatedAt: string;
}

export interface Permission {
  id: string;
  name: string;
  description: string;
  module: 'users' | 'roles' | 'permissions';
  action: 'create' | 'read' | 'update' | 'delete';
}

export type UserFormData = {
  name: string;
  email: string;
  roleId: string;
  status: 'active' | 'inactive';
  password?: string;
};

export type RoleFormData = {
  name: string;
  permissions: string[]; // Array of permission IDs
}; 
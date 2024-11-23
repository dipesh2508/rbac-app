import mongoose, { Document, Schema } from 'mongoose';

export interface Permission {
  read: boolean;
  write: boolean;
  delete: boolean;
  manage: boolean;
}

export interface IRole extends Document {
  name: string;
  description?: string;
  permissions: {
    users: Permission;
    roles: Permission;
    // Add other resource permissions as needed
    settings: Permission;
  };
  createdAt: Date;
  updatedAt: Date;
}

const permissionSchema = new Schema({
  read: { type: Boolean, default: false },
  write: { type: Boolean, default: false },
  delete: { type: Boolean, default: false },
  manage: { type: Boolean, default: false },
});

const roleSchema = new Schema<IRole>(
  {
    name: {
      type: String,
      required: [true, 'Role name is required'],
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    permissions: {
      users: { type: permissionSchema, default: () => ({}) },
      roles: { type: permissionSchema, default: () => ({}) },
      settings: { type: permissionSchema, default: () => ({}) },
    },
  },
  {
    timestamps: true,
  }
);

const RoleModel = mongoose.models.Role || mongoose.model<IRole>('Role', roleSchema);

export default RoleModel; 
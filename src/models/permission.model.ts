import mongoose, { Document, Model } from 'mongoose';

export interface IPermission extends Document {
  name: string;
  description: string;
  module: 'users' | 'roles' | 'permissions';
  action: 'create' | 'read' | 'update' | 'delete';
  createdAt: Date;
  updatedAt: Date;
}

const permissionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Permission name is required'],
    unique: true,
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
  },
  module: {
    type: String,
    enum: ['users', 'roles', 'permissions'],
    required: true,
  },
  action: {
    type: String,
    enum: ['create', 'read', 'update', 'delete'],
    required: true,
  },
}, {
  timestamps: true,
});

export const PermissionModel: Model<IPermission> = mongoose.models.Permission || mongoose.model<IPermission>('Permission', permissionSchema); 
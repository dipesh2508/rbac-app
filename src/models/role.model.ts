import mongoose, { Document, Model } from 'mongoose';

export interface IRole extends Document {
  name: string;
  permissions: string[];
  createdAt: Date;
  updatedAt: Date;
}

const roleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Role name is required'],
    unique: true,
    trim: true,
  },
  permissions: [{
    type: String,
    required: true,
  }],
}, {
  timestamps: true,
});

export const RoleModel: Model<IRole> = mongoose.models.Role || mongoose.model<IRole>('Role', roleSchema); 
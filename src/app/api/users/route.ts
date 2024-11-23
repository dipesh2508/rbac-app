import { NextResponse } from 'next/server';
import { connectToDB } from '@/lib/db';
import { UserModel } from '@/models/user.model';
import RoleModel from '@/models/role.model';
import { hash } from 'bcryptjs';
import mongoose from 'mongoose';

export async function GET() {
  try {
    await connectToDB();
    console.log('DB Connection successful');
    
    const users = await UserModel.find({})
      .populate({
        path: 'roleId',
        model: RoleModel,
        select: 'name'
      })
      .select('-password')
      .sort({ createdAt: -1 });
    
    return NextResponse.json(
      { users, message: 'Users fetched successfully' },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch users' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    await connectToDB();
    const body = await request.json();

    // Create user with the role ID from the form
    const user = await UserModel.create({
      name: body.name,
      email: body.email,
      password: body.password,
      roleId: new mongoose.Types.ObjectId(body.roleId), // Convert string ID to ObjectId
      status: body.status
    });

    // Return the user without password and populate the role
    const newUser = await UserModel.findById(user._id)
      .select('-password')
      .populate('roleId', 'name');

    return NextResponse.json(
      { user: newUser, message: 'User created successfully' },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error creating user:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create user' },
      { status: 500 }
    );
  }
} 
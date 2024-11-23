import { NextResponse } from 'next/server';
import { connectToDB } from '@/lib/db';
import { UserModel } from '@/models/user.model';
import RoleModel from '@/models/role.model';
import { hash } from 'bcryptjs';

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

    // Validate required fields
    if (!body.email || !body.password || !body.name || !body.roleId || !body.status) {
      return NextResponse.json(
        { 
          success: false,
          message: 'All fields are required' 
        },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await UserModel.findOne({ email: body.email });
    if (existingUser) {
      return NextResponse.json(
        { 
          success: false,
          message: 'User with this email already exists' 
        },
        { status: 400 }
      );
    }

    // Hash the password
    const hashedPassword = await hash(body.password, 12);

    // Create new user with validated data
    const newUser = await UserModel.create({
      name: body.name,
      email: body.email,
      password: hashedPassword,
      roleId: body.roleId, // "admin" or "user"
      status: body.status, // "active" or "inactive"
    });
    
    // Fetch user without password
    const userWithoutPassword = await UserModel.findById(newUser._id)
      .select('-password');

    return NextResponse.json(
      {
        success: true,
        message: 'User created successfully',
        data: {
          user: userWithoutPassword
        }
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('User creation error:', error);
    
    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Failed to create user',
      },
      { status: 500 }
    );
  }
} 
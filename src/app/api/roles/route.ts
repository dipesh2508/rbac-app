import { NextResponse } from 'next/server';
import { connectToDB } from '@/lib/db';
import RoleModel from '@/models/role.model';

export async function GET() {
  try {
    await connectToDB();
    const roles = await RoleModel.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ roles, message: 'Roles fetched successfully' });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch roles' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    await connectToDB();
    const body = await request.json();
    
    const role = await RoleModel.create(body);
    return NextResponse.json(
      { role, message: 'Role created successfully' },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to create role' },
      { status: 500 }
    );
  }
} 
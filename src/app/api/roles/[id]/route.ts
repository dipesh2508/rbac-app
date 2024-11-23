import { NextResponse } from 'next/server';
import { connectToDB } from '@/lib/db';
import RoleModel from '@/models/role.model';

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDB();
    const body = await request.json();
    
    const role = await RoleModel.findByIdAndUpdate(
      params.id,
      { $set: body },
      { new: true }
    );

    if (!role) {
      return NextResponse.json(
        { error: 'Role not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { role, message: 'Role updated successfully' }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to update role' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDB();
    
    const role = await RoleModel.findByIdAndDelete(params.id);
    
    if (!role) {
      return NextResponse.json(
        { error: 'Role not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: 'Role deleted successfully' }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to delete role' },
      { status: 500 }
    );
  }
} 
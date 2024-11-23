import { NextResponse } from 'next/server';
import { connectToDB } from '@/lib/db';
import { UserModel } from '@/models/user.model';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDB();
    
    const user = await UserModel.findById(params.id)
      .populate('roleId', 'name')
      .select('-password');

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { user, message: 'User fetched successfully' }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch user' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDB();
    const body = await request.json();
    
    const user = await UserModel.findByIdAndUpdate(
      params.id,
      { $set: body },
      { new: true }
    ).select('-password');

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { user, message: 'User updated successfully' }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to update user' },
      { status: 500 }
    );
  }
} 
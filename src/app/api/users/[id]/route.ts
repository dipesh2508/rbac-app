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
      .select('-password');

    if (!user) {
      return NextResponse.json(
        { 
          success: false,
          message: 'User not found' 
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { 
        success: true,
        message: 'User fetched successfully',
        data: { user }
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { 
        success: false,
        message: error.message || 'Failed to fetch user'
      },
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

    if (body.roleId && !['admin', 'user'].includes(body.roleId)) {
      return NextResponse.json(
        { 
          success: false,
          message: 'Invalid role value'
        },
        { status: 400 }
      );
    }

    if (body.status && !['active', 'inactive'].includes(body.status)) {
      return NextResponse.json(
        { 
          success: false,
          message: 'Invalid status value'
        },
        { status: 400 }
      );
    }

    const user = await UserModel.findByIdAndUpdate(
      params.id,
      { $set: body },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return NextResponse.json(
        { 
          success: false,
          message: 'User not found'
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { 
        success: true,
        message: 'User updated successfully',
        data: { user }
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { 
        success: false,
        message: error.message || 'Failed to update user'
      },
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
    
    const user = await UserModel.findByIdAndDelete(params.id);

    if (!user) {
      return NextResponse.json(
        { 
          success: false,
          message: 'User not found'
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { 
        success: true,
        message: 'User deleted successfully'
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { 
        success: false,
        message: error.message || 'Failed to delete user'
      },
      { status: 500 }
    );
  }
} 
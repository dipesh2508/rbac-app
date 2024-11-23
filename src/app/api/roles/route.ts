import { NextResponse } from 'next/server';
import type { Role } from '@/types';

let roles: Role[] = [];

export async function GET() {
  return NextResponse.json(roles);
}

export async function POST(request: Request) {
  const body = await request.json();
  const newRole = {
    id: crypto.randomUUID(),
    ...body,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  roles.push(newRole);
  return NextResponse.json(newRole);
} 
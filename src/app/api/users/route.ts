import { NextResponse } from 'next/server';
import type { User } from '@/types';

let users: User[] = [];

export async function GET() {
  return NextResponse.json(users);
}

export async function POST(request: Request) {
  const body = await request.json();
  const newUser = {
    id: crypto.randomUUID(),
    ...body,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  users.push(newUser);
  return NextResponse.json(newUser);
} 
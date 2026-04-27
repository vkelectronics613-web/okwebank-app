import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

const GATEWAY_SECRET = process.env.GATEWAY_SECRET || 'super-secret-gateway-key-12345';

export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get('Authorization');
    if (authHeader !== `Bearer ${GATEWAY_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized gateway access' }, { status: 401 });
    }

    const { upi_id } = await req.json();

    if (!upi_id) {
      return NextResponse.json({ error: 'Missing upi_id' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { upi_id },
      select: { username: true, upi_id: true }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, user }, { status: 200 });
  } catch (error: any) {
    console.error('Gateway verify user error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}

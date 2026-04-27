import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Ensure this matches between okwebank and okwepay
const GATEWAY_SECRET = process.env.GATEWAY_SECRET || 'super-secret-gateway-key';

export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get('Authorization');
    if (authHeader !== `Bearer ${GATEWAY_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized gateway access' }, { status: 401 });
    }

    const { from_upi, amount } = await req.json();

    if (!from_upi || !amount) {
      return NextResponse.json({ error: 'Missing from_upi or amount' }, { status: 400 });
    }

    const to_upi = 'gateway@okwebank'; // The central pool for okwepay

    // Ensure central gateway account exists
    let gatewayUser = await prisma.user.findUnique({ where: { upi_id: to_upi } });
    if (!gatewayUser) {
      gatewayUser = await prisma.user.create({
        data: {
          username: 'gateway',
          upi_id: to_upi,
          password_hash: 'system_account',
        }
      });
    }

    // Run transaction
    const result = await prisma.$transaction(async (tx) => {
      const sender = await tx.user.findUnique({ where: { upi_id: from_upi } });
      if (!sender) throw new Error('Sender not found');
      if (sender.balance < amount) throw new Error('Insufficient balance');

      // Create transaction record
      const transaction = await tx.transaction.create({
        data: {
          from_upi,
          to_upi,
          amount,
          type: 'gateway_payment',
          status: 'success'
        }
      });

      // Update balances
      await tx.user.update({
        where: { upi_id: from_upi },
        data: { balance: { decrement: amount } }
      });

      await tx.user.update({
        where: { upi_id: to_upi },
        data: { balance: { increment: amount } }
      });

      return transaction;
    });

    return NextResponse.json({ success: true, transaction: result }, { status: 200 });
  } catch (error: any) {
    console.error('Gateway process payment error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}

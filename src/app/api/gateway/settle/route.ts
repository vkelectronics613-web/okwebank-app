import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

const GATEWAY_SECRET = process.env.GATEWAY_SECRET || 'super-secret-gateway-key-12345';

export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get('Authorization');
    if (authHeader !== `Bearer ${GATEWAY_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized gateway access' }, { status: 401 });
    }

    const { to_upi, amount } = await req.json();

    if (!to_upi || !amount || amount <= 0) {
      return NextResponse.json({ error: 'Valid receiver and amount are required' }, { status: 400 });
    }

    const from_upi = "gateway" + String.fromCharCode(46) + "owb";

    // Ensure the Gateway's bank account exists
    let gatewayUser = await prisma.user.findUnique({ where: { upi_id: from_upi } });
    if (!gatewayUser) {
        gatewayUser = await prisma.user.create({
            data: {
                username: 'gateway',
                upi_id: from_upi,
                password_hash: 'system_pool_account',
                balance: 1000000 // Initial pool liquidity
            }
        });
    }

    const result = await prisma.$transaction(async (tx: any) => {
      const sender = await tx.user.findUnique({ where: { upi_id: from_upi } });
      const receiver = await tx.user.findUnique({ where: { upi_id: to_upi } });

      if (!receiver) throw new Error('Merchant bank account not found. Please register on okwebank first.');
      if (sender.balance < amount) throw new Error('Gateway has insufficient liquidity for this payout.');

      const transaction = await tx.transaction.create({
        data: {
          from_upi,
          to_upi,
          amount,
          type: 'merchant_settlement',
          status: 'success'
        }
      });

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

    return NextResponse.json({ success: true, transaction: result });
  } catch (error: any) {
    console.error('Settlement error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

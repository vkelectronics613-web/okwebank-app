import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const { to_upi, amount } = await req.json();

    if (!to_upi || !amount || amount <= 0) {
      return NextResponse.json({ error: 'Valid receiver UPI ID and amount are required' }, { status: 400 });
    }

    const suffix = String.fromCharCode(46) + "owb";
    if (!to_upi.endsWith(suffix)) {
      return NextResponse.json({ error: `Invalid UPI ID format. Must end with ${suffix}` }, { status: 400 });
    }

    const receiver = await prisma.user.findUnique({ where: { upi_id: to_upi } });
    if (!receiver) {
      return NextResponse.json({ error: 'Receiver not found' }, { status: 404 });
    }

    const admin_upi = "admin" + suffix;

    let adminUser = await prisma.user.findUnique({ where: { upi_id: admin_upi } });
    if (!adminUser) {
      adminUser = await prisma.user.create({
        data: {
          username: 'admin',
          upi_id: admin_upi,
          password_hash: 'system_account',
          balance: 1000000000 
        }
      });
    }

    const result = await prisma.$transaction(async (tx: any) => {
      const transaction = await tx.transaction.create({
        data: {
          from_upi: admin_upi,
          to_upi: receiver.upi_id,
          amount: Number(amount),
          type: 'admin_credit',
          status: 'success'
        }
      });

      await tx.user.update({
        where: { upi_id: receiver.upi_id },
        data: { balance: { increment: Number(amount) } }
      });

      await tx.user.update({
        where: { upi_id: admin_upi },
        data: { balance: { decrement: Number(amount) } }
      });

      return transaction;
    });

    return NextResponse.json({ success: true, transaction: result }, { status: 200 });
  } catch (error: any) {
    console.error('Admin send error:', error);
    return NextResponse.json({ error: 'Internal server error', details: error.message }, { status: 500 });
  }
}

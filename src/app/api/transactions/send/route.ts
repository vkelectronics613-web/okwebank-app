import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || !session.upi_id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { to_upi, amount, type } = await req.json();
    const from_upi = session.upi_id;

    if (!to_upi || !amount || amount <= 0) {
      return NextResponse.json({ error: "Invalid transfer details" }, { status: 400 });
    }

    if (from_upi === to_upi) {
      return NextResponse.json({ error: "Cannot send money to yourself" }, { status: 400 });
    }

    const receiver = await prisma.user.findUnique({
      where: { upi_id: to_upi },
    });

    if (!receiver) {
      return NextResponse.json({ error: "Receiver not found" }, { status: 404 });
    }

    // Ledger Rule: use transaction
    const result = await prisma.$transaction(async (tx: any) => {
      const sender = await tx.user.findUnique({
        where: { upi_id: from_upi },
      });

      if (!sender || sender.balance < amount) {
        throw new Error("Insufficient balance");
      }

      // Decrement sender balance
      await tx.user.update({
        where: { upi_id: from_upi },
        data: { balance: { decrement: amount } },
      });

      // Increment receiver balance
      await tx.user.update({
        where: { upi_id: to_upi },
        data: { balance: { increment: amount } },
      });

      // Create transaction record
      const transaction = await tx.transaction.create({
        data: {
          from_upi,
          to_upi,
          amount,
          type: type || "transfer",
          status: "success",
        },
      });

      return transaction;
    });

    return NextResponse.json({ message: "Transfer successful", transaction: result });
  } catch (error: any) {
    console.error("Transfer error:", error);
    return NextResponse.json(
      { error: error.message || "Transfer failed" },
      { status: 400 }
    );
  }
}

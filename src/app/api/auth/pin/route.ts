import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import crypto from "crypto";

function hashPin(pin: string) {
  return crypto.createHash('sha256').update(pin).digest('hex');
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { pin, mode } = await req.json(); // mode: 'set' or 'verify'

    if (!pin || pin.length !== 4 || !/^\d+$/.test(pin)) {
      return NextResponse.json({ error: "Invalid PIN format" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { id: session.userId } });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const hashedPin = hashPin(pin);

    if (mode === 'set') {
        await prisma.user.update({
            where: { id: user.id },
            data: { pin_hash: hashedPin }
        });
        return NextResponse.json({ success: true, message: "PIN set successfully" });
    } else {
        if (user.pin_hash === hashedPin) {
            return NextResponse.json({ success: true });
        } else {
            return NextResponse.json({ error: "Incorrect PIN" }, { status: 400 });
        }
    }

  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

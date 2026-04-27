import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";

function hashPin(pin: string) {
  return crypto.createHash('sha256').update(pin).digest('hex');
}

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get('Authorization');
    if (authHeader !== `Bearer super-secret-gateway-key-12345`) {
      return NextResponse.json({ error: 'Unauthorized gateway access' }, { status: 401 });
    }

    const { upi_id, pin } = await req.json();

    if (!upi_id || !pin) {
      return NextResponse.json({ error: "Missing UPI ID or PIN" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { upi_id } });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const hashedPin = hashPin(pin);

    if (user.pin_hash === hashedPin) {
        return NextResponse.json({ success: true });
    } else {
        return NextResponse.json({ success: false, error: "Incorrect Security PIN" }, { status: 400 });
    }

  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { login } from "@/lib/auth";
import crypto from "crypto";

function hashPassword(password: string) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json();

    if (!username || !password) {
      return NextResponse.json({ error: "Username and password are required" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { username },
    });

    if (!user) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const hashedPassword = hashPassword(password);
    if (hashedPassword !== user.password_hash) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    // Set session
    await login(user.id, user.upi_id);

    return NextResponse.json({ message: "Login successful" });
  } catch (error: any) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "Internal server error", details: error.message }, { status: 500 });
  }
}

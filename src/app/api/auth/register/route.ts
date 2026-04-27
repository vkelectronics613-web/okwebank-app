import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";

function hashPassword(password: string) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const rawUsername = body.username?.trim();
    const password = body.password;

    if (!rawUsername || !password) {
      return NextResponse.json({ error: "Username and password are required" }, { status: 400 });
    }

    // Normalize to prevent "Kittu" vs "kittu" conflicts
    const username = rawUsername.toLowerCase();

    // Check availability
    const existingUser = await prisma.user.findFirst({
      where: { 
        OR: [
            { username: username },
            { upi_id: username + String.fromCharCode(46) + "owb" }
        ]
      },
    });

    if (existingUser) {
      return NextResponse.json({ error: "This username is already taken. Try another." }, { status: 400 });
    }

    const upi_id = username + String.fromCharCode(46) + "owb";
    const password_hash = hashPassword(password);

    await prisma.user.create({
      data: {
        username,
        upi_id,
        password_hash,
      },
    });

    return NextResponse.json(
      { success: true, message: "Welcome to okwebank!" },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("DEBUG: Registration failed:", error.code, error.message);
    
    // Explicitly block Prisma's raw message from ever reaching the UI
    if (error.code === 'P2002') {
        return NextResponse.json({ error: "Username already exists." }, { status: 400 });
    }

    return NextResponse.json({ 
        error: "System busy", 
        details: "We couldn't create your account right now. Please try a different username." 
    }, { status: 500 });
  }
}

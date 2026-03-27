// app/api/admin/auth/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(req) {
  const { password } = await req.json();

  if (password === process.env.ADMIN_PASS) {
    // কুকিতে অথেনটিকেশন সেট করা (Middleware এর জন্য এটি দরকার)
    cookies().set("admin_token", "authorized", {
      httpOnly: true,
      secure: process.env.NODE_SET !== "development",
      maxAge: 60 * 60 * 24, // ১ দিন
      path: "/",
    });

    return NextResponse.json({ message: "Success" }, { status: 200 });
  }

  return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
}
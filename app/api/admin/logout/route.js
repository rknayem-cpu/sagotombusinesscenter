// app/api/admin/logout/route.ts
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const response = NextResponse.json(
      { message: "সফলভাবে লগআউট হয়েছে" }, 
      { status: 200 }
    );

    // কুকি মুছে ফেলার জন্য maxAge: 0 অথবা expires সেট করা হয়
    response.cookies.set("admin_token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // 'NODE_ENV' সাধারণত স্ট্যান্ডার্ড নাম
      sameSite: "lax",
      maxAge: 0, // এটি কুকিটি অবিলম্বে মুছে ফেলবে
      path: "/",
    });

    return response;
  } catch (err) {
    console.error("Logout error:", err);
    return NextResponse.json(
      { message: "লগআউট করতে সমস্যা হয়েছে" }, 
      { status: 500 }
    );
  }
}
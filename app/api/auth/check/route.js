import { cookies } from "next/headers"; // next/navigation hobe na
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const cookieStore = cookies();
    const userId = cookieStore.get('userId')?.value;

    if (userId) {
      return NextResponse.json({ isLoggedIn: true });
    }
    
    return NextResponse.json({ isLoggedIn: false });
  } catch (error) {
    return NextResponse.json({ isLoggedIn: false }, { status: 500 });
  }
}

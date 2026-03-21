import { NextResponse } from 'next/server';

export async function POST() {
  try {
    // 1. Response create kora
    const response = NextResponse.json(
      { message: 'Logout successful' },
      { status: 200 }
    );

    // 2. Cookie delete kora
    // 'userId' namer cookie-tike empty string diye replace kora hoyeche
    // ebong 'expires' value 0 (ba past date) kore deya hoyeche jate eta delete hoye jay
    response.cookies.set('userId', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      expires: new Date(0), // Ati immediate expire hoye jabe
      path: '/',
    });

    return response;

  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

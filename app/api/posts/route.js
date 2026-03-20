import { NextResponse } from 'next/server';
import connectDB from '@/db'; // Apnar DB connection helper
import Post from '@/models/Post';

// POST: Notun product create korar jonno
export async function POST(req) {
  try {
    // 1. Database-e connect kora
    connectDB();

    // 2. Frontend theke data parse kora
    const body = await req.json();
    const { title, imgUrl, imgUrl2, bio, size, price, category } = body;

    // 3. Basic Validation (Backend safety-r jonno)
    if (!title || !imgUrl || !bio || !size || !price || !category) {
      return NextResponse.json(
        { success: false, message: "Sobgulo required field puron korun." },
        { status: 400 }
      );
    }

    // 4. Database-e save kora
    const newPost = await Post.create({
      title,
      imgUrl,
      imgUrl2: imgUrl2 || '', // Optional hole empty string thakbe
      bio,
      size,
      price: Number(price),
      category // Frontend theke ja asbe tai save hobe
    });

    return NextResponse.json(
      { success: true, message: "Product successfully post hoyeche!", data: newPost },
      { status: 201 }
    );

  } catch (error) {
    console.error("Product Post Error:", error);
    return NextResponse.json(
      { success: false, message: "Server-e somossa hoyeche.", error: error.message },
      { status: 500 }
    );
  }
}

// GET: Shob product eksathe dekhar jonno (Optional kintu proyojon hoy)
export async function GET() {
  try {
    connectDB();
    const posts = await Post.find({}).sort({ createdAt: -1 }); // Latest prothome
    
    return NextResponse.json(
      { success: true, data: posts },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Data fetch kora jayni." },
      { status: 500 }
    );
  }
}

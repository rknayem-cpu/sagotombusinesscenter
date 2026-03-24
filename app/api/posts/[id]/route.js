import { NextResponse } from 'next/server';
import connectDB from '@/db';
import Post from '@/models/Post';

// GET: নির্দিষ্ট একটি প্রোডাক্টের ডিটেইলস দেখার জন্য
export async function GET(req, { params }) {
  try {
    await connectDB();
    const { id } = params;

    const post = await Post.findById(id);

    if (!post) {
      return NextResponse.json(
        { success: false, message: "Product poya jayni." },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, data: post },
      { status: 200 }
    );

  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Server error.", error: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(req, { params }) {
  try {
     connectDB();
    const { id } = params;

    const deletedPost = await Post.findByIdAndDelete(id);

    if (!deletedPost) {
      return NextResponse.json({ success: false, message: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Product deleted successfully!" });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Delete failed", error: error.message }, { status: 500 });
  }
}
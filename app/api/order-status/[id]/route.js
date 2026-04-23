import connectDB from '@/db';
import Order from '@/models/Order';
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
    try {
        await connectDB();
        const { id } = params; // Ekhane ID hobe "SBC-123456"

        

        // ১. ভ্যালিডেশন চেক আপডেট করা হয়েছে
        // এখন আর ২৪ ক্যারেক্টার চেক করার দরকার নেই যেহেতু আমরা কাস্টম আইডি ব্যবহার করছি
        if (!id) {
            return NextResponse.json({ message: "অর্ডার আইডি প্রয়োজন।" }, { status: 400 });
        }

        // ২. orderId ফিল্ড দিয়ে সার্চ করা
        const order = await Order.findOne({ orderId: id.trim() })
            .populate("user", "name email")
            .lean();

        if (!order) {
            console.log("No order found in DB with orderId:", id);
            return NextResponse.json({ message: "অর্ডারটি খুঁজে পাওয়া যায়নি!" }, { status: 404 });
        }

        // ৩. সাকসেস রেসপন্স
        return NextResponse.json(order, { 
            status: 200,
            headers: {
                'Cache-Control': 'no-store, max-age=0',
            }
        });
    } catch (error) {
        console.error("Order Fetch Error:", error);
        return NextResponse.json({ message: "সার্ভারে সমস্যা হয়েছে।" }, { status: 500 });
    }
}
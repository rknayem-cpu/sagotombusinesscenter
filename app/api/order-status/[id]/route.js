import connectDB from '@/db';
import Order from '@/models/Order';
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
    try {
        await connectDB();
        const { id } = params;
        
        // Populate user korle user er name/email pawa jabe
        const order = await Order.findById(id).populate("user", "name email");

        if (!order) {
            return NextResponse.json({ message: "Order not found" }, { status: 404 });
        }

        return NextResponse.json(order, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: "Error fetching order" }, { status: 500 });
    }
}
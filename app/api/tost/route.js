import connectDB from '@/db';
import Test from '@/models/Test'; // আপন ার ত ৈর ি কর া মড ে
import { NextResponse } from 'next/server';


 export async function GET(){
connectDB();
 try{

const posts = await Test.find({})

return NextResponse.json({success:true,posts},{status:200})

 }catch(err){

 console.log(err)
return NextResponse.json({success:false},{status:500})
 }

 }
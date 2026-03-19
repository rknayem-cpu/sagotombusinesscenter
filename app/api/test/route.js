import connectDB from '@/db';
import Test from '@/models/Test'; // আপনার তৈরি করা মডেল
import { NextResponse } from 'next/server';


 export async function POST(req){
connectDB();
 try{
 const {name,message} = await req.json()

 console.log(name,message)
const newPost = Test.create({
name,message

})

return NextResponse.json({success:true},{status:200})

 }catch(err){

 console.log(err)
return NextResponse.json({success:false},{status:500})
 }

 }
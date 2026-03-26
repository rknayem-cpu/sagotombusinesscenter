import 'regenerator-runtime/runtime'; 
import { NextResponse } from 'next/server';
import { PDFDocument, rgb } from 'pdf-lib';
import fontkit from '@pdf-lib/fontkit';
import fs from 'fs';
import path from 'path';

export async function POST(req) {
  try {
    const body = await req.json();
    const { name, address, date, items, subTotal, advance, due } = body;

    const pdfDoc = await PDFDocument.create();
    pdfDoc.registerFontkit(fontkit);

    const imagePath = path.join(process.cwd(), 'public', 'memo.jpg');
    const imageBytes = fs.readFileSync(imagePath);
    const image = await pdfDoc.embedJpg(imageBytes);

    const fontPath = path.join(process.cwd(), 'public', 'kalpurush.ttf');
    const fontBytes = fs.readFileSync(fontPath);
    const customFont = await pdfDoc.embedFont(fontBytes);

    // ১. মেমোর সাইজ (৫x৮ ইঞ্চি = ৩৬০x৫৭৬ পয়েন্ট)
    const pageWidth = 360; 
    const pageHeight = 576;
    const page = pdfDoc.addPage([pageWidth, pageHeight]); 

    page.drawImage(image, { x: 0, y: 0, width: pageWidth, height: pageHeight });

    // ২. স্টাইল (ফন্ট সাইজ বাড়ানো হয়েছে এবং বোল্ড লুকের জন্য thickness যোগ করা হয়েছে)
    const headerStyle = { 
      size: 11, // আগের চেয়ে বড়
      font: customFont, 
      color: rgb(0, 0, 0),
      lineHeight: 15,
      opacity: 1,
      thickness: 0.9 // এটি লেখাকে বোল্ড করবে
    };

    const itemStyle = { 
      size: 11, // টেবিলের ফন্টও বাড়ানো হলো
      font: customFont, 
      color: rgb(0, 0, 0),
      thickness: 0.3 // হালকা বোল্ড
    };

    // ৩. পজিশন (আপনার অনুরোধে আরও নিচে নামানো হয়েছে)
    
    // তারিখ (Date) - আগের চেয়ে ১৫ পিক্সেল নিচে
    if (date) page.drawText(date, { x: 278, y: 460-10, ...headerStyle });
    
    // নাম (Name) - নিচে নামানো হলো

    
    if (name) page.drawText(name, { x: 55, y: 435-6, ...headerStyle });
    
    // ঠিকানা (Address) - নিচে নামানো হলো
    if (address) page.drawText(address, { x: 55, y: 412, ...headerStyle });

    // ৪. টেবিলের আইটেম লুপ (নিচে নামানো হয়েছে)
    let currentY = 365-10; // বিবরণ শুরুর উচ্চতা আরও নিচে নামানো হলো
    items.forEach((item, index) => {
      if (item.description) {
        page.drawText(`${index + 1}`, { x: 30, y: currentY, ...itemStyle }); // নং
        page.drawText(item.description, { x: 50, y: currentY, ...itemStyle }); // বিবরণ
        page.drawText(`${item.size || ''}`, { x: 120, y: currentY, ...itemStyle }); // মাপ
        page.drawText(`${item.quantity}`, { x: 205, y: currentY, ...itemStyle }); // পরিমাণ
        page.drawText(`${item.rate}`, { x: 255, y: currentY, ...itemStyle }); // দর
        page.drawText(`${item.total+'/='}`, { x: 300, y: currentY, ...itemStyle }); // টাকা
        
        currentY -= 20; // লাইনের গ্যাপ বাড়ানো হলো যাতে লেখা বড় হলেও লেগে না যায়
      }
    });

    function numberToBanglaWords(amount) {
  const words = ["", "এক", "দুই", "তিন", "চার", "পাঁচ", "ছয়", "সাত", "আট", "নয়", "দশ", "এগারো", "বারো", "তেরো", "চৌদ্দ", "পনেরো", "ষোলো", "সতেরো", "আঠারো", "ঊনিশ", "বিশ", "একুশ", "বাইশ", "তেইশ", "চব্বিশ", "পঁচিশ", "ছাব্বিশ", "সাতাশ", "আটাশ", "ঊনত্রিশ", "ত্রিশ", "একত্রিশ", "বত্রিশ", "তেত্রিশ", "চৌত্রিশ", "পঁয়ত্রিশ", "ছত্রিশ", "সাঁইত্রিশ", "আটত্রিশ", "ঊনচল্লিশ", "চল্লিশ", "একচল্লিশ", "বিয়াল্লিশ", "তেতাল্লিশ", "চুয়াল্লিশ", "পঁয়তাল্লিশ", "ছেচল্লিশ", "সাতচল্লিশ", "আটচল্লিশ", "ঊনপঞ্চাশ", "পঞ্চাশ", "একান্ন", "বাহান্ন", "তিপ্পান্ন", "চুয়ান্ন", "পঞ্চান্ন", "ছাপ্পান্ন", "সাতান্ন", "আটান্ন", "ঊনষাট", "ষাট", "একষট্টি", "বাষট্টি", "তেষট্টি", "চৌষট্টি", "পঁয়ষট্টি", "ছেষট্টি", "সাতষট্টি", "আটষট্টি", "ঊনসত্তর", "সত্তর", "একাত্তর", "বাহাত্তর", "তেয়াত্তর", "চুয়াত্তর", "পঁচাত্তর", "ছেয়াত্তর", "সাতাত্তর", "আটাত্তর", "ঊনআশি", "আশি", "একাশি", "বিরাশি", "তিরাশি", "চুরাশি", "পঁচাশি", "ছেয়াশি", "সাতআশি", "আটাশি", "ঊননব্বই", "নব্বই", "একানব্বই", "বিরানব্বই", "তেরানব্বই", "চুরানব্বই", "পঁচানব্বই", "ছেয়ানব্বই", "সাতানব্বই", "আটানব্বই", "নিরানব্বই"];

  if (amount === 0) return "শূন্য টাকা মাত্র";

  let res = "";
  if (amount >= 10000000) {
    res += numberToBanglaWords(Math.floor(amount / 10000000)) + " কোটি ";
    amount %= 10000000;
  }
  if (amount >= 100000) {
    res += numberToBanglaWords(Math.floor(amount / 100000)) + " লক্ষ ";
    amount %= 100000;
  }
  if (amount >= 1000) {
    res += numberToBanglaWords(Math.floor(amount / 1000)) + " হাজার ";
    amount %= 1000;
  }
  if (amount >= 100) {
    res += words[Math.floor(amount / 100)] + " শত ";
    amount %= 100;
  }
  if (amount > 0) {
    res += words[amount];
  }

  return res.trim();
}

// আপনার API এর POST ফাংশনের ভেতরে:
const totalInWords = numberToBanglaWords(subTotal);

// পিডিএফ-এ কথাটি লেখার জন্য (পজিশন আপনার মেমো অনুযায়ী চেক করে নিন)
page.drawText(`${totalInWords} টাকা মাত্র`, { 
  x: 60, 
  y: 98, // মেমোর যেখানে "কথায়" লেখা আছে সেই উচ্চতা
  size: 11, 
  font: customFont, 
  color: rgb(0, 0, 0),
  thickness: 0.8
});

    // ৫. নিচের হিসাব (পজিশন অ্যাডজাস্ট করা হয়েছে)
    const bottomX = 290;
    page.drawText(`${subTotal+'/='}`, { x: bottomX, y: 130-25, ...headerStyle }); 
    page.drawText(`${advance+'/='}`, { x: bottomX, y: 110-25, ...headerStyle }); 
    page.drawText(`${due+'/='}`, { x: bottomX, y: 90-24, ...headerStyle });

    const pdfBytes = await pdfDoc.save();

    return new Response(pdfBytes, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename=memo.pdf',
      },
    });

  } catch (err) {
    console.error("Error:", err);
    return NextResponse.json({ error: "PDF তৈরি করতে সমস্যা হয়েছে" }, { status: 500 });
  }
}
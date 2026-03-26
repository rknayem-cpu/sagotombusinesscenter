"use client";
import { useState, ChangeEvent } from "react";

// টাইপ ইন্টারফেস তৈরি
interface Item {
  description: string;
  size: string;
  quantity: number;
  rate: number;
  total: number;
}

interface FormData {
  name: string;
  address: string;
  date: string;
  items: Item[];
  advance: number;
}

export default function MemoForm() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    address: "",
    date: "",
    items: [{ description: "", size: "", quantity: 1, rate: 0, total: 0 }],
    advance: 0,
  });

  // আইটেমের হিসাব আপডেট করা
  const updateItem = (index: number, field: keyof Item, value: string | number) => {
    const newItems = [...formData.items];
    
    // টাইপ কাস্টিং নিশ্চিত করা
    (newItems[index][field] as string | number) = value;

    if (field === "quantity" || field === "rate") {
      newItems[index].total = newItems[index].quantity * newItems[index].rate;
    }
    
    setFormData({ ...formData, items: newItems });
  };

  const addItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { description: "", size: "", quantity: 1, rate: 0, total: 0 }],
    });
  };

  const subTotal = formData.items.reduce((sum, item) => sum + item.total, 0);
  const due = subTotal - formData.advance;

  const handleSubmit = async () => {
    try {
      const res = await fetch("/api/generate-memo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, subTotal, due }),
      });

      if (res.ok) {
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `memo_${formData.name || 'document'}.pdf`;
        a.click();
        window.URL.revokeObjectURL(url); // মেমোরি ক্লিনআপ
      }
    } catch (error) {
      console.error("Error generating PDF:", error);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto bg-white shadow-lg border rounded-lg mt-20 min-h-screen text-black">
      <h2 className="text-2xl font-bold mb-6 text-center text-blue-700">বিজনেস সেন্টার মেমো জেনারেটর</h2>
      
      <div className="grid grid-cols-2 gap-4 mb-6">
        <input 
          type="text" 
          placeholder="নাম" 
          className="border p-2 rounded" 
          onChange={(e: ChangeEvent<HTMLInputElement>) => setFormData({...formData, name: e.target.value})} 
        />
        <input 
          type="date" 
          className="border p-2 rounded" 
          onChange={(e: ChangeEvent<HTMLInputElement>) => setFormData({...formData, date: e.target.value})} 
        />
        <input 
          type="text" 
          placeholder="ঠিকানা" 
          className="border p-2 col-span-2 rounded" 
          onChange={(e: ChangeEvent<HTMLInputElement>) => setFormData({...formData, address: e.target.value})} 
        />
      </div>

      <table className="w-full mb-4 border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2 text-left">বিবরণ</th>
            <th className="border p-2">মাপ</th>
            <th className="border p-2">পরিমান</th>
            <th className="border p-2">দর</th>
            <th className="border p-2">টাকা</th>
          </tr>
        </thead>
        <tbody>
          {formData.items.map((item, index) => (
            <tr key={index} className="hover:bg-gray-50">
              <td className="border p-1">
                <input 
                  className="w-full p-1 outline-none" 
                  value={item.description}
                  onChange={(e) => updateItem(index, 'description', e.target.value)} 
                />
              </td>
              <td className="border p-1">
                <input 
                  className="w-full p-1 outline-none text-center" 
                  value={item.size}
                  onChange={(e) => updateItem(index, 'size', e.target.value)} 
                />
              </td>
              <td className="border p-1">
                <input 
                  type="number" 
                  className="w-full p-1 outline-none text-center" 
                  value={item.quantity}
                  onChange={(e) => updateItem(index, 'quantity', Number(e.target.value))} 
                />
              </td>
              <td className="border p-1">
                <input 
                  type="number" 
                  className="w-full p-1 outline-none text-center" 
                  value={item.rate}
                  onChange={(e) => updateItem(index, 'rate', Number(e.target.value))} 
                />
              </td>
              <td className="border p-1 text-right font-semibold">{item.total}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <button 
        onClick={addItem} 
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded mb-6 transition-colors"
      >
        + আইটেম যোগ করুন
      </button>

      <div className="flex flex-col items-end gap-3 p-4 bg-gray-50 rounded">
        <p className="text-lg">সর্বমোট: <span className="font-bold">{subTotal}</span> টাকা</p>
        <div className="flex items-center gap-2">
          <span>অগ্রীম:</span>
          <input 
            type="number" 
            className="border p-1 w-32 rounded text-right" 
            value={formData.advance}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setFormData({...formData, advance: Number(e.target.value)})} 
          />
        </div>
        <p className="font-bold text-xl text-red-600">জমা/বাকি: {due} টাকা</p>
      </div>

      <button 
        onClick={handleSubmit} 
        className="mt-8 bg-green-600 hover:bg-green-700 text-white px-6 py-4 rounded-lg w-full font-bold text-lg shadow-md transition-all"
      >
        PDF ডাউনলোড করুন
      </button>
    </div>
  );
}
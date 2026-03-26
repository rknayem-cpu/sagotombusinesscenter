"use client";
import { useState, ChangeEvent } from "react";
import { Trash2 } from "lucide-react"; // lucide-react আইকন লাইব্রেরি ব্যবহার করা হয়েছে

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

// শুরুর ব্ল্যাঙ্ক স্টেট
const initialState: FormData = {
  name: "",
  address: "",
  date: "",
  items: [{ description: "", size: "", quantity: 1, rate: 0, total: 0 }],
  advance: 0,
};

export default function MemoForm() {
  const [formData, setFormData] = useState<FormData>(initialState);

  const updateItem = (index: number, field: keyof Item, value: string | number) => {
    const newItems = [...formData.items];
    (newItems[index][field] as any) = value;

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

  // আইটেম ডিলিট করার ফাংশন
  const removeItem = (index: number) => {
    if (formData.items.length > 1) {
      const newItems = formData.items.filter((_, i) => i !== index);
      setFormData({ ...formData, items: newItems });
    }
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
        a.download = `memo_${formData.name || "memo"}.pdf`;
        a.click();
        
        // PDF ডাউনলোডের পর ফর্ম রিসেট
        setFormData(initialState);
        alert("PDF সফলভাবে তৈরি হয়েছে এবং ফর্ম রিসেট করা হয়েছে।");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="p-6 max-w-4xl mt-20 mx-auto bg-white border rounded-xl shadow-sm mt-10 text-slate-800">
      <h2 className="text-xl font-bold mb-6 border-b pb-2 text-gray-700">মেমো জেনারেটর</h2>
      
      {/* টপ সেকশন */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <input 
          type="text" placeholder="কাস্টমারের নাম" className="border p-2 rounded-md outline-blue-500" 
          value={formData.name}
          onChange={(e) => setFormData({...formData, name: e.target.value})} 
        />
        <input 
          type="date" className="border p-2 rounded-md outline-blue-500" 
          value={formData.date}
          onChange={(e) => setFormData({...formData, date: e.target.value})} 
        />
        <input 
          type="text" placeholder="ঠিকানা" className="border p-2 col-span-full rounded-md outline-blue-500" 
          value={formData.address}
          onChange={(e) => setFormData({...formData, address: e.target.value})} 
        />
      </div>

      {/* টেবিল সেকশন */}
      <div className="overflow-x-auto">
        <table className="w-full mb-4 border">
          <thead className="bg-gray-50 text-sm">
            <tr>
              <th className="border p-2 text-left">বিবরণ</th>
              <th className="border p-2 w-20">মাপ</th>
              <th className="border p-2 w-20">পরিমান</th>
              <th className="border p-2 w-24">দর</th>
              <th className="border p-2 w-28">টাকা</th>
              <th className="border p-2 w-12"></th>
            </tr>
          </thead>
          <tbody>
            {formData.items.map((item, index) => (
              <tr key={index}>
                <td className="border p-1"><input className="w-full px-2" value={item.description} onChange={(e) => updateItem(index, 'description', e.target.value)} /></td>
                <td className="border p-1"><input className="w-full text-center" value={item.size} onChange={(e) => updateItem(index, 'size', e.target.value)} /></td>
                <td className="border p-1"><input type="number"  className="w-full text-center" 
                value={item.quantity} onChange={(e) => updateItem(index, 'quantity', Number(e.target.value))} /></td>
                <td className="border p-1"><input  
                className="w-full text-center" value={item.rate} onChange={(e) => updateItem(index, 'rate', Number(e.target.value))} /></td>
                <td className="border p-1 text-right font-medium px-2">{item.total}</td>
                <td className="border p-1 text-center">
                  <button 
                    onClick={() => removeItem(index)}
                    className="text-red-500 hover:bg-red-50 p-1 rounded"
                    title="Delete"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button onClick={addItem} className="text-sm bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-md font-medium transition-colors">
        + আইটেম যোগ করুন
      </button>

      {/* ক্যালকুলেশন সেকশন */}
      <div className="flex flex-col items-end mt-6 gap-2 border-t pt-4">
        <p className="text-gray-600 text-sm">সর্বমোট: <span className="text-black font-bold text-base">{subTotal}</span></p>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">অগ্রীম জমা:</span>
          <input 
             className="border px-2 py-1 w-24 rounded text-right outline-blue-500" 
            value={formData.advance}
            onChange={(e) => setFormData({...formData, advance: Number(e.target.value)})} 
          />
        </div>
        <p className="text-lg font-bold">বাকি: <span className="text-red-600">{due}</span> টাকা</p>
      </div>

      <button 
        onClick={handleSubmit} 
        className="mt-8 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg w-full font-semibold shadow-sm transition-all"
      >
        PDF ডাউনলোড এবং ক্লিয়ার করুন
      </button>
    </div>
  );
}
"use client";
import { useState } from "react";

export default function MemoForm() {
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    date: "",
    items: [{ description: "", size: "", quantity: 1, rate: 0, total: 0 }],
    advance: 0,
  });

  // আইটেমের হিসাব আপডেট করা
  const updateItem = (index, field, value) => {
    const newItems = [...formData.items];
    newItems[index][field] = value;
    
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
      a.download = `memo_${formData.name}.pdf`;
      a.click();
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto bg-gray-50 mt-20 min-h-screen">
      <h2 className="text-2xl font-bold mb-4">স্বাগতম বিজনেস সেন্টার মেমো জেনারেটর</h2>
      
      <div className="grid grid-cols-2 gap-4 mb-6">
        <input type="text" placeholder="নাম" className="border p-2" onChange={(e) => setFormData({...formData, name: e.target.value})} />
        <input type="date" className="border p-2" onChange={(e) => setFormData({...formData, date: e.target.value})} />
        <input type="text" placeholder="ঠিকানা" className="border p-2 col-span-2" onChange={(e) => setFormData({...formData, address: e.target.value})} />
      </div>

      <table className="w-full mb-4 border-collapse border">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">বিবরণ</th>
            <th className="border p-2">মাপ</th>
            <th className="border p-2">পরিমান</th>
            <th className="border p-2">দর</th>
            <th className="border p-2">টাকা</th>
          </tr>
        </thead>
        <tbody>
          {formData.items.map((item, index) => (
            <tr key={index}>
              <td className="border p-1"><input className="w-full" onChange={(e) => updateItem(index, 'description', e.target.value)} /></td>
              <td className="border p-1"><input className="w-full" onChange={(e) => updateItem(index, 'size', e.target.value)} /></td>
              <td className="border p-1"><input type="number" className="w-full" onChange={(e) => updateItem(index, 'quantity', Number(e.target.value))} /></td>
              <td className="border p-1"><input type="number" className="w-full" onChange={(e) => updateItem(index, 'rate', Number(e.target.value))} /></td>
              <td className="border p-1 text-right">{item.total}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <button onClick={addItem} className="bg-blue-500 text-white px-4 py-2 rounded mb-4">+ আইটেম যোগ করুন</button>

      <div className="flex flex-col items-end gap-2">
        <p>সর্বমোট: {subTotal}</p>
        <div>অগ্রীম: <input type="number" className="border p-1" onChange={(e) => setFormData({...formData, advance: Number(e.target.value)})} /></div>
        <p className="font-bold">জমা/বাকি: {due}</p>
      </div>

      <button onClick={handleSubmit} className="mt-6 bg-green-600 text-white px-6 py-3 rounded w-full">PDF ডাউনলোড করুন</button>
    </div>
  );
}
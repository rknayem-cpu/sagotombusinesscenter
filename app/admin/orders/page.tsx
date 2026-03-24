"use client";

import React, { useEffect, useState } from 'react';
import { Search, Trash2, CheckCircle, Truck, Loader2, Package, MapPin, Phone } from 'lucide-react';
import Swal from 'sweetalert2';

interface Order {
  _id: string;
  phone: string;
  totalAmount: number;
  status: string;
  createdAt: string;
  shippingAddress: string;
  items: {
    title: string;
    quantity: number;
    price: number;
    imgUrl: string;
  }[];
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/admin/orders');
      const data = await res.json();
      if (data.success) setOrders(data.data);
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  useEffect(() => { fetchOrders(); }, []);

  const filteredOrders = orders.filter(o => o._id.includes(searchTerm) || o.phone.includes(searchTerm));

  const updateStatus = async (id: string, newStatus: string) => {
    const res = await fetch(`/api/admin/orders/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus })
    });
    if (res.ok) {
      Swal.fire({ toast: true, position: 'top-end', icon: 'success', title: `Status: ${newStatus}`, showConfirmButton: false, timer: 1000 });
      fetchOrders();
    }
  };

  const deleteOrder = async (id: string) => {
    Swal.fire({
      title: 'Delete?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      confirmButtonText: 'Yes'
    }).then(async (result) => {
      if (result.isConfirmed) {
        await fetch(`/api/admin/orders/${id}`, { method: 'DELETE' });
        fetchOrders();
      }
    });
  };

  if (loading) return <div className="flex justify-center items-center min-h-screen"><Loader2 className="animate-spin text-orange-600" size={40} /></div>;

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 mt-16 font-sans">
      <div className="max-w-[1600px] mx-auto">
        
        {/* Simple Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          <h1 className="text-xl font-bold flex items-center gap-2 uppercase tracking-tight">
            <Package className="text-orange-600" size={24} /> Total Orders: {filteredOrders.length}
          </h1>
          <input 
            type="text" placeholder="Search ID or Phone..." 
            className="w-full md:w-80 p-2.5 rounded-xl border border-gray-300 outline-none focus:ring-2 focus:ring-orange-500 font-medium text-sm"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* The Grid: PC 3, XL 4 - But cards are now much SHORTER */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
          {filteredOrders.map((order) => (
            <div key={order._id} className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm flex flex-col hover:border-orange-300 transition-all">
              
              {/* Top Info */}
              <div className="flex justify-between items-start mb-3">
                <span className="text-[10px] font-bold text-gray-400 font-mono">#{order._id.slice(-8)}</span>
                <span className={`text-[10px] font-black px-2 py-0.5 rounded uppercase ${
                  order.status === 'Delivered' ? 'bg-green-100 text-green-700' : 
                  order.status === 'Shipped' ? 'bg-blue-100 text-blue-700' : 'bg-orange-100 text-orange-700'
                }`}>
                  {order.status}
                </span>
              </div>

              {/* Customer Row */}
              <div className="mb-3">
                <p className="text-lg font-bold text-gray-900 leading-none">{order.phone}</p>
                <p className="text-[11px] text-gray-500 mt-1 truncate font-medium">
                  <MapPin size={10} className="inline mr-0.5" /> {order.shippingAddress}
                </p>
              </div>

              {/* Items Section - Compact Horizontal Box */}
              <div className="bg-gray-50 rounded-xl p-2 mb-3 border border-gray-100">
                <div className="max-h-[140px] overflow-y-auto space-y-2 pr-1">
                  {order.items.map((item, i) => (
                    <div key={i} className="flex items-center gap-2 bg-white p-1.5 rounded-lg border border-gray-100">
                      <img src={item.imgUrl} className="h-20 w-20 object-cover rounded-md flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="text-[16px] font-bold text-gray-800 truncate leading-tight uppercase">{item.title}</p>
                        <p className="text-[16px] text-gray-600 font-medium">
                          {item.quantity} x ৳{item.price} = <span className="text-orange-600 font-bold">৳{item.quantity * item.price}</span>
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total & Bottom Buttons */}
              <div className="mt-auto">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-[10px] font-bold text-gray-400 uppercase">Grand Total:</span>
                  <span className="text-xl font-black text-orange-600 tracking-tighter">৳{order.totalAmount}</span>
                </div>

                <div className="grid grid-cols-3 gap-1.5">
                  <button onClick={() => updateStatus(order._id, 'Shipped')} className="py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex justify-center active:scale-95 shadow-sm transition">
                    <Truck size={18} />
                  </button>
                  <button onClick={() => updateStatus(order._id, 'Delivered')} className="py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex justify-center active:scale-95 shadow-sm transition">
                    <CheckCircle size={18} />
                  </button>
                  <button onClick={() => deleteOrder(order._id)} className="py-2 bg-gray-100 text-red-600 rounded-lg hover:bg-red-600 hover:text-white flex justify-center active:scale-95 shadow-sm transition border border-gray-200">
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>

            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
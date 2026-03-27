"use client";

import React, { useEffect, useState } from 'react';
import { Search, Trash2, CheckCircle, Truck, Loader2, Package, MapPin } from 'lucide-react';
import Swal from 'sweetalert2';
import { useRouter } from 'next/navigation';
interface Order {
  _id: string;
  phone: string;
  totalAmount: number;
  status: string;
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
  const router = useRouter();
  // আপনার সফল হওয়া পেজটির মতো একদম সিম্পল ফেচিং
  const fetchOrders = async () => {
    try {
      // ক্যাশ ব্লাস্টিং টাইমস্ট্যাম্পসহ
      const res = await fetch(`/api/admin/orders?t=${Date.now()}`, {
        cache: 'no-store'
      });
      const data = await res.json();
      if (data.success) {
        setOrders(data.data);
      }
    } catch (err) {
      console.error("Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // স্ট্যাটাস আপডেট লজিক
  const updateStatus = async (id: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/admin/orders/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });

      if (res.ok) {
        // রিলোড ছাড়া UI আপডেট (Optimistic Update)
        setOrders(prev => 
          prev.map(order => order._id === id ? { ...order, status: newStatus } : order)
        );
        
        Swal.fire({ 
          toast: true, position: 'top-end', icon: 'success', 
          title: `Status: ${newStatus}`, showConfirmButton: false, timer: 1000 
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  // ডিলিট লজিক (আপনার সফল হওয়া প্রোডাক্ট পেজ থেকে নেওয়া)
  const deleteOrder = async (id: string) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Yes, delete it!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        const res = await fetch(`/api/admin/orders/${id}`, { method: 'DELETE' });
        if (res.ok) {
          Swal.fire('Deleted!', 'Order has been removed.', 'success');
          // আপনার সফল পেজটির মতো সরাসরি লিস্ট আপডেট
          setOrders(prev => prev.filter(order => order._id !== id));
        }
      }
    });
  };

  const filteredOrders = orders.filter(o => 
    o._id.toLowerCase().includes(searchTerm.toLowerCase()) || 
    o.phone.includes(searchTerm)
  );




  if (loading) return (
    <div className="flex justify-center items-center min-h-screen">
      <Loader2 className="animate-spin text-orange-600" size={40} />
      <p className="ml-2 font-bold text-gray-400">LOADING ORDERS...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 mt-16 font-sans">
      <div className="max-w-[1600px] mx-auto">
        
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          <h1 className="text-xl font-black flex items-center gap-2 uppercase tracking-tight">
            <Package className="text-orange-600" size={24} /> 
            Orders Panel <span className="text-gray-300">/</span> {filteredOrders.length}
          </h1>
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input 
              type="text" 
              placeholder="Search ID or Phone..." 
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 outline-none focus:ring-4 focus:ring-orange-100 focus:border-orange-500 font-bold text-sm transition-all"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
          {filteredOrders.map((order) => (
            <div key={order._id} className="bg-white border-2 border-gray-100 rounded-[2rem] p-5 shadow-sm flex flex-col hover:border-orange-300 transition-all group">
              
              <div className="flex justify-between items-start mb-4">
                <span className="text-[10px] font-black text-gray-300 font-mono tracking-tighter uppercase">ID: {order._id.slice(-10)}</span>
                <span className={`text-[9px] font-black px-2.5 py-1 rounded-full uppercase tracking-widest ${
                  order.status === 'Delivered' ? 'bg-green-50 text-green-600' : 
                  order.status === 'Shipped' ? 'bg-blue-50 text-blue-600' : 'bg-orange-50 text-orange-600'
                }`}>
                  {order.status}
                </span>
              </div>

              <div className="mb-4">
                <p className="text-xl font-black text-gray-900 leading-none tracking-tight">{order.phone}</p>
                <p className="text-[11px] text-gray-400 mt-2 truncate font-bold uppercase flex items-center gap-1">
                  <MapPin size={12} className="text-orange-500" /> {order.shippingAddress}
                </p>
              </div>

              <div className="bg-gray-50 rounded-[1.5rem] p-3 mb-4 border border-gray-100">
                <div className="max-h-[160px] overflow-y-auto space-y-2 pr-1 custom-scrollbar">
                  {order.items.map((item, i) => (
                    <div key={i} className="flex items-center gap-3 bg-white p-2 rounded-xl border border-gray-50">
                      <img src={item.imgUrl} className="h-12 w-12 object-cover rounded-lg flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="text-[12px] font-black text-gray-800 truncate leading-tight uppercase tracking-tighter">{item.title}</p>
                        <p className="text-[11px] text-gray-500 font-bold mt-0.5">
                          {item.quantity} x <span className="text-orange-600">৳{item.price}</span>
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-auto">
                <div className="flex justify-between items-center mb-4 px-1">
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Amount</span>
                  <span className="text-2xl font-black text-gray-950 tracking-tighter">৳{order.totalAmount}</span>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <button onClick={() => updateStatus(order._id, 'Shipped')} className="h-12 bg-gray-900 text-white rounded-xl hover:bg-blue-600 flex items-center justify-center transition active:scale-90" title="Mark Shipped">
                    <Truck size={20} />
                  </button>
                  <button onClick={() => updateStatus(order._id, 'Delivered')} className="h-12 border-2 border-gray-950 text-gray-950 rounded-xl hover:bg-gray-950 hover:text-white flex items-center justify-center transition active:scale-90" title="Mark Delivered">
                    <CheckCircle size={20} />
                  </button>
                  <button onClick={() => deleteOrder(order._id)} className="h-12 bg-red-50 text-red-600 rounded-xl hover:bg-red-600 hover:text-white flex items-center justify-center transition active:scale-90 border border-red-100" title="Delete Order">
                    <Trash2 size={20} />
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
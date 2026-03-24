"use client";

import React, { useEffect, useState } from 'react';
import { Trash2, Package, Search, ExternalLink, Loader2, IndianRupee } from 'lucide-react';
import Swal from 'sweetalert2';

interface Product {
  _id: string;
  title: string;
  imgUrl: string;
  price: number;
  category: string;
  size: string;
}

export default function ManageProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/posts');
      const data = await res.json();
      if (data.success) setProducts(data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProducts(); }, []);

  const handleDelete = async (id: string) => {
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
        const res = await fetch(`/api/posts/${id}`, { method: 'DELETE' });
        if (res.ok) {
          Swal.fire('Deleted!', 'Product has been removed.', 'success');
          fetchProducts();
        }
      }
    });
  };

  const filteredProducts = products.filter(p => 
    p.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return (
    <div className="flex flex-col justify-center items-center min-h-screen gap-4">
      <Loader2 className="animate-spin text-blue-600" size={40} />
      <p className="font-bold text-slate-500 uppercase tracking-widest">Loading Inventory...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-10 mt-16">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-6">
          <div>
            <h1 className="text-3xl font-black text-slate-900 flex items-center gap-3 uppercase">
              <Package size={32} className="text-blue-600" /> Manage Inventory
            </h1>
            <p className="text-slate-500 font-medium">Total Products: {filteredProducts.length}</p>
          </div>
          
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input 
              type="text" 
              placeholder="Search by title or category..." 
              className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-slate-200 outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 font-medium transition-all"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Product Table Card */}
        <div className="bg-white rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-900 text-white uppercase text-[11px] tracking-widest font-bold">
                  <th className="px-6 py-5">Product</th>
                  <th className="px-6 py-5">Category</th>
                  <th className="px-6 py-5">Price</th>
                  <th className="px-6 py-5">Size/Specs</th>
                  <th className="px-6 py-5 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredProducts.map((product) => (
                  <tr key={product._id} className="hover:bg-slate-50/80 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <img 
                          src={product.imgUrl} 
                          alt="" 
                          className="h-16 w-16 object-cover rounded-xl shadow-sm border border-slate-200"
                        />
                        <div className="min-w-0">
                          <p className="font-bold text-slate-800 text-sm truncate uppercase tracking-tight">{product.title}</p>
                          <span className="text-[10px] font-mono text-slate-400">ID: #{product._id.slice(-6)}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 bg-blue-50 text-blue-600 text-[11px] font-black rounded-full uppercase">
                        {product.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-black text-slate-900">
                      ৳{product.price}
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-slate-500 italic">
                      {product.size}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center gap-2">
                        <button 
                          onClick={() => window.open(product.imgUrl, '_blank')}
                          className="p-3 bg-slate-100 text-slate-600 rounded-xl hover:bg-slate-200 transition-all active:scale-90"
                          title="View Image"
                        >
                          <ExternalLink size={18} />
                        </button>
                        <button 
                          onClick={() => handleDelete(product._id)}
                          className="p-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition-all active:scale-90 shadow-sm"
                          title="Delete Product"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {filteredProducts.length === 0 && (
            <div className="text-center py-20">
              <Package size={48} className="mx-auto text-slate-200 mb-4" />
              <p className="text-slate-400 font-bold uppercase tracking-widest">No products found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
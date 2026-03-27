"use client";
import Link from "next/link";
import { HiPlusCircle, HiShoppingCart, HiCollection } from "react-icons/hi";
import Logout from '@/components/Logout';

export default function WhiteAdminDashboard() {
  const adminLinks = [
    {
      name: "Add New Post",
      desc: "Create and publish a new blog or product listing",
      href: "/admin/addpost",
      icon: <HiPlusCircle size={40} />,
      bgColor: "bg-blue-50",
      iconColor: "text-blue-600",
      borderColor: "hover:border-blue-400"
    },
    {
      name: "Manage Orders",
      desc: "Track, edit, and process customer orders",
      href: "/admin/orders",
      icon: <HiShoppingCart size={40} />,
      bgColor: "bg-emerald-50",
      iconColor: "text-emerald-600",
      borderColor: "hover:border-emerald-400"
    },
    {
      name: "All Posts",
      desc: "View and manage all your published content",
      href: "/admin/posts",
      icon: <HiCollection size={40} />,
      bgColor: "bg-purple-50",
      iconColor: "text-purple-600",
      borderColor: "hover:border-purple-400"
    },
  ];

  return (
    <div className="min-h-screen mt-16 bg-[#f8fafc] flex flex-col items-center justify-center p-6 lg:p-12 font-sans">
      {/* Header */}
      <div className="text-center mb-16">
        <h1 className="text-4xl font-black text-slate-800 mb-3 tracking-tight">
          Admin <span className="text-blue-600">Dashboard</span>
        </h1>
        <div className="h-1.5 w-20 bg-blue-600 mx-auto rounded-full mb-4"></div>
        <p className="text-slate-500 font-medium">Manage your platform efficiently</p>
      </div>

      {/* Card Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl">
        {adminLinks.map((item, index) => (
          <Link key={index} href={item.href} className="group">
            <div className={`
              h-full bg-white border border-slate-200 p-10 rounded-[2.5rem] 
              flex flex-col items-center text-center transition-all duration-500
              hover:shadow-[0_20px_50px_rgba(0,0,0,0.05)] hover:-translate-y-2
              active:scale-95 ${item.borderColor}
            `}>
              
              {/* Icon Circle */}
              <div className={`
                mb-8 p-6 rounded-3xl ${item.bgColor} ${item.iconColor}
                transition-transform duration-500 group-hover:rotate-[10deg] group-hover:scale-110
              `}>
                {item.icon}
              </div>

              {/* Text Info */}
              <h2 className="text-2xl font-bold text-slate-800 mb-4 transition-colors group-hover:text-blue-600">
                {item.name}
              </h2>
              <p className="text-slate-500 leading-relaxed font-medium">
                {item.desc}
              </p>

              {/* Hidden Action Button (Appears on Hover) */}
              <div className="mt-8 px-6 py-2 rounded-full bg-slate-100 text-slate-600 text-xs font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                Manage Now
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Simple Footer */}
      <div className="mt-20 flex items-center gap-2 text-slate-400 font-semibold text-sm tracking-widest uppercase">
        <span className="w-8 h-[2px] bg-slate-200"></span>
        Control Center
        <span className="w-8 h-[2px] bg-slate-200"></span>
      </div>
      <Logout />
    </div>
  );
}
import { useRouter } from "next/navigation";
import { useState } from "react";
import { IoLogOut } from "react-icons/io5";
import { AiOutlineLoading3Quarters } from "react-icons/ai"; // Adding a spinner icon

export default function Logout() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const adminLogout = async () => {
    if (loading) return; // Prevent double-clicks

    setLoading(true);
    try {
      const res = await fetch('/api/admin/logout', { method: 'GET' });
      if (res.ok) {
        router.push('/login-admin');
      }
    } catch (err) {
      console.error("Logout Error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      disabled={loading}
      onClick={adminLogout}
      style={{ zIndex: 99999 }}
      className={`
        fixed bottom-8 right-6 p-3 rounded-2xl flex items-center justify-center
        transition-all duration-300 ease-in-out border border-white/10
        shadow-[0_8px_30px_rgb(0,0,0,0.12)] backdrop-blur-md
        ${loading 
          ? "bg-gray-800 cursor-not-allowed scale-95" 
          : "bg-black/80 hover:bg-red-600 group active:scale-90 cursor-pointer"
        }
      `}
    >
      {loading ? (
        <AiOutlineLoading3Quarters className="animate-spin text-white" size={26} />
      ) : (
        <IoLogOut 
          size={30} 
          className="text-red-500 transition-colors duration-300 group-hover:text-white" 
        />
      )}
    </button>
  );
}
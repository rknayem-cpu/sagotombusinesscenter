import { FaFacebookF, FaInstagram, FaWhatsapp, FaEnvelope } from "react-icons/fa";

export default function Footer() {
  const socialLinks = [
    { icon: <FaFacebookF />, hover: "hover:text-blue-600", href: "https://www.facebook.com/Sagotombuisnesscenter" },
    { icon: <FaWhatsapp />, hover: "hover:text-green-500", href: "https://wa.me/8801997219858" },
    { icon: <FaEnvelope />, hover: "hover:text-orange-500", href: "mailto:rashidul2309@gmail.com" },
  ];

  return (
    <footer
    suppressHydrationWarning={false}
    
     className="w-full bg-white/40 backdrop-blur-xl 
     border-t border-orange/30 py-10 mt-20">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8 items-center text-center md:text-left">
        
        {/* Logo Section */}
        <div className="flex flex-col items-center md:items-start group">
          <img src="sbc.png" alt="Logo" className="w-20 mb-3 transition-transform duration-500 group-hover:rotate-6 group-hover:scale-110" />
          <h2 className="text-xl mt-3 font-black bg-gradient-to-r from-orange-600 to-red-500 bg-clip-text text-transparent">
            Sagotom Business Center
          </h2>
        </div>

        {/* Links Section */}
        <nav className="flex justify-center gap-6 text-sm font-bold text-slate-600">
          {['শর্তাবলী', 'গোপনীয়তা', 'যোগাযোগ'].map(l => (
            <a key={l} href="#" target="_blank" className="hover:text-orange-600 transition-colors">{l}</a>
          ))}
        </nav>

        {/* Social Icons */}
        <div className="flex justify-center md:justify-end gap-5">
          {socialLinks.map((s, i) => (
            <a key={i} href={s.href} className={`text-xl text-slate-400 transition-all duration-300 hover:-translate-y-1.5 ${s.hover}`}>
              {s.icon}
            </a>
          ))}
        </div>

        {/* Copyright */}
        <div className="md:col-span-3 border-t border-slate-200/50 mt-6 pt-6 text-center">
          <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">
            © {new Date().getFullYear()} স্বত্ব সংরক্ষিত — Sagotom Business Center
          </p>
        </div>
      </div>
    </footer>
  );
}

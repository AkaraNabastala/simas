import React from 'react';

const Footer = () => {
  return (
    <footer className="h-14 bg-white border-t border-slate-200 px-10 flex items-center justify-between font-['Poppins']">
      <p className="text-[10px] font-black text-slate-700 uppercase tracking-[0.1em]">
        © 2026 <span className="text-blue-700">SIMAS PRO</span> • SMK NEGERI SIMAS INDONESIA
      </p>
      <div className="flex items-center gap-6">
        <span className="text-[10px] font-black text-slate-600 hover:text-blue-700 cursor-pointer uppercase tracking-widest transition-colors">Bantuan</span>
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">VERSI 1.0.5</span>
      </div>
    </footer>
  );
};

export default Footer;
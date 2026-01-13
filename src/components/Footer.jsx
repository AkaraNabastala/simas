import React from 'react';

const Footer = () => {
  return (
    <footer className="h-12 bg-white border-t border-slate-100 px-8 flex items-center justify-between">
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
        © 2026 SIMAS Pro System • <span className="text-blue-600/50">SMK Negeri 1</span>
      </p>
      <div className="flex gap-4">
        <span className="text-[10px] font-black text-slate-300 hover:text-blue-600 cursor-pointer uppercase tracking-tighter transition-colors">Help Center</span>
        <span className="text-[10px] font-black text-slate-300 hover:text-blue-600 cursor-pointer uppercase tracking-tighter transition-colors">v1.0.2</span>
      </div>
    </footer>
  );
};

export default Footer;
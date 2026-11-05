"use client";
export const GridBackground = () => {
  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
      {/* The Technical Grid - Lower opacity for subtlety */}
      <div 
        className="absolute inset-0 opacity-[0.05]" 
        style={{
          backgroundImage: `linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }}
      />
      {/* Radial fade so the grid doesn't touch the edges harshly */}
      <div className="absolute inset-0 bg-brand-dark [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black_80%)]" />

      {/* Minimalist glowing nodes for tech feel */}
      <div className="absolute top-[20%] left-[10%] w-1.5 h-1.5 bg-brand-cyan rounded-full shadow-[0_0_10px_#2af5d2]" />
      <div className="absolute bottom-[30%] right-[15%] w-2 h-2 bg-brand-purple rounded-full shadow-[0_0_15px_#b16cea]" />
    </div>
  );
};
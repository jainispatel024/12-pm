import React from 'react';

export const GlitchEffect: React.FC = () => {
  return (
    <div className="fixed inset-0 z-[100] bg-black pointer-events-none flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 glitch-layer glitch-1"></div>
      <div className="absolute inset-0 glitch-layer glitch-2"></div>
      
      {/* Random chaotic text elements */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white font-mono text-6xl font-bold mix-blend-exclusion animate-pulse">
        CRITICAL_ERROR
      </div>
      <div className="absolute top-1/3 left-1/4 text-red-500 font-mono text-2xl animate-bounce">
        0xFF12039A
      </div>
       <div className="absolute bottom-1/3 right-1/4 text-green-500 font-mono text-4xl">
        SYSTEM_REBOOT
      </div>
      
      {/* White Noise Overlay */}
      <div className="absolute inset-0 opacity-20" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
      }}></div>
    </div>
  );
};

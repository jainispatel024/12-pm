import React, { useState } from 'react';
import { RetroTerminal } from './components/RetroTerminal';
import { ModernDashboard } from './components/ModernDashboard';
import { GlitchEffect } from './components/GlitchEffect';
import { AppMode } from './types';

const App: React.FC = () => {
  const [mode, setMode] = useState<AppMode>(AppMode.RETRO);

  const handleGlitchStart = () => {
    setMode(AppMode.GLITCH);
    
    // Duration of the glitch effect before switching to modern
    setTimeout(() => {
      setMode(AppMode.MODERN);
    }, 4000); // 4 seconds of chaos
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden">
      
      {/* Conditional Rendering based on Mode */}
      {mode === AppMode.RETRO && (
        <div className="w-full h-full bg-black relative">
          <div className="scanline"></div>
          <div className="crt-flicker"></div>
          <RetroTerminal onGlitch={handleGlitchStart} />
        </div>
      )}

      {mode === AppMode.GLITCH && (
        <GlitchEffect />
      )}

      {mode === AppMode.MODERN && (
        <div className="w-full h-full bg-gradient-to-br from-gray-900 via-indigo-950 to-black">
          <ModernDashboard />
        </div>
      )}
    </div>
  );
};

export default App;

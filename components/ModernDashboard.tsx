import React, { useEffect, useState } from 'react';
import { generateUserIdentity } from '../services/geminiService';
import { UserIdentity } from '../types';
import confetti from 'canvas-confetti';

export const ModernDashboard: React.FC = () => {
  const [identity, setIdentity] = useState<UserIdentity | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchIdentity = async () => {
      // Small artificial delay for the "Booting" feel
      await new Promise(r => setTimeout(r, 2000));
      const result = await generateUserIdentity();
      setIdentity(result);
      setLoading(false);
    };
    fetchIdentity();

    // Fireworks Effect
    const duration = 15 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 50 };

    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

    const interval = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        clearInterval(interval);
        return;
      }

      const particleCount = 50 * (timeLeft / duration);
      
      // Random fireworks from left and right
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
    }, 250);

    // Initial Burst
    confetti({
      particleCount: 150,
      spread: 100,
      origin: { y: 0.6 }
    });

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center font-['Space_Grotesk'] text-white overflow-hidden z-10">
      {/* Ambient Background Blobs */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-purple-600 rounded-full mix-blend-multiply filter blur-[128px] opacity-50 animate-blob"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-indigo-600 rounded-full mix-blend-multiply filter blur-[128px] opacity-50 animate-blob animation-delay-2000"></div>
      
      <div className="z-20 text-center max-w-4xl px-6">
        {loading ? (
          <div className="flex flex-col items-center space-y-6">
            <div className="w-16 h-16 border-4 border-t-transparent border-white rounded-full animate-spin"></div>
            <h2 className="text-2xl font-light tracking-widest animate-pulse">INITIALIZING 2026 OS...</h2>
          </div>
        ) : (
          <div className="animate-fade-in-up space-y-12">
            <div className="space-y-4">
               <h2 className="text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-orange-300 to-red-400 drop-shadow-2xl animate-pulse">
                 HAPPY NEW YEAR
               </h2>
               <p className="text-sm uppercase tracking-[0.3em] text-indigo-200">System Successfully Updated</p>
               <h1 className="text-8xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-white via-indigo-100 to-indigo-300">
                 2026
               </h1>
            </div>

            <div className="backdrop-blur-xl bg-white/10 border border-white/20 p-12 rounded-3xl shadow-2xl transform transition-all hover:scale-[1.02] duration-500">
              <p className="text-indigo-200 text-lg mb-2">User Identity Assigned</p>
              <h2 className="text-5xl font-medium mb-6 leading-tight">
                {identity?.title}
              </h2>
              <div className="h-px w-24 bg-gradient-to-r from-transparent via-white to-transparent mx-auto mb-8"></div>
              <p className="text-2xl font-light italic leading-relaxed text-indigo-50">
                "{identity?.mission}"
              </p>
              
              <div className="mt-10 flex justify-center gap-4">
                <span className="px-4 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-sm tracking-wider">
                  STATUS: ONLINE
                </span>
                {identity?.element && (
                   <span className="px-4 py-1 rounded-full bg-purple-500/20 border border-purple-400/30 text-sm tracking-wider uppercase">
                     {identity.element}
                   </span>
                )}
              </div>
            </div>
            
             <button 
                onClick={() => window.location.reload()}
                className="mt-12 text-white/50 hover:text-white text-sm uppercase tracking-widest transition-colors"
              >
                Reset Simulation
              </button>
          </div>
        )}
      </div>
      
      <style>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animate-fade-in-up {
          animation: fadeInUp 1s ease-out forwards;
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};
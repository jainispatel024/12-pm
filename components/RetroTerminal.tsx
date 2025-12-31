import React, { useEffect, useState, useRef } from 'react';
import { generateRetroLog } from '../services/geminiService';
import { SystemLog } from '../types';

interface RetroTerminalProps {
  onGlitch: () => void;
}

export const RetroTerminal: React.FC<RetroTerminalProps> = ({ onGlitch }) => {
  const [logs, setLogs] = useState<SystemLog[]>([]);
  const [timeDisplay, setTimeDisplay] = useState("00:00:00");
  const [currentDate, setCurrentDate] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  // Real-time Countdown logic
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentDate(now.toLocaleDateString('en-CA')); // YYYY-MM-DD

      // Target next Midnight (00:00:00)
      const target = new Date(now);
      target.setHours(24, 0, 0, 0);

      const diff = target.getTime() - now.getTime();

      // Trigger glitch if we hit the target
      if (diff <= 0) {
        onGlitch();
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeDisplay(
        `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
      );
    };

    updateTime(); // Initial call
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, [onGlitch]);

  // Log generation logic
  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;
    let isMounted = true;

    const fetchLogLoop = async () => {
      // Small delay on first run or subsequent runs
      // Fetch data
      const message = await generateRetroLog();
      
      if (!isMounted) return;

      // Meta: Log to actual browser console for curious users
      console.log(`%c[SYSTEM_LOG_2025] %c${message}`, 'color: #22c55e; font-weight: bold;', 'color: #86efac;');

      const newLog: SystemLog = {
        id: Math.random().toString(36).substr(2, 9),
        timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }),
        message
      };
      
      setLogs(prev => [...prev.slice(-6), newLog]); // Keep last 7 logs

      // Schedule next fetch only after current one is done (prevents pile-up)
      timeoutId = setTimeout(fetchLogLoop, 3500); 
    };

    fetchLogLoop();

    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
    };
  }, []);

  // Auto-scroll
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center font-['VT323'] text-green-500 p-8 z-10">
      <div className="absolute top-4 left-4 text-xl animate-pulse">
        SYSTEM_DATE: {currentDate || 'LOADING...'}
      </div>
      
      {/* Central Countdown */}
      <div className="flex flex-col items-center mb-12">
        <h1 className="text-9xl mb-4 drop-shadow-[0_0_10px_rgba(34,197,94,0.8)] tabular-nums">
          {timeDisplay}
        </h1>
        <p className="text-2xl uppercase tracking-[0.5em] animate-pulse text-green-700">
          Awaiting Midnight Protocol
        </p>
      </div>

      {/* Terminal Logs */}
      <div className="w-full max-w-2xl border-2 border-green-800 bg-black/80 p-4 rounded-lg backdrop-blur-sm shadow-[0_0_20px_rgba(34,197,94,0.2)]">
        <div className="flex items-center justify-between border-b border-green-800 pb-2 mb-2">
           <span className="uppercase">System_Monitor.exe</span>
           <div className="flex gap-2">
             <div className="w-3 h-3 rounded-full bg-green-900"></div>
             <div className="w-3 h-3 rounded-full bg-green-900"></div>
             <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
           </div>
        </div>
        <div 
          ref={scrollRef}
          className="h-48 overflow-y-auto font-mono text-lg space-y-2 scrollbar-hide"
        >
          {logs.map((log) => (
            <div key={log.id} className="flex gap-4 opacity-90 hover:opacity-100 transition-opacity">
              <span className="text-green-700">[{log.timestamp}]</span>
              <span className="typing-effect">{log.message}</span>
            </div>
          ))}
          <div className="animate-pulse">_</div>
        </div>
      </div>
      
      {/* Manual Trigger (Dev Mode) */}
      <button 
        onClick={onGlitch}
        className="fixed bottom-4 right-4 opacity-30 hover:opacity-100 border border-green-900 text-green-900 hover:bg-green-900 hover:text-green-100 px-4 py-2 text-xs uppercase transition-colors"
      >
        [ DEV_OVERRIDE ]
      </button>
    </div>
  );
};
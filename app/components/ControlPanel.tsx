"use client";

import React from "react";
import { Timer, Pause, Play, RotateCcw, Home } from "lucide-react";

interface ControlPanelProps {
  timer: number;
  isPaused: boolean;
  onPause: () => void;
  onResume: () => void;
  onRestart: () => void;
  onHome: () => void;
  userName: string;
}

const ControlPanel: React.FC<ControlPanelProps> = ({
  timer,
  isPaused,
  onPause,
  onResume,
  onRestart,
  onHome,
  userName,
}) => {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="flex w-full max-w-2xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between px-4 py-6">
      <div className="flex items-center gap-4">
        <div className="glass px-4 py-2 rounded-full flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center text-xs font-bold text-white uppercase shadow-lg">
            {userName.charAt(0)}
          </div>
          <span className="font-medium text-white/90 text-sm hidden sm:inline">{userName}</span>
        </div>
        
        <div className="glass px-4 py-2 rounded-full flex items-center gap-2 text-white">
          <Timer size={18} className="text-blue-400" />
          <span className="font-mono text-xl font-bold tabular-nums">{formatTime(timer)}</span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={isPaused ? onResume : onPause}
          className="glass-card p-3 rounded-full text-white hover:bg-white/20 transition-all active:scale-95"
          title={isPaused ? "Resume" : "Pause"}
        >
          {isPaused ? <Play size={20} fill="currentColor" /> : <Pause size={20} fill="currentColor" />}
        </button>
        
        <button
          onClick={onRestart}
          className="glass-card p-3 rounded-full text-white hover:bg-white/20 transition-all active:scale-95"
          title="Restart"
        >
          <RotateCcw size={20} />
        </button>
        
        <button
          onClick={onHome}
          className="glass-card p-3 rounded-full text-white hover:bg-white/20 transition-all active:scale-95"
          title="Home"
        >
          <Home size={20} />
        </button>
      </div>
    </div>
  );
};

export default ControlPanel;

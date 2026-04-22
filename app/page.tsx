"use client";

import React, { useState } from "react";
import GameContainer from "./components/GameContainer";
import ResultScreen from "./components/ResultScreen";
import { User, Play } from "lucide-react";
import { saveGameResult } from "./utils/saveResult";

type GameState = "START" | "PLAYING" | "RESULT";

export default function Home() {
  const [gameState, setGameState] = useState<GameState>("START");
  const [userName, setUserName] = useState("");
  const [finalTime, setFinalTime] = useState(0);

  const startNextGame = () => {
    if (userName.trim()) {
      setGameState("PLAYING");
    }
  };

  const handleFinish = (time: number) => {
    setFinalTime(time);
    setGameState("RESULT");
    saveGameResult(userName, time);
  };

  const goToHome = () => {
    setGameState("START");
    setUserName("");
  };

  const restartGame = () => {
    setGameState("PLAYING");
  };

  if (gameState === "PLAYING") {
    return (
      <GameContainer 
        userName={userName} 
        onHome={goToHome} 
        onFinish={handleFinish} 
      />
    );
  }

  if (gameState === "RESULT") {
    return (
      <ResultScreen 
        userName={userName} 
        time={finalTime} 
        onRestart={restartGame} 
        onHome={goToHome} 
      />
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-white p-6 scanline relative overflow-hidden">
      {/* Background Shapes */}
      <div className="absolute top-20 left-20 w-48 h-48 bg-[#1a2e35] rotate-12 -z-10" />
      <div className="absolute bottom-20 right-20 w-64 h-32 bg-[#2d1a24] -rotate-6 -z-10" />
      
      <main className="relative z-10 w-full max-w-2xl flex flex-col items-center">
        {/* Top Header */}
        <div className="w-full flex justify-between items-center mb-12 absolute top-[-10vh] left-0">
          <h2 className="text-primary italic font-black text-xl italic tracking-tighter">비트 크러셔</h2>
          <div className="flex gap-4">
             <div className="w-6 h-6 bg-primary" />
             <div className="w-6 h-6 bg-secondary" />
          </div>
        </div>

        {/* Main Box */}
        <div className="w-full max-w-xl retro-box bg-[#333338] p-8 py-16 flex flex-col items-center gap-8 relative">
          <div className="text-center space-y-2">
            <h1 className="text-6xl font-black italic tracking-tighter text-primary drop-shadow-[4px_4px_0px_#000]">
              BIT_CRUSHER
            </h1>
            <p className="text-xs font-bold tracking-[0.3em] text-white opacity-80">
              시스템 온라인 // 버전 8.0
            </p>
            <div className="flex justify-center gap-2 mt-4">
              <div className="w-3 h-3 bg-primary" />
              <div className="w-3 h-3 bg-secondary" />
              <div className="w-3 h-3 bg-accent" />
              <div className="w-3 h-3 bg-white" />
            </div>
          </div>

          <div className="w-full max-w-sm space-y-4 mt-8">
            <label className="block text-[10px] font-black uppercase tracking-widest text-white/60 ml-1">
              플레이어 핸들 입력
            </label>
            <div className="relative">
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && startNextGame()}
                autoComplete="off"
                placeholder="크러셔_01"
                className="w-full bg-[#111] border-2 border-black p-4 pl-6 text-secondary font-mono focus:outline-none focus:ring-0"
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-secondary">
                <div className="w-5 h-5 border-2 border-current rounded-sm flex items-center justify-center">
                   <div className="w-2 h-2 bg-current" />
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={startNextGame}
            disabled={!userName.trim()}
            className={`group relative mt-4 px-12 py-5 retro-border transition-all active:scale-95 ${
              userName.trim() 
              ? "bg-primary text-black cursor-pointer" 
              : "bg-zinc-700 text-zinc-500 cursor-not-allowed grayscale"
            }`}
          >
            <div className="flex items-center gap-3 font-black text-2xl italic tracking-tight">
              <span className="text-xl">▶</span> 코인 삽입 / 시작
            </div>
          </button>
        </div>

        {/* Bottom Stats */}
        <div className="w-full grid grid-cols-3 gap-2 sm:gap-4 mt-12">
          <div className="retro-box bg-black p-2 sm:p-4 text-center overflow-hidden">
            <p className="text-[8px] sm:text-[10px] font-black text-accent mb-1 truncate">최고 기록</p>
            <p className="text-lg sm:text-3xl font-black font-mono truncate">999,999</p>
          </div>
          <div className="retro-box bg-black p-2 sm:p-4 text-center overflow-hidden">
            <p className="text-[8px] sm:text-[10px] font-black text-primary mb-1 truncate">상태</p>
            <p className="text-lg sm:text-3xl font-black font-mono truncate">준비 완료</p>
          </div>
          <div className="retro-box bg-black p-2 sm:p-4 text-center overflow-hidden">
            <p className="text-[8px] sm:text-[10px] font-black text-secondary mb-1 truncate">크레딧</p>
            <p className="text-lg sm:text-3xl font-black font-mono truncate">00</p>
          </div>
        </div>


        <div className="fixed bottom-4 right-4 flex gap-1">
            <div className="w-2 h-2 bg-accent" />
            <div className="w-2 h-2 bg-secondary" />
        </div>
        <div className="fixed bottom-4 left-4 flex gap-1">
            <div className="w-2 h-2 bg-primary" />
            <div className="w-2 h-2 bg-white" />
        </div>
      </main>
    </div>
  );


}

"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import GameCard from "./GameCard";

interface Card {
  id: number;
  fruitIndex: number;
  isFlipped: boolean;
  isMatched: boolean;
}

interface GameContainerProps {
  userName: string;
  onHome: () => void;
  onFinish: (time: number) => void;
}

const GameContainer: React.FC<GameContainerProps> = ({ userName, onHome, onFinish }) => {
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [timer, setTimer] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isWon, setIsWon] = useState(false);
  const [combo, setCombo] = useState(0);
  const [streak, setStreak] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const initGame = useCallback(() => {
    const fruitIndices = Array.from({ length: 8 }, (_, i) => i);
    const pairs = [...fruitIndices, ...fruitIndices];
    const shuffled = pairs
      .sort(() => Math.random() - 0.5)
      .map((fruitIndex, id) => ({
        id,
        fruitIndex,
        isFlipped: false,
        isMatched: false,
      }));
    
    setCards(shuffled);
    setFlippedCards([]);
    setTimer(0);
    setIsPaused(false);
    setIsWon(false);
    setCombo(0);
    setStreak(0);
  }, []);

  useEffect(() => {
    initGame();
  }, [initGame]);

  useEffect(() => {
    if (!isPaused && !isWon) {
      timerRef.current = setInterval(() => {
        setTimer((v) => v + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPaused, isWon]);

  const handleCardClick = (id: number) => {
    if (isPaused || flippedCards.length === 2) return;

    setCards((prev) =>
      prev.map((card) => (card.id === id ? { ...card, isFlipped: true } : card))
    );
    setFlippedCards((prev) => [...prev, id]);
  };

  useEffect(() => {
    if (flippedCards.length === 2) {
      const [id1, id2] = flippedCards;
      const card1 = cards[id1];
      const card2 = cards[id2];

      if (card1.fruitIndex === card2.fruitIndex) {
        // Match!
        setCards((prev) =>
          prev.map((card) =>
            card.id === id1 || card.id === id2 ? { ...card, isMatched: true } : card
          )
        );
        setCombo((v) => v + 1);
        setStreak((v) => v + 1);
        setFlippedCards([]);
      } else {
        // Mismatch - flip back after delay
        const timeout = setTimeout(() => {
          setCards((prev) =>
            prev.map((card) =>
              card.id === id1 || card.id === id2 ? { ...card, isFlipped: false } : card
            )
          );
          setFlippedCards([]);
          setCombo(0);
          setStreak(0);
        }, 1000);
        return () => clearTimeout(timeout);
      }
    }
  }, [flippedCards, cards]);

  useEffect(() => {
    if (cards.length > 0 && cards.every((card) => card.isMatched)) {
      setIsWon(true);
      onFinish(timer);
    }
  }, [cards, timer, onFinish]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="flex flex-col w-full min-h-screen bg-background text-white scanline overflow-hidden">
      {/* Header */}
      <header className="flex justify-between items-center px-8 py-4 border-b border-white/5 bg-black/40">
        <h1 className="text-2xl font-black italic text-primary tracking-tighter">과일 맞추기</h1>
        <div className="flex gap-4 items-center">
            <div className="w-6 h-6 border-2 border-white/40 flex items-center justify-center rounded-sm">
                <div className="w-1 h-1 bg-white" />
            </div>
            <div className="w-6 h-6 border-2 border-white/40 flex items-center justify-center rounded-full">
                <span className="text-[10px] font-bold">?</span>
            </div>
        </div>
      </header>

      <main className="flex-1 flex gap-6 p-6 max-w-[1400px] mx-auto w-full">
        {/* Left Sidebar */}
        <aside className="w-64 flex flex-col gap-6">
          <div className="retro-box bg-[#1a1a1a] p-1 flex flex-col overflow-hidden">
            <div className="bg-primary p-2 text-center">
               <span className="text-[10px] font-black text-black">플레이어</span>
            </div>
            <div className="p-4 flex items-center gap-3">
               <div className="w-10 h-10 bg-secondary/20 flex items-center justify-center retro-border">
                  <div className="w-5 h-5 bg-secondary/80 rounded-t-full" />
               </div>
               <div className="flex flex-col">
                  <span className="text-[8px] font-black text-white/40">사용자명</span>
                  <span className="text-sm font-black text-secondary tracking-tight">{userName}</span>
               </div>
            </div>
          </div>

          <div className="retro-box bg-[#1a1a1a] p-4 flex flex-col gap-2">
             <div className="bg-accent px-2 py-1 inline-block self-start">
                 <span className="text-[10px] font-black text-black">최고 기록</span>
             </div>
             <p className="text-4xl font-black font-mono text-accent/80 tracking-tighter">0085420</p>
             <div className="bg-black/40 p-2 flex justify-between items-center border border-white/10">
                 <span className="text-[8px] font-black">콤보</span>
                 <span className="bg-[#444] px-2 py-0.5 text-[10px] font-black">x{combo}</span>
             </div>
          </div>
        </aside>

        {/* Center Game Area */}
        <div className="flex-1 flex flex-col items-center gap-6">
          {/* Timer & Progress */}
          <div className="w-full max-w-xl flex flex-col items-center gap-4">
             <div className="text-center">
                <p className="text-[10px] font-black text-primary tracking-widest mb-1 uppercase">남은 시간</p>
                <p className="text-2xl font-black font-mono text-secondary">{formatTime(180 - timer)} S</p>
             </div>
             <div className="w-full flex gap-1 h-3">
                {[...Array(8)].map((_, i) => (
                  <div 
                    key={i} 
                    className={`flex-1 ${i < (8 - Math.floor(timer / 22.5)) ? 'bg-secondary' : 'bg-secondary/10'}`} 
                  />
                ))}
             </div>
          </div>

          {/* Grid Container */}
          <div className="relative p-6 retro-box bg-[#1a1a1a] w-full max-w-xl aspect-square">
            <div className="grid grid-cols-4 gap-4 h-full">
                {cards.map((card) => (
                <GameCard
                    key={card.id}
                    {...card}
                    onClick={handleCardClick}
                    disabled={isPaused || isWon}
                />
                ))}
            </div>

            {isPaused && (
              <div className="absolute inset-0 z-50 bg-black/80 flex flex-col items-center justify-center p-8 text-center animate-fadeIn">
                <h2 className="text-4xl font-black italic mb-6 text-primary tracking-tighter drop-shadow-md">시스템 일시정지</h2>
                <button
                  onClick={() => setIsPaused(false)}
                  className="px-8 py-3 bg-secondary text-black retro-border font-black italic hover:brightness-110 transition-all active:scale-95"
                >
                  임무 재개
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right Sidebar */}
        <aside className="w-64 flex flex-col gap-6">
          <div className="retro-box bg-[#1a1a1a] p-4 flex flex-col gap-4">
             <h3 className="text-xs font-black text-white/60 tracking-[0.2em] border-b border-white/10 pb-2">랭킹</h3>
             <div className="space-y-4">
                <div className="flex justify-between items-center text-accent">
                    <span className="text-[10px] font-black">#1 과일왕</span>
                    <span className="text-[10px] font-mono">125,400</span>
                </div>
                <div className="flex justify-between items-center opacity-60">
                    <span className="text-[10px] font-black">#2 네온_프루트</span>
                    <span className="text-[10px] font-mono">98,200</span>
                </div>
                <div className="flex justify-between items-center text-secondary border-t border-white/10 pt-2">
                    <span className="text-[10px] font-black">#12 당신</span>
                    <span className="text-[10px] font-mono">12,400</span>
                </div>
             </div>
          </div>

          <div className="retro-box bg-[#1a1a1a] p-4 flex flex-col gap-4 text-center">
             <div className="aspect-video bg-black flex items-center justify-center overflow-hidden border border-white/10 group">
                <div className="w-full h-full diagonal-pattern flex items-center justify-center relative">
                   <div className="text-accent text-3xl font-black italic animate-pulse opacity-20">준비?</div>
                   <div className="absolute inset-2 border-[1px] border-secondary/20" />
                </div>
             </div>
             <div className="space-y-1">
                <p className="text-[8px] font-black text-white/40 uppercase">현재 연속 성공</p>
                <p className="text-lg font-black text-primary italic">{streak} 연속</p>
             </div>
          </div>
        </aside>
      </main>

      {/* Footer Controls */}
      <footer className="h-20 flex border-t border-black bg-black">
        <button 
          onClick={() => {}}
          className="flex-1 bg-primary text-black flex items-center justify-center hover:brightness-110 active:brightness-90 transition-all border-r border-black"
        >
          <div className="flex flex-col items-center">
             <span className="text-[8px] font-black">▶</span>
             <span className="text-[10px] font-black mt-1">시작</span>
          </div>
        </button>
        <button 
          onClick={() => setIsPaused(!isPaused)}
          className="flex-1 bg-black text-white hover:bg-zinc-900 border-r border-white/10 flex items-center justify-center"
        >
          <div className="flex flex-col items-center">
             <span className="text-[8px] font-black">II</span>
             <span className="text-[10px] font-black mt-1 uppercase">{isPaused ? '재개' : '정지'}</span>
          </div>
        </button>
        <button 
          onClick={initGame}
          className="flex-1 bg-black text-white hover:bg-zinc-900 border-r border-white/10 flex items-center justify-center"
        >
          <div className="flex flex-col items-center">
             <span className="text-[8px] font-black">↻</span>
             <span className="text-[10px] font-black mt-1">재시작</span>
          </div>
        </button>
        <button 
          onClick={onHome}
          className="flex-1 bg-black text-white hover:bg-zinc-900 flex items-center justify-center"
        >
          <div className="flex flex-col items-center">
             <span className="text-[8px] font-black">⌂</span>
             <span className="text-[10px] font-black mt-1 uppercase">종료</span>
          </div>
        </button>
      </footer>

    </div>
  );

};

export default GameContainer;

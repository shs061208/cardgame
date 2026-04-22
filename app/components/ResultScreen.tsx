import React, { useEffect, useState } from "react";
import { Trophy, Home, RotateCcw } from "lucide-react";
import { getTopRankings } from "../utils/saveResult";

interface ResultScreenProps {
  userName: string;
  time: number;
  onRestart: () => void;
  onHome: () => void;
}

const ResultScreen: React.FC<ResultScreenProps> = ({ userName, time, onRestart, onHome }) => {
  const [rankings, setRankings] = useState<{ name: string; finishtime: number }[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRankings = async () => {
      setIsLoading(true);
      const data = await getTopRankings();
      setRankings(data);
      setIsLoading(false);
    };
    fetchRankings();
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}분 ${secs.toString().padStart(2, "0")}초`;
  };

  const formatTimeShort = (seconds: number) => {
     const mins = Math.floor(seconds / 60);
     const secs = seconds % 60;
     return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-white p-6 scanline relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary/20 rounded-full blur-[120px]" />

      <main className="flex flex-col lg:flex-row gap-8 items-center justify-center w-full max-w-6xl relative z-10">
        
        {/* Left: Current Result */}
        <div className="retro-box bg-[#333338] p-12 py-16 flex flex-col items-center text-center max-w-md w-full relative">
          <div className="mb-8 relative">
            <div className="absolute inset-0 bg-accent blur-2xl opacity-20 animate-pulse" />
            <h2 className="text-5xl font-black italic tracking-tighter text-accent drop-shadow-[4px_4px_0px_#000]">
              임무 완수
            </h2>
          </div>
          
          <p className="text-secondary font-black tracking-[0.2em] mb-12 uppercase italic">
            오퍼레이터: {userName}
          </p>
          
          <div className="flex flex-col items-center mb-16 w-full space-y-2">
              <span className="text-white/40 text-[10px] font-black uppercase tracking-[0.4em]">클리어 시간 기록</span>
              <span className="text-6xl font-black tabular-nums text-white italic drop-shadow-[3px_3px_0px_var(--primary)]">{formatTime(time)}</span>
          </div>

          <div className="flex flex-col w-full gap-4">
            <button
              onClick={onRestart}
              className="flex items-center justify-center gap-3 w-full py-5 bg-primary text-black retro-border font-black italic text-xl hover:brightness-110 transition-all active:scale-95"
            >
              <span className="text-lg">↻</span>
              재도전
            </button>
            
            <button
              onClick={onHome}
              className="flex items-center justify-center gap-3 w-full py-4 bg-black text-white retro-border font-black italic hover:bg-zinc-900 transition-all active:scale-95 border-white/20"
            >
              <span className="text-lg">⌂</span>
              기지로 귀환
            </button>
          </div>
        </div>

        {/* Right: Hall of Fame (Rankings) */}
        <div className="retro-box bg-[#1a1a1a] p-8 w-full max-w-sm flex flex-col gap-6 relative overflow-hidden">
           <div className="absolute top-0 right-0 p-2 bg-secondary/10 -rotate-12 transform translate-x-2 -translate-y-2">
              <span className="text-[10px] font-black text-secondary">HALL OF FAME</span>
           </div>
           
           <h3 className="text-xl font-black italic text-secondary border-b-2 border-secondary/20 pb-4 tracking-tight">명예의 전당 TOP 3</h3>
           
           <div className="space-y-6 py-4">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-10 gap-4">
                   <div className="w-8 h-8 border-4 border-secondary border-t-transparent rounded-full animate-spin" />
                   <span className="text-xs font-black text-white/40 italic">기록 로딩 중...</span>
                </div>
              ) : rankings.length > 0 ? (
                rankings.map((rank, index) => (
                  <div key={index} className={`flex items-center justify-between p-4 retro-border ${index === 0 ? 'bg-accent/10 border-accent' : 'bg-black/40 border-white/10'}`}>
                    <div className="flex items-center gap-4">
                       <span className={`text-2xl font-black italic ${index === 0 ? 'text-accent' : index === 1 ? 'text-secondary' : 'text-primary'}`}>#{index + 1}</span>
                       <div className="flex flex-col">
                          <span className="text-[8px] font-black text-white/40 uppercase">OPERATOR</span>
                          <span className="font-black text-white tracking-tight">{rank.name}</span>
                       </div>
                    </div>
                    <div className="text-right">
                       <span className="text-[8px] font-black text-white/40 uppercase">TIME</span>
                       <p className={`text-xl font-black font-mono ${index === 0 ? 'text-accent' : 'text-white'}`}>{formatTimeShort(rank.finishtime)}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-10">
                   <p className="text-xs font-black text-white/20 italic">아직 기록이 없습니다.</p>
                </div>
              )}
           </div>

           <div className="mt-auto border-t border-white/10 pt-4 text-center">
              <p className="text-[8px] font-black text-white/40 tracking-[0.4em] uppercase underline decoration-primary/30">Worldwide Arcade Rankings</p>
           </div>
        </div>
      </main>

      <div className="mt-12 group cursor-pointer">
          <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.8em] group-hover:text-primary transition-colors">비트 크러셔 // 버전 8.0</p>
      </div>
    </div>
  );
};

export default ResultScreen;

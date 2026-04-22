"use client";

import React from "react";

interface GameCardProps {
  id: number;
  fruitIndex: number;
  isFlipped: boolean;
  isMatched: boolean;
  onClick: (id: number) => void;
  disabled: boolean;
}

const GameCard: React.FC<GameCardProps> = ({
  id,
  fruitIndex,
  isFlipped,
  isMatched,
  onClick,
  disabled,
}) => {
  // Sprite sheet calculation: 4 columns, 3 rows
  const col = fruitIndex % 4;
  const row = Math.floor(fruitIndex / 4);
  const backgroundPosition = `${(col / 3) * 100}% ${(row / 2) * 100}%`;

  return (
    <div
      className={`relative h-24 w-full cursor-pointer perspective-1000 sm:h-32 ${
        disabled ? "pointer-events-none opacity-80" : ""
      }`}
      onClick={() => !isFlipped && !isMatched && !disabled && onClick(id)}
    >
      <div
        className={`relative h-full w-full transform-style-3d transition-transform duration-400 ${
          isFlipped || isMatched ? "rotate-y-180" : ""
        }`}
      >
        {/* Front (Hidden state) */}
        <div className="absolute inset-0 backface-hidden diagonal-pattern border-2 border-black flex items-center justify-center shadow-[4px_4px_0px_#000]">
          <div className="w-full h-full opacity-10 border-[1px] border-white/20 m-1" />
        </div>

        {/* Back (Visible state) - FRONT flip */}
        <div 
          className="absolute inset-0 backface-hidden rotate-y-180 border-2 border-black flex items-center justify-center overflow-hidden shadow-[4px_4px_0px_#000]"
          style={{ 
            backgroundColor: isMatched ? "var(--secondary)" : "var(--accent)" 
          }}
        >
          <div
            className="w-[80%] h-[80%]"
            style={{
              backgroundImage: `url('/fruits.jpg')`,
              backgroundSize: "400% 300%",
              backgroundPosition: backgroundPosition,
              backgroundRepeat: "no-repeat",
              filter: isMatched ? "grayscale(0.5) brightness(0.8)" : "none",
            }}
          />
          {isMatched && (
             <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                <span className="text-[10px] font-black text-white italic drop-shadow-md">일치함</span>
             </div>
          )}
        </div>
      </div>
    </div>

  );
};

export default GameCard;

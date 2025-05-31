import React from 'react';

const ConfettiPiece: React.FC<{ delay: number, color: string, left: number, duration: number }> = ({ delay, color, left, duration }) => (
  <div
    className="absolute w-2 h-4 opacity-0 animate-fall"
    style={{
      backgroundColor: color,
      left: `${left}%`,
      animationDelay: `${delay}s`,
      animationDuration: `${duration}s`,
      transform: `rotate(${Math.random() * 360}deg)`,
    }}
  />
);

const Confetti: React.FC = () => {
  const colors = ['#a7f3d0', '#bfdbfe', '#fbcfe8', '#fef3c7', '#ddd6fe']; // Pastel colors
  const pieces = Array.from({ length: 50 }).map((_, i) => ({
    id: i,
    delay: Math.random() * 0.5, // Start falling at slightly different times
    color: colors[Math.floor(Math.random() * colors.length)],
    left: Math.random() * 100,
    duration: Math.random() * 2 + 2, // Fall for 2-4 seconds
  }));

  return (
    <div className="fixed inset-0 pointer-events-none z-[100] overflow-hidden">
      {pieces.map(p => (
        <ConfettiPiece key={p.id} {...p} />
      ))}
      <style>{`
        @keyframes fall {
          0% { transform: translateY(-10vh) rotate(0deg); opacity: 1; }
          100% { transform: translateY(110vh) rotate(720deg); opacity: 0; }
        }
        .animate-fall {
          animation-name: fall;
          animation-timing-function: linear;
          animation-fill-mode: forwards;
        }
      `}</style>
    </div>
  );
};

export default Confetti;
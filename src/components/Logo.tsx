import React from 'react';

interface LogoProps {
  className?: string;
  size?: number;
}

export const Logo: React.FC<LogoProps> = ({ className = 'h-8 w-8', size = 32 }) => {
  return (
    <div
      className={`relative inline-flex items-center justify-center shrink-0 rounded-xl bg-gradient-to-b from-[#f59e0b] to-[#d97706] shadow-sm p-1.5 ${className}`}
      style={{ width: size, height: size }}
      id="ezy-logo-badge"
    >
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full text-white"
      >
        {/* Star Polygon */}
        <polygon
          points="50,5 64,36 98,38 72,61 80,95 50,76 20,95 28,61 2,38 36,36"
          fill="white"
          stroke="#f59e0b"
          strokeWidth="3"
        />
        {/* Checkmark inside circle */}
        <circle cx="50" cy="50" r="14" fill="#f59e0b" />
        <path
          d="M44 50 L48 54 L57 45"
          stroke="white"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
};

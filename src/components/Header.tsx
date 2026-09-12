import React from 'react';
import { Logo } from './Logo';
import { ScreenState } from '../types';

interface HeaderProps {
  screen: ScreenState;
  onBackToCategories: () => void;
  categoryName?: string;
}

export const Header: React.FC<HeaderProps> = ({
  screen,
  onBackToCategories,
  categoryName,
}) => {
  return (
    <header
      id="app-header"
      className="fixed top-0 inset-x-0 z-50 bg-[#faf8ff]/90 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)] border-b border-[#eaedff]/60"
    >
      <div className="h-16 px-4 sm:px-6 max-w-4xl mx-auto flex items-center justify-between gap-2">
        {/* Left Side */}
        <div className="flex items-center gap-2.5 min-w-0">
          {screen === 'quiz' ? (
            <>
              <button
                id="header-back-button"
                onClick={onBackToCategories}
                className="w-10 h-10 -ml-1.5 flex items-center justify-center rounded-full text-[#131b2e] hover:bg-[#eaedff] active:scale-95 transition-all"
                title="Exit Quiz"
                aria-label="Back to Categories"
              >
                <span className="material-symbols-outlined text-[24px]">arrow_back</span>
              </button>
              <Logo size={32} />
              <div className="flex flex-col truncate">
                <span className="font-headline font-bold text-[18px] text-[#131b2e] truncate leading-tight">
                  Active Quiz
                </span>
                {categoryName && (
                  <span className="text-[12px] text-[#4f4633] font-medium truncate">
                    {categoryName}
                  </span>
                )}
              </div>
            </>
          ) : (
            <>
              <Logo size={34} />
              <div className="flex flex-col truncate">
                <span className="font-headline font-bold text-[18px] text-[#131b2e] truncate leading-tight tracking-tight">
                  Ezy Quiz Portal
                </span>
                <span className="text-[11px] text-[#4f4633] font-semibold tracking-wide truncate">
                  Interactive Skill Assessment
                </span>
              </div>
            </>
          )}
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-2 shrink-0">
          {screen === 'categories' && (
            <span
              id="header-category-badge"
              className="hidden sm:inline-flex items-center px-2.5 py-1 rounded-full bg-[#eaedff] text-[12px] font-semibold text-[#4f4633]"
            >
              Categories
            </span>
          )}

          {screen === 'results' && (
            <span
              id="header-results-badge"
              className="hidden sm:inline-flex items-center px-2.5 py-1 rounded-full bg-[#eaedff] text-[12px] font-semibold text-[#4f4633]"
            >
              Results
            </span>
          )}

          <div
            id="user-profile-avatar"
            className="w-8 h-8 rounded-full bg-[#795900] flex items-center justify-center text-white shadow-xs cursor-pointer hover:opacity-90 transition-opacity"
            title="Profile"
          >
            <span className="material-symbols-outlined text-white text-[18px]">person</span>
          </div>
        </div>
      </div>
    </header>
  );
};

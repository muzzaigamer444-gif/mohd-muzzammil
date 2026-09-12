import React from 'react';
import { ScreenState } from '../types';

interface BottomNavProps {
  currentScreen: ScreenState;
  onNavigate: (screen: ScreenState) => void;
  onStartQuiz?: () => void;
  hasActiveQuiz: boolean;
  hasResults: boolean;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentScreen,
  onNavigate,
  onStartQuiz,
  hasActiveQuiz,
  hasResults,
}) => {
  return (
    <nav
      id="app-bottom-nav"
      className="fixed bottom-0 inset-x-0 z-50 pb-safe bg-[#faf8ff]/95 backdrop-blur-xl border-t border-[#eaedff] shadow-[0_-2px_12px_rgba(0,0,0,0.06)]"
    >
      <div className="flex justify-around items-center h-16 px-4 max-w-md mx-auto relative">
        {/* Categories Tab */}
        <button
          id="nav-tab-categories"
          type="button"
          onClick={() => onNavigate('categories')}
          className={`flex flex-col items-center justify-center min-w-[56px] py-1 px-3 rounded-full transition-all cursor-pointer ${
            currentScreen === 'categories'
              ? 'text-[#6c4f00] bg-[#fbbf24]/30 font-bold'
              : 'text-[#4f4633] hover:text-[#131b2e]'
          }`}
          aria-current={currentScreen === 'categories' ? 'page' : undefined}
        >
          <span className="material-symbols-outlined text-[22px]">category</span>
          <span className="text-[11px] font-medium tracking-tight">Categories</span>
        </button>

        {/* Center Super Button: Start Quiz */}
        {currentScreen === 'categories' && onStartQuiz ? (
          <button
            id="nav-super-start-btn"
            type="button"
            onClick={onStartQuiz}
            className="-mt-5 flex flex-col items-center justify-center cursor-pointer group"
            title="Start Quiz Now"
          >
            <div className="w-13 h-13 rounded-full bg-gradient-to-tr from-[#d97706] via-[#f59e0b] to-[#fbbf24] flex items-center justify-center text-[#261a00] shadow-[0_4px_14px_rgba(245,158,11,0.5)] group-hover:scale-105 group-active:scale-95 transition-all duration-150 border-2 border-white">
              <span className="material-symbols-outlined text-[26px] font-bold">
                play_arrow
              </span>
            </div>
            <span className="text-[10px] font-bold text-[#b45309] mt-0.5 tracking-tight uppercase">
              Start Quiz
            </span>
          </button>
        ) : (
          /* Active Quiz Tab */
          <button
            id="nav-tab-quiz"
            type="button"
            disabled={!hasActiveQuiz}
            onClick={() => hasActiveQuiz && onNavigate('quiz')}
            className={`flex flex-col items-center justify-center min-w-[56px] py-1 px-3 rounded-full transition-all ${
              !hasActiveQuiz
                ? 'text-[#817661]/40 cursor-not-allowed'
                : currentScreen === 'quiz'
                ? 'text-[#6c4f00] bg-[#fbbf24]/30 font-bold cursor-pointer'
                : 'text-[#4f4633] hover:text-[#131b2e] cursor-pointer'
            }`}
            aria-current={currentScreen === 'quiz' ? 'page' : undefined}
          >
            <span className="material-symbols-outlined text-[22px]">quiz</span>
            <span className="text-[11px] font-medium tracking-tight">Active Quiz</span>
          </button>
        )}

        {/* Results Tab */}
        <button
          id="nav-tab-results"
          type="button"
          disabled={!hasResults}
          onClick={() => hasResults && onNavigate('results')}
          className={`flex flex-col items-center justify-center min-w-[56px] py-1 px-3 rounded-full transition-all ${
            !hasResults
              ? 'text-[#817661]/40 cursor-not-allowed'
              : currentScreen === 'results'
              ? 'text-[#6c4f00] bg-[#fbbf24]/30 font-bold cursor-pointer'
              : 'text-[#4f4633] hover:text-[#131b2e] cursor-pointer'
          }`}
          aria-current={currentScreen === 'results' ? 'page' : undefined}
        >
          <span className="material-symbols-outlined text-[22px]">leaderboard</span>
          <span className="text-[11px] font-medium tracking-tight">Results</span>
        </button>
      </div>
    </nav>
  );
};

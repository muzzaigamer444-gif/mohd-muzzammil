import React, { useState, useMemo } from 'react';
import { Category } from '../types';
import { CATEGORIES } from '../data/quizData';

interface CategoryScreenProps {
  onSelectCategory: (categoryId: string) => void;
  onStartDailyChallenge: () => void;
}

export const CategoryScreen: React.FC<CategoryScreenProps> = ({
  onSelectCategory,
  onStartDailyChallenge,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'popular' | 'short' | 'prep'>('all');

  const filteredCategories = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return CATEGORIES.filter((cat) => {
      const matchesSearch =
        cat.name.toLowerCase().includes(q) ||
        cat.difficulty.toLowerCase().includes(q) ||
        cat.tags.some((t) => t.toLowerCase().includes(q));

      const matchesFilter =
        activeFilter === 'all' || cat.tags.includes(activeFilter);

      return matchesSearch && matchesFilter;
    });
  }, [searchQuery, activeFilter]);

  return (
    <div className="flex flex-col w-full px-4 sm:px-6 py-4 max-w-xl mx-auto space-y-5 pb-24">
      {/* Title & Streak Header */}
      <div className="flex flex-col space-y-2 pt-1">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-headline text-2xl sm:text-3xl font-bold text-[#131b2e] tracking-tight">
              Choose a Quiz
            </h1>
            <p className="text-sm text-[#4f4633] mt-0.5">
              Test your knowledge. Track your progress.
            </p>
          </div>
          <div
            id="user-streak-chip"
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#ffdf9f] text-[#261a00] rounded-full shadow-xs shrink-0"
          >
            <span
              className="material-symbols-outlined text-[18px] text-[#795900]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              local_fire_department
            </span>
            <span className="text-xs font-bold tracking-wide">3 Days</span>
          </div>
        </div>

        {/* Super Button: Start Quiz Hero Banner */}
        <div
          id="super-start-quiz-hero"
          className="relative overflow-hidden rounded-3xl p-5 sm:p-6 bg-gradient-to-br from-[#131b2e] via-[#1e293b] to-[#0f172a] text-white shadow-xl border border-[#fbbf24]/30 my-2"
        >
          {/* Subtle decorative golden glow circle in background */}
          <div className="absolute -top-12 -right-12 w-40 h-40 bg-[#fbbf24]/15 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-10 -left-10 w-36 h-36 bg-[#f59e0b]/10 rounded-full blur-xl pointer-events-none" />

          <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-b from-[#fbbf24] to-[#d97706] flex items-center justify-center text-[#261a00] shadow-md shrink-0">
                <span className="material-symbols-outlined text-[28px] font-bold">
                  bolt
                </span>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-[#fbbf24]/20 text-[#fbbf24] text-[11px] font-extrabold uppercase tracking-wider border border-[#fbbf24]/30">
                    Super Start
                  </span>
                  <span className="text-xs text-[#94a3b8]">10 Qs • 60s Timer</span>
                </div>
                <h2 className="font-headline font-extrabold text-xl sm:text-2xl text-white mt-1 leading-tight tracking-tight">
                  Ready to test your skills?
                </h2>
                <p className="text-xs sm:text-sm text-[#cbd5e1] mt-1 leading-relaxed">
                  Start your assessment instantly with a single tap.
                </p>
              </div>
            </div>

            {/* The Super Button */}
            <button
              id="super-button-start-quiz"
              type="button"
              onClick={() => onSelectCategory(filteredCategories[0]?.id || 'science')}
              className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-gradient-to-r from-[#fbbf24] via-[#f59e0b] to-[#d97706] hover:from-[#f59e0b] hover:to-[#b45309] text-[#261a00] font-headline font-extrabold text-base sm:text-lg flex items-center justify-center gap-2.5 shadow-[0_6px_20px_rgba(245,158,11,0.45)] hover:shadow-[0_8px_25px_rgba(245,158,11,0.6)] active:scale-95 transition-all duration-200 cursor-pointer shrink-0 border border-[#fef08a]"
            >
              <span>SUPER START QUIZ</span>
              <span className="material-symbols-outlined text-[24px] font-bold animate-bounce-x">
                play_arrow
              </span>
            </button>
          </div>
        </div>

        {/* Search Input */}
        <div className="relative w-full pt-2">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#817661]">
            <span className="material-symbols-outlined text-[20px]">search</span>
          </div>
          <input
            id="category-search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search topics, subjects, or skills..."
            className="w-full pl-11 pr-4 py-2.5 rounded-2xl bg-white text-[#131b2e] placeholder:text-[#817661] text-sm shadow-xs border border-[#eaedff] focus:outline-none focus:border-[#fbbf24] focus:ring-2 focus:ring-[#fbbf24]/30 transition-all duration-200"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#817661] hover:text-[#131b2e]"
              aria-label="Clear search"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          )}
        </div>

        {/* Filter Pills */}
        <div id="filter-pills-row" className="flex items-center gap-2 overflow-x-auto py-1 no-scrollbar">
          <button
            id="filter-pill-all"
            type="button"
            onClick={() => setActiveFilter('all')}
            className={`shrink-0 px-4 py-1.5 rounded-full text-xs font-bold shadow-xs transition-all duration-150 active:scale-95 ${
              activeFilter === 'all'
                ? 'bg-[#fbbf24] text-[#6c4f00]'
                : 'bg-white text-[#4f4633] border border-[#eaedff] hover:bg-[#eaedff]'
            }`}
          >
            All Topics
          </button>
          <button
            id="filter-pill-popular"
            type="button"
            onClick={() => setActiveFilter('popular')}
            className={`shrink-0 px-4 py-1.5 rounded-full text-xs font-bold shadow-xs transition-all duration-150 active:scale-95 ${
              activeFilter === 'popular'
                ? 'bg-[#fbbf24] text-[#6c4f00]'
                : 'bg-white text-[#4f4633] border border-[#eaedff] hover:bg-[#eaedff]'
            }`}
          >
            Popular 🔥
          </button>
          <button
            id="filter-pill-short"
            type="button"
            onClick={() => setActiveFilter('short')}
            className={`shrink-0 px-4 py-1.5 rounded-full text-xs font-bold shadow-xs transition-all duration-150 active:scale-95 ${
              activeFilter === 'short'
                ? 'bg-[#fbbf24] text-[#6c4f00]'
                : 'bg-white text-[#4f4633] border border-[#eaedff] hover:bg-[#eaedff]'
            }`}
          >
            Short (10 Qs)
          </button>
          <button
            id="filter-pill-prep"
            type="button"
            onClick={() => setActiveFilter('prep')}
            className={`shrink-0 px-4 py-1.5 rounded-full text-xs font-bold shadow-xs transition-all duration-150 active:scale-95 ${
              activeFilter === 'prep'
                ? 'bg-[#fbbf24] text-[#6c4f00]'
                : 'bg-white text-[#4f4633] border border-[#eaedff] hover:bg-[#eaedff]'
            }`}
          >
            Exam Prep
          </button>
        </div>
      </div>

      {/* Category Cards Stack */}
      <div id="category-cards-list" className="flex flex-col space-y-3.5">
        {filteredCategories.length === 0 ? (
          <div className="p-8 text-center bg-white rounded-2xl shadow-xs border border-[#eaedff]">
            <span className="material-symbols-outlined text-4xl text-[#817661] mb-2">
              sentiment_dissatisfied
            </span>
            <p className="text-sm font-semibold text-[#131b2e]">No quiz categories found</p>
            <p className="text-xs text-[#817661] mt-1">Try a different search term or filter.</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setActiveFilter('all');
              }}
              className="mt-3 px-4 py-1.5 rounded-full bg-[#eaedff] text-xs font-semibold text-[#131b2e] hover:bg-[#d2d9f4]"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          filteredCategories.map((category) => (
            <div
              key={category.id}
              id={`category-card-${category.id}`}
              className="group flex flex-col p-4 sm:p-5 rounded-2xl bg-white shadow-xs hover:shadow-md border border-[#eaedff]/70 transition-all duration-200"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3.5 min-w-0">
                  <div
                    className={`w-12 h-12 rounded-2xl ${category.iconBgClass} flex items-center justify-center ${category.iconColorClass} shadow-xs shrink-0`}
                  >
                    <span className="material-symbols-outlined text-[26px]">
                      {category.icon}
                    </span>
                  </div>
                  <div className="flex flex-col min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h2 className="font-headline font-bold text-lg text-[#131b2e] leading-snug truncate">
                        {category.name}
                      </h2>
                      <span
                        className={`px-2.5 py-0.5 rounded-full ${category.difficultyClass} text-[11px] font-bold tracking-wide`}
                      >
                        {category.difficulty}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[#4f4633] text-xs mt-1">
                      <span className="material-symbols-outlined text-[15px] text-[#817661]">
                        timer
                      </span>
                      <span>10 questions • 60 seconds</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="mt-4 pt-3 flex items-center justify-between gap-2 border-t border-[#f2f3ff]">
                <div className="flex items-center gap-1.5 text-[#4f4633] text-xs font-semibold">
                  <span className="w-2 h-2 rounded-full bg-[#fbbf24] inline-block animate-pulse"></span>
                  <span>+{category.xp} XP</span>
                </div>
                <button
                  id={`start-quiz-btn-${category.id}`}
                  type="button"
                  onClick={() => onSelectCategory(category.id)}
                  className="px-5 py-2 rounded-full bg-[#fbbf24] hover:bg-[#f59e0b] text-[#261a00] font-headline font-bold text-xs sm:text-sm shadow-xs active:scale-95 transition-all duration-150 flex items-center gap-1.5 cursor-pointer"
                  style={{
                    boxShadow: '0 2px 0 #d97706, 0 4px 10px rgba(251,191,36,0.25)',
                  }}
                >
                  <span>Start Quiz</span>
                  <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Weekly Streak Banner Card */}
      <div
        id="streak-banner-card"
        className="relative overflow-hidden rounded-2xl bg-white p-4 sm:p-5 shadow-xs border border-[#eaedff] flex items-center justify-between gap-3"
      >
        <div className="flex items-center gap-3.5 z-10 min-w-0">
          <div className="w-12 h-12 rounded-2xl bg-[#fbbf24] flex items-center justify-center text-[#6c4f00] shadow-xs shrink-0">
            <span
              className="material-symbols-outlined text-[28px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              local_fire_department
            </span>
          </div>
          <div className="flex flex-col min-w-0">
            <span className="font-headline font-bold text-base text-[#131b2e] leading-snug">
              Your Weekly Streak: 3 Days 🔥
            </span>
            <span className="text-xs text-[#4f4633] truncate">
              Complete today's quiz to keep it burning!
            </span>
          </div>
        </div>
        <div className="hidden sm:flex items-center gap-1.5 z-10 shrink-0">
          <div className="w-7 h-7 rounded-full bg-[#fbbf24] flex items-center justify-center text-[11px] text-[#261a00] font-bold shadow-xs">
            M
          </div>
          <div className="w-7 h-7 rounded-full bg-[#fbbf24] flex items-center justify-center text-[11px] text-[#261a00] font-bold shadow-xs">
            T
          </div>
          <div className="w-7 h-7 rounded-full bg-[#fbbf24] flex items-center justify-center text-[11px] text-[#261a00] font-bold shadow-xs">
            W
          </div>
          <div className="w-7 h-7 rounded-full bg-[#eaedff] flex items-center justify-center text-[11px] text-[#817661] font-semibold">
            T
          </div>
          <div className="w-7 h-7 rounded-full bg-[#eaedff] flex items-center justify-center text-[11px] text-[#817661] font-semibold">
            F
          </div>
        </div>
      </div>

      {/* Daily Lightning Challenge Showcase */}
      <div
        id="daily-challenge-card"
        className="rounded-2xl bg-[#f2f3ff] p-4 sm:p-5 shadow-xs border border-[#dae2fd] flex flex-col space-y-2.5"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#795900] text-[20px]">
              emoji_events
            </span>
            <span className="font-headline font-bold text-sm text-[#131b2e]">
              Daily Lightning Challenge
            </span>
          </div>
          <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#ffdf9f] text-[#261a00]">
            Ends in 4h 12m
          </span>
        </div>
        <div className="flex items-center justify-between gap-3">
          <p className="text-xs text-[#4f4633] leading-relaxed">
            5 mixed questions across all disciplines with double XP rewards.
          </p>
          <button
            id="play-free-daily-btn"
            type="button"
            onClick={onStartDailyChallenge}
            className="px-4 py-2 rounded-full bg-[#131b2e] hover:bg-[#283044] text-white text-xs font-bold active:scale-95 transition-transform shrink-0 cursor-pointer shadow-xs"
          >
            Play Free
          </button>
        </div>
      </div>
    </div>
  );
};

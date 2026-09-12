import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { Question, UserAnswerRecord } from '../types';

interface ResultsScreenProps {
  score: number;
  totalQuestions: number;
  correctCount: number;
  incorrectCount: number;
  unansweredCount: number;
  timeUsedSeconds: number;
  userAnswers: UserAnswerRecord[];
  questions: Question[];
  categoryName: string;
  onRetryQuiz: () => void;
  onBackToCategories: () => void;
}

export const ResultsScreen: React.FC<ResultsScreenProps> = ({
  score,
  totalQuestions,
  correctCount,
  incorrectCount,
  unansweredCount,
  timeUsedSeconds,
  userAnswers,
  questions,
  categoryName,
  onRetryQuiz,
  onBackToCategories,
}) => {
  const [showReviewModal, setShowReviewModal] = useState(false);

  const percentage = Math.round((score / totalQuestions) * 100);

  // Trigger confetti burst on high scores
  useEffect(() => {
    if (percentage >= 50) {
      try {
        confetti({
          particleCount: percentage >= 80 ? 90 : 50,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#fbbf24', '#006c49', '#6cf8bb', '#f59e0b'],
        });
      } catch (e) {
        // Safe fallback if canvas is restricted
      }
    }
  }, [percentage]);

  // Performance message calculation
  let performanceMessage = 'Keep practicing! Review the topic and try again.';
  let percentileBadge = 'Completed Quiz Review';
  if (percentage >= 90) {
    performanceMessage = 'Outstanding! Excellent mastery of this topic.';
    percentileBadge = 'Top 5% of recent test-takers';
  } else if (percentage >= 75) {
    performanceMessage = 'Excellent work! You have a strong understanding.';
    percentileBadge = 'Top 15% of recent test-takers';
  } else if (percentage >= 50) {
    performanceMessage = 'Good effort! Keep practicing to improve.';
    percentileBadge = 'Top 40% of test-takers';
  }

  // Format time
  const timeMinutes = Math.floor(timeUsedSeconds / 60)
    .toString()
    .padStart(2, '0');
  const timeSecs = (timeUsedSeconds % 60).toString().padStart(2, '0');
  const avgSeconds = Math.round(
    timeUsedSeconds / (totalQuestions - unansweredCount || 1)
  );

  // Bar percentages
  const correctPct = Math.round((correctCount / totalQuestions) * 100);
  const incorrectPct = Math.round((incorrectCount / totalQuestions) * 100);
  const unansweredPct = Math.max(0, 100 - correctPct - incorrectPct);

  return (
    <div className="flex flex-col w-full px-4 sm:px-6 py-4 max-w-xl mx-auto space-y-4 pb-28">
      {/* Celebration Pod */}
      <section
        id="results-celebration-pod"
        className="relative overflow-hidden bg-white rounded-3xl p-6 shadow-xs border border-[#eaedff] text-center flex flex-col items-center"
      >
        {/* Ambient Glows */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#fbbf24]/20 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-28 h-28 bg-[#6cf8bb]/20 rounded-full blur-2xl pointer-events-none" />

        {/* Trophy Badge */}
        <div className="relative mb-3">
          <div
            className="w-16 h-16 rounded-full bg-[#ffdf9f] flex items-center justify-center shadow-[0_6px_16px_rgba(251,191,36,0.35)] animate-bounce"
            style={{ animationDuration: '2.4s' }}
          >
            <span
              className="material-symbols-outlined text-[#795900] text-[36px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              emoji_events
            </span>
          </div>
          <span
            className="absolute bottom-0 -left-2 text-[#006c49] material-symbols-outlined text-[20px]"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            verified
          </span>
        </div>

        {/* Title */}
        <h1 className="font-headline font-bold text-2xl sm:text-3xl text-[#131b2e]">
          Quiz Complete! 🎉
        </h1>

        {/* Big Celebratory Score Display */}
        <div className="flex items-center justify-center gap-3 mt-2">
          <span className="font-headline font-extrabold text-3xl sm:text-4xl text-[#131b2e] tracking-tight">
            {score} / {totalQuestions}
          </span>
          <span className="text-xs sm:text-sm font-bold px-3 py-1 rounded-full bg-[#ffdf9f] text-[#261a00] shadow-xs">
            {percentage}%
          </span>
        </div>

        {/* Dynamic Performance Message */}
        <p className="text-sm text-[#4f4633] max-w-md mx-auto mt-2 leading-relaxed">
          {performanceMessage}
        </p>

        {/* Percentile Pill */}
        <div className="flex items-center gap-1.5 mt-3 px-3.5 py-1 rounded-full bg-[#f2f3ff] text-xs font-semibold text-[#4f4633]">
          <span
            className="material-symbols-outlined text-[16px] text-[#795900]"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            bolt
          </span>
          <span>{percentileBadge}</span>
        </div>
      </section>

      {/* Key Statistics Grid */}
      <section id="results-stats-grid" className="grid grid-cols-3 gap-2.5 sm:gap-3">
        {/* Correct Card */}
        <div className="flex flex-col items-center justify-center p-3 sm:p-4 rounded-2xl bg-[#6cf8bb]/20 border border-[#6cf8bb]/50 text-center shadow-xs">
          <div className="w-8 h-8 rounded-full bg-[#6cf8bb] flex items-center justify-center mb-1 text-[#00714d]">
            <span
              className="material-symbols-outlined text-[20px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              check_circle
            </span>
          </div>
          <span className="font-headline font-bold text-xl sm:text-2xl text-[#006c49] leading-none">
            {correctCount}
          </span>
          <span className="text-[11px] sm:text-xs font-semibold text-[#4f4633] mt-1">
            Correct
          </span>
        </div>

        {/* Incorrect Card */}
        <div className="flex flex-col items-center justify-center p-3 sm:p-4 rounded-2xl bg-[#ffdad6]/40 border border-[#ffdad6] text-center shadow-xs">
          <div className="w-8 h-8 rounded-full bg-[#ffdad6] flex items-center justify-center mb-1 text-[#ba1a1a]">
            <span
              className="material-symbols-outlined text-[20px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              cancel
            </span>
          </div>
          <span className="font-headline font-bold text-xl sm:text-2xl text-[#ba1a1a] leading-none">
            {incorrectCount}
          </span>
          <span className="text-[11px] sm:text-xs font-semibold text-[#4f4633] mt-1">
            Incorrect
          </span>
        </div>

        {/* Accuracy Card */}
        <div className="flex flex-col items-center justify-center p-3 sm:p-4 rounded-2xl bg-[#ffdf9f]/30 border border-[#ffdf9f] text-center shadow-xs">
          <div className="w-8 h-8 rounded-full bg-[#ffdf9f] flex items-center justify-center mb-1 text-[#795900]">
            <span
              className="material-symbols-outlined text-[20px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              my_location
            </span>
          </div>
          <span className="font-headline font-bold text-xl sm:text-2xl text-[#795900] leading-none">
            {percentage}%
          </span>
          <span className="text-[11px] sm:text-xs font-semibold text-[#4f4633] mt-1">
            Accuracy
          </span>
        </div>
      </section>

      {/* Detailed Performance Breakdown Section */}
      <section
        id="results-breakdown-card"
        className="bg-white rounded-3xl p-5 sm:p-6 shadow-xs border border-[#eaedff] space-y-4"
      >
        <div className="flex items-center justify-between">
          <h2 className="font-headline font-bold text-base sm:text-lg text-[#131b2e] flex items-center gap-2">
            <span className="material-symbols-outlined text-[#795900] text-[22px]">
              analytics
            </span>
            Performance Breakdown
          </h2>
          <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#eaedff] text-[#4f4633]">
            {categoryName}
          </span>
        </div>

        {/* Visual Horizontal Stacked Performance Bar */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-center text-xs font-bold text-[#4f4633]">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#006c49] inline-block" />
              Correct ({correctPct}%)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#ba1a1a] inline-block" />
              Incorrect ({incorrectPct}%)
            </span>
            {unansweredPct > 0 && (
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#817661] inline-block" />
                Unanswered ({unansweredPct}%)
              </span>
            )}
          </div>
          <div className="w-full h-3 rounded-full bg-[#eaedff] overflow-hidden flex shadow-inner">
            <div
              className="h-full bg-[#006c49] transition-all duration-700 ease-out"
              style={{ width: `${correctPct}%` }}
              title={`Correct: ${correctPct}%`}
            />
            <div
              className="h-full bg-[#ba1a1a] transition-all duration-700 ease-out"
              style={{ width: `${incorrectPct}%` }}
              title={`Incorrect: ${incorrectPct}%`}
            />
            <div
              className="h-full bg-[#817661] transition-all duration-700 ease-out"
              style={{ width: `${unansweredPct}%` }}
              title={`Unanswered: ${unansweredPct}%`}
            />
          </div>
        </div>

        {/* Detailed Stats Metric Rows */}
        <div className="space-y-2 pt-1 divide-y divide-[#f2f3ff]">
          {/* Row 1: Correct */}
          <div className="flex items-center justify-between py-1.5">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-7 h-7 rounded-full bg-[#6cf8bb]/30 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[#006c49] text-[16px]">
                  check
                </span>
              </div>
              <span className="text-xs sm:text-sm text-[#131b2e] font-medium">
                Correct Answers
              </span>
            </div>
            <span className="text-xs sm:text-sm font-bold text-[#131b2e]">
              {correctCount} <span className="text-[#817661] font-normal">({correctPct}%)</span>
            </span>
          </div>

          {/* Row 2: Incorrect */}
          <div className="flex items-center justify-between py-1.5">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-7 h-7 rounded-full bg-[#ffdad6]/60 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[#ba1a1a] text-[16px]">
                  close
                </span>
              </div>
              <span className="text-xs sm:text-sm text-[#131b2e] font-medium">
                Incorrect Answers
              </span>
            </div>
            <span className="text-xs sm:text-sm font-bold text-[#131b2e]">
              {incorrectCount} <span className="text-[#817661] font-normal">({incorrectPct}%)</span>
            </span>
          </div>

          {/* Row 3: Unanswered */}
          <div className="flex items-center justify-between py-1.5">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-7 h-7 rounded-full bg-[#eaedff] flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[#817661] text-[16px]">
                  remove
                </span>
              </div>
              <span className="text-xs sm:text-sm text-[#131b2e] font-medium">
                Unanswered Questions
              </span>
            </div>
            <span className="text-xs sm:text-sm font-bold text-[#131b2e]">
              {unansweredCount} <span className="text-[#817661] font-normal">({unansweredPct}%)</span>
            </span>
          </div>

          {/* Row 4: Time Used */}
          <div className="flex items-center justify-between py-1.5">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-7 h-7 rounded-full bg-[#eaedff] flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[#817661] text-[16px]">
                  timer
                </span>
              </div>
              <span className="text-xs sm:text-sm text-[#131b2e] font-medium">
                Time Used
              </span>
            </div>
            <div className="text-right">
              <span className="text-xs sm:text-sm font-bold text-[#131b2e] block">
                {timeMinutes}:{timeSecs}
              </span>
              <span className="text-[11px] text-[#817661]">
                Avg {avgSeconds}s / question
              </span>
            </div>
          </div>

          {/* Row 5: Final Score */}
          <div className="flex items-center justify-between py-2 bg-[#f2f3ff] px-3 rounded-2xl mt-2">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-7 h-7 rounded-full bg-[#ffdf9f] flex items-center justify-center shrink-0">
                <span
                  className="material-symbols-outlined text-[#795900] text-[16px]"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  star
                </span>
              </div>
              <span className="text-xs sm:text-sm font-bold text-[#131b2e]">
                Final Score
              </span>
            </div>
            <span className="font-headline font-extrabold text-base sm:text-lg text-[#795900]">
              {score * 10} <span className="text-xs font-semibold text-[#817661]">/ 100 Pts</span>
            </span>
          </div>
        </div>
      </section>

      {/* Review Banner Tile */}
      <section
        id="review-missed-questions-tile"
        onClick={() => setShowReviewModal(true)}
        className="bg-[#f2f3ff] hover:bg-[#eaedff] cursor-pointer rounded-2xl p-4 flex items-center gap-3.5 shadow-xs border border-[#dae2fd] transition-colors duration-150"
      >
        <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 bg-[#eaedff] flex items-center justify-center text-[#795900]">
          <span className="material-symbols-outlined text-2xl">menu_book</span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-headline font-bold text-sm text-[#131b2e] truncate">
            Review Questions & Explanations
          </p>
          <p className="text-xs text-[#4f4633] truncate">
            Inspect all answers, rationale, and key learning points.
          </p>
        </div>
        <button
          type="button"
          className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-[#131b2e] shadow-xs"
          aria-label="Expand Review"
        >
          <span className="material-symbols-outlined text-[18px]">chevron_right</span>
        </button>
      </section>

      {/* Action CTA Buttons */}
      <section className="space-y-2.5 pt-1">
        {/* Primary Retry Button */}
        <button
          id="retry-quiz-btn"
          type="button"
          onClick={onRetryQuiz}
          className="w-full py-3.5 px-6 rounded-full bg-[#fbbf24] hover:bg-[#f59e0b] text-[#261a00] font-headline font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-md active:scale-95 transition-all cursor-pointer"
          style={{
            boxShadow: '0 3px 0 #d97706, 0 6px 14px rgba(251,191,36,0.3)',
          }}
        >
          <span
            className="material-symbols-outlined text-[20px]"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            replay
          </span>
          <span>Retry Quiz</span>
        </button>

        {/* Secondary Back to Categories Button */}
        <button
          id="back-to-categories-btn"
          type="button"
          onClick={onBackToCategories}
          className="w-full py-3 px-6 rounded-full bg-white hover:bg-[#eaedff] text-[#131b2e] border border-[#eaedff] font-headline font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-xs active:scale-95 transition-all cursor-pointer"
        >
          <span className="material-symbols-outlined text-[20px]">grid_view</span>
          <span>Back to Categories</span>
        </button>
      </section>

      {/* Review Modal / Drawer */}
      {showReviewModal && (
        <div
          id="review-modal-backdrop"
          className="fixed inset-0 z-50 bg-[#131b2e]/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fade-in"
          onClick={() => setShowReviewModal(false)}
        >
          <div
            id="review-modal-content"
            className="bg-white rounded-t-3xl sm:rounded-3xl p-5 sm:p-6 w-full max-w-xl max-h-[85vh] overflow-y-auto shadow-2xl flex flex-col space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-[#f2f3ff] pb-3">
              <div>
                <h3 className="font-headline font-bold text-lg text-[#131b2e]">
                  Question Review ({categoryName})
                </h3>
                <p className="text-xs text-[#817661]">
                  Review your answers and detailed explanations.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowReviewModal(false)}
                className="w-8 h-8 rounded-full bg-[#eaedff] flex items-center justify-center text-[#131b2e] hover:bg-[#d2d9f4]"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <div className="space-y-4 overflow-y-auto pr-1">
              {questions.map((q, idx) => {
                const userAns = userAnswers.find((a) => a.questionIndex === idx);
                const isCorrect = userAns?.isCorrect;
                const wasAnswered = userAns?.selectedOptionIndex !== null && userAns?.selectedOptionIndex !== undefined;

                return (
                  <div
                    key={q.id}
                    className={`p-4 rounded-2xl border ${
                      isCorrect
                        ? 'border-[#6cf8bb] bg-[#6cf8bb]/10'
                        : wasAnswered
                        ? 'border-[#ffdad6] bg-[#ffdad6]/20'
                        : 'border-[#eaedff] bg-[#f2f3ff]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-white text-[#131b2e] shadow-2xs">
                        Q{idx + 1} • {q.topic}
                      </span>
                      <span
                        className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                          isCorrect
                            ? 'bg-[#006c49] text-white'
                            : wasAnswered
                            ? 'bg-[#ba1a1a] text-white'
                            : 'bg-[#817661] text-white'
                        }`}
                      >
                        {isCorrect ? 'Correct' : wasAnswered ? 'Incorrect' : 'Unanswered'}
                      </span>
                    </div>

                    <h4 className="font-headline font-bold text-sm sm:text-base text-[#131b2e] mb-2.5">
                      {q.question}
                    </h4>

                    {/* Options list in review */}
                    <div className="space-y-1.5 mb-2.5">
                      {q.options.map((opt, oIdx) => {
                        const isUserChoice = userAns?.selectedOptionIndex === oIdx;
                        const isRightChoice = q.correctIndex === oIdx;

                        let optClass = 'bg-white/80 text-[#4f4633] border border-[#eaedff]';
                        if (isRightChoice) {
                          optClass = 'bg-[#6cf8bb]/40 text-[#002113] border-2 border-[#006c49] font-bold';
                        } else if (isUserChoice && !isRightChoice) {
                          optClass = 'bg-[#ffdad6]/80 text-[#93000a] border-2 border-[#ba1a1a] font-bold';
                        }

                        return (
                          <div
                            key={oIdx}
                            className={`px-3 py-1.5 rounded-xl text-xs flex items-center justify-between ${optClass}`}
                          >
                            <span>
                              <strong>{['A', 'B', 'C', 'D'][oIdx]}.</strong> {opt}
                            </span>
                            {isRightChoice && (
                              <span className="text-[11px] font-bold text-[#006c49]">Correct</span>
                            )}
                            {isUserChoice && !isRightChoice && (
                              <span className="text-[11px] font-bold text-[#ba1a1a]">Your Answer</span>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {/* Explanation */}
                    <div className="p-2.5 rounded-xl bg-white/90 text-xs text-[#131b2e] border border-black/5">
                      <span className="font-bold text-[#795900] block mb-0.5">Explanation:</span>
                      {q.explanation}
                    </div>
                  </div>
                );
              })}
            </div>

            <button
              type="button"
              onClick={() => setShowReviewModal(false)}
              className="w-full py-2.5 rounded-full bg-[#131b2e] text-white text-xs font-bold cursor-pointer"
            >
              Close Review
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useState, useEffect, useRef } from 'react';
import { Question, UserAnswerRecord } from '../types';

interface QuizScreenProps {
  categoryName: string;
  categoryIcon: string;
  questions: Question[];
  onFinishQuiz: (results: {
    score: number;
    totalQuestions: number;
    correctCount: number;
    incorrectCount: number;
    unansweredCount: number;
    timeUsedSeconds: number;
    userAnswers: UserAnswerRecord[];
    timedOut: boolean;
  }) => void;
  onExitToCategories: () => void;
}

const OPTION_LETTERS = ['A', 'B', 'C', 'D'];

export const QuizScreen: React.FC<QuizScreenProps> = ({
  categoryName,
  categoryIcon,
  questions,
  onFinishQuiz,
  onExitToCategories,
}) => {
  const [currentQuestion, setCurrentQuestion] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState<number>(60);
  const [userAnswers, setUserAnswers] = useState<UserAnswerRecord[]>([]);
  const [timeUsedSeconds, setTimeUsedSeconds] = useState<number>(0);
  const [showTimesUpAlert, setShowTimesUpAlert] = useState<boolean>(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const totalQuestions = questions.length;
  const currentQ = questions[currentQuestion];

  // Timer countdown
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          handleTimeExpired();
          return 0;
        }
        return prev - 1;
      });
      setTimeUsedSeconds((prev) => prev + 1);
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [userAnswers, currentQuestion, score]);

  const handleTimeExpired = () => {
    setShowTimesUpAlert(true);
    // Fill remaining questions as unanswered
    setTimeout(() => {
      const finalAnswers: UserAnswerRecord[] = [...userAnswers];
      for (let i = finalAnswers.length; i < totalQuestions; i++) {
        finalAnswers.push({
          questionIndex: i,
          selectedOptionIndex: null,
          isCorrect: false,
        });
      }

      const correctCount = finalAnswers.filter((a) => a.isCorrect).length;
      const incorrectCount = finalAnswers.filter(
        (a) => a.selectedOptionIndex !== null && !a.isCorrect
      ).length;
      const unansweredCount = finalAnswers.filter(
        (a) => a.selectedOptionIndex === null
      ).length;

      onFinishQuiz({
        score: correctCount,
        totalQuestions,
        correctCount,
        incorrectCount,
        unansweredCount,
        timeUsedSeconds: 60,
        userAnswers: finalAnswers,
        timedOut: true,
      });
    }, 1200);
  };

  const handleSelectOption = (optionIndex: number) => {
    if (isAnswerSubmitted || timeLeft <= 0) return;

    const isCorrect = optionIndex === currentQ.correctIndex;
    setSelectedAnswer(optionIndex);
    setIsAnswerSubmitted(true);

    if (isCorrect) {
      setScore((prev) => prev + 1);
    }

    // Record answer
    const newAnswer: UserAnswerRecord = {
      questionIndex: currentQuestion,
      selectedOptionIndex: optionIndex,
      isCorrect,
    };

    setUserAnswers((prev) => [...prev, newAnswer]);
  };

  const handleNextQuestion = () => {
    if (currentQuestion + 1 < totalQuestions) {
      setCurrentQuestion((prev) => prev + 1);
      setSelectedAnswer(null);
      setIsAnswerSubmitted(false);
    } else {
      // Quiz completed!
      if (timerRef.current) clearInterval(timerRef.current);
      const finalAnswers = [...userAnswers];
      const correctCount = finalAnswers.filter((a) => a.isCorrect).length;
      const incorrectCount = finalAnswers.filter(
        (a) => a.selectedOptionIndex !== null && !a.isCorrect
      ).length;
      const unansweredCount = finalAnswers.filter(
        (a) => a.selectedOptionIndex === null
      ).length;

      onFinishQuiz({
        score: correctCount,
        totalQuestions,
        correctCount,
        incorrectCount,
        unansweredCount,
        timeUsedSeconds,
        userAnswers: finalAnswers,
        timedOut: false,
      });
    }
  };

  // Format mm:ss
  const minutes = Math.floor(timeLeft / 60)
    .toString()
    .padStart(2, '0');
  const seconds = (timeLeft % 60).toString().padStart(2, '0');
  const isTimeCritical = timeLeft <= 10;

  const progressPercentage = Math.round(
    ((currentQuestion + (isAnswerSubmitted ? 1 : 0)) / totalQuestions) * 100
  );

  return (
    <div className="flex flex-col w-full px-4 sm:px-6 py-4 max-w-xl mx-auto space-y-4 pb-28">
      {/* Time's Up Toast/Overlay */}
      {showTimesUpAlert && (
        <div className="fixed inset-0 z-50 bg-[#131b2e]/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl p-6 shadow-2xl max-w-sm w-full text-center space-y-3 transform scale-100">
            <div className="w-16 h-16 rounded-full bg-[#ffdad6] text-[#ba1a1a] flex items-center justify-center mx-auto animate-bounce">
              <span className="material-symbols-outlined text-3xl">timer_off</span>
            </div>
            <h3 className="font-headline text-2xl font-bold text-[#131b2e]">Time's Up!</h3>
            <p className="text-sm text-[#4f4633]">
              The 60-second timer has expired. Let's see how you performed!
            </p>
          </div>
        </div>
      )}

      {/* Topic & Header Card */}
      <div
        id="quiz-topic-card"
        className="flex items-center justify-between gap-3 bg-white p-4 sm:p-5 rounded-2xl shadow-xs border border-[#eaedff]"
      >
        <div className="min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <span className="inline-flex items-center justify-center w-7 h-7 rounded-xl bg-[#fbbf24] text-[#6c4f00] shrink-0">
              <span className="material-symbols-outlined text-[18px]">{categoryIcon}</span>
            </span>
            <h1 className="font-headline font-bold text-lg sm:text-xl text-[#131b2e] truncate">
              {categoryName} Quiz
            </h1>
          </div>
          <p className="text-xs text-[#817661] truncate">
            Test your knowledge with {totalQuestions} questions
          </p>
        </div>

        {/* Countdown Timer Pill */}
        <div
          id="quiz-timer-pill"
          className={`shrink-0 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full shadow-xs transition-colors duration-300 ${
            isTimeCritical
              ? 'bg-[#ffdad6] text-[#93000a] animate-pulse font-bold'
              : 'bg-[#ffdf9f] text-[#261a00] font-semibold'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">timer</span>
          <span className="font-mono text-sm tracking-wider font-bold">
            {minutes}:{seconds}
          </span>
        </div>
      </div>

      {/* Progress Section */}
      <div
        id="quiz-progress-section"
        className="bg-white p-4 sm:p-5 rounded-2xl shadow-xs border border-[#eaedff] space-y-2.5"
      >
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-[#131b2e]">
              Question {currentQuestion + 1} of {totalQuestions}
            </span>
            <span className="text-[#817661] text-xs">•</span>
            <span className="text-xs text-[#817661] font-medium truncate">
              {currentQ.topic}
            </span>
          </div>
          <div
            id="quiz-score-badge"
            className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#6cf8bb]/40 text-[#00714d] text-xs font-bold shadow-2xs"
          >
            <span
              className="material-symbols-outlined text-[16px] text-[#006c49]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              stars
            </span>
            <span>Score: {score}</span>
          </div>
        </div>

        {/* Progress Track & Bar */}
        <div className="w-full h-3 bg-[#eaedff] rounded-full overflow-hidden p-0.5">
          <div
            id="quiz-progress-bar"
            className="h-full bg-[#fbbf24] rounded-full transition-all duration-500 ease-out shadow-xs"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      {/* Main Question Card */}
      <div
        id="quiz-main-card"
        className="bg-white rounded-2xl shadow-xs border border-[#eaedff] p-4 sm:p-6 flex flex-col space-y-4"
      >
        {/* Question Badge & Header */}
        <div className="flex items-center justify-between">
          <span className="px-3 py-1 rounded-full bg-[#ffdf9f] text-[#5c4300] text-[11px] font-bold tracking-wider uppercase">
            Question {String(currentQuestion + 1).padStart(2, '0')}
          </span>
          <div className="flex items-center gap-1 text-[#817661] text-xs font-semibold">
            <span className="material-symbols-outlined text-[16px] text-[#fbbf24]">bolt</span>
            <span>+100 pts</span>
          </div>
        </div>

        {/* Question Prompt */}
        <div>
          <h2
            id="current-question-text"
            className="font-headline font-bold text-lg sm:text-xl text-[#131b2e] leading-snug"
          >
            {currentQ.question}
          </h2>
        </div>

        {/* Options Stack */}
        <div id="optionsContainer" className="space-y-2.5">
          {currentQ.options.map((option, idx) => {
            const letter = OPTION_LETTERS[idx];
            const isSelected = selectedAnswer === idx;
            const isCorrectOption = idx === currentQ.correctIndex;

            let optionStyle =
              'bg-[#f2f3ff] text-[#131b2e] border-transparent hover:bg-[#eaedff] active:scale-[0.99]';
            let badgeStyle = 'bg-[#dae2fd] text-[#131b2e]';
            let indicator = (
              <span className="w-5 h-5 rounded-full bg-[#eaedff] shrink-0 border border-[#dae2fd]" />
            );

            if (isAnswerSubmitted) {
              if (isSelected && isCorrectOption) {
                // Correctly chosen
                optionStyle =
                  'bg-[#6cf8bb]/40 text-[#002113] border-2 border-[#006c49] shadow-xs';
                badgeStyle = 'bg-[#006c49] text-white font-bold';
                indicator = (
                  <span className="w-6 h-6 rounded-full bg-[#006c49] text-white flex items-center justify-center shrink-0 shadow-xs">
                    <span className="material-symbols-outlined text-[16px]">check</span>
                  </span>
                );
              } else if (isSelected && !isCorrectOption) {
                // Incorrectly chosen
                optionStyle =
                  'bg-[#ffdad6]/60 text-[#93000a] border-2 border-[#ba1a1a] shadow-xs';
                badgeStyle = 'bg-[#ba1a1a] text-white font-bold';
                indicator = (
                  <span className="w-6 h-6 rounded-full bg-[#ba1a1a] text-white flex items-center justify-center shrink-0 shadow-xs">
                    <span className="material-symbols-outlined text-[16px]">close</span>
                  </span>
                );
              } else if (isCorrectOption) {
                // Highlight the correct answer even if user missed it
                optionStyle =
                  'bg-[#6cf8bb]/25 text-[#005236] border-2 border-[#006c49]/60 border-dashed';
                badgeStyle = 'bg-[#006c49] text-white font-bold';
                indicator = (
                  <span className="w-6 h-6 rounded-full bg-[#006c49] text-white flex items-center justify-center shrink-0 shadow-xs">
                    <span className="material-symbols-outlined text-[16px]">check</span>
                  </span>
                );
              } else {
                optionStyle = 'bg-[#f2f3ff]/60 text-[#817661] opacity-60';
                badgeStyle = 'bg-[#eaedff] text-[#817661]';
              }
            }

            return (
              <button
                key={idx}
                id={`quiz-option-${letter.toLowerCase()}`}
                type="button"
                disabled={isAnswerSubmitted || timeLeft <= 0}
                onClick={() => handleSelectOption(idx)}
                className={`w-full flex items-center justify-between p-3.5 rounded-2xl text-left transition-all duration-150 cursor-pointer ${optionStyle}`}
              >
                <div className="flex items-center gap-3 min-w-0 pr-2">
                  <span
                    className={`w-8 h-8 rounded-full ${badgeStyle} text-xs font-bold flex items-center justify-center shrink-0 transition-colors`}
                  >
                    {letter}
                  </span>
                  <span className="text-sm sm:text-base font-medium truncate">
                    {option}
                  </span>
                </div>
                {indicator}
              </button>
            );
          })}
        </div>

        {/* Instant Feedback Banner */}
        {isAnswerSubmitted && (
          <div
            id="instant-feedback-banner"
            className={`flex items-start gap-3 p-4 rounded-2xl transition-all duration-200 animate-fade-in ${
              selectedAnswer === currentQ.correctIndex
                ? 'bg-[#6cf8bb]/30 text-[#002113] border border-[#006c49]/30'
                : 'bg-[#ffdad6]/60 text-[#410004] border border-[#ba1a1a]/30'
            }`}
          >
            <span
              className={`material-symbols-outlined text-[22px] shrink-0 mt-0.5 ${
                selectedAnswer === currentQ.correctIndex
                  ? 'text-[#006c49]'
                  : 'text-[#ba1a1a]'
              }`}
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              {selectedAnswer === currentQ.correctIndex ? 'check_circle' : 'cancel'}
            </span>
            <div className="text-left">
              <p
                className={`text-sm font-bold mb-1 ${
                  selectedAnswer === currentQ.correctIndex
                    ? 'text-[#005236]'
                    : 'text-[#93000a]'
                }`}
              >
                {selectedAnswer === currentQ.correctIndex
                  ? 'Correct Answer!'
                  : 'Incorrect Answer!'}
              </p>
              <p className="text-xs sm:text-sm leading-relaxed text-[#131b2e]/90">
                {currentQ.explanation}
              </p>
            </div>
          </div>
        )}

        {/* Action / Next Question Button */}
        {isAnswerSubmitted && (
          <button
            id="nextBtn"
            type="button"
            onClick={handleNextQuestion}
            className="w-full py-3.5 px-6 rounded-full bg-[#fbbf24] hover:bg-[#f59e0b] text-[#261a00] font-headline font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-sm active:scale-[0.98] transition-all cursor-pointer"
            style={{
              boxShadow: '0 3px 0 #d97706, 0 6px 14px rgba(251,191,36,0.3)',
            }}
          >
            <span>
              {currentQuestion + 1 === totalQuestions
                ? 'Finish Quiz & View Results'
                : 'Next Question'}
            </span>
            <span className="material-symbols-outlined text-[20px]">
              {currentQuestion + 1 === totalQuestions ? 'task_alt' : 'arrow_forward'}
            </span>
          </button>
        )}
      </div>

      {/* Question Quick Navigator */}
      <div
        id="question-navigator-card"
        className="bg-white rounded-2xl shadow-xs border border-[#eaedff] p-4 sm:p-5 space-y-3"
      >
        <div className="flex items-center justify-between text-[#131b2e]">
          <span className="text-xs sm:text-sm font-bold font-headline">
            Question Navigator
          </span>
          <span className="text-xs text-[#817661] font-semibold">
            {currentQuestion + 1} / {totalQuestions} Active
          </span>
        </div>

        {/* 1-10 Circle Row */}
        <div className="grid grid-cols-5 sm:grid-cols-10 gap-2 place-items-center">
          {questions.map((q, idx) => {
            const recorded = userAnswers.find((a) => a.questionIndex === idx);
            const isCurrent = idx === currentQuestion;

            if (recorded) {
              if (recorded.isCorrect) {
                return (
                  <button
                    key={idx}
                    id={`nav-question-${idx + 1}`}
                    type="button"
                    className="w-9 h-9 rounded-full bg-[#006c49] text-white text-xs font-bold flex items-center justify-center shadow-xs"
                    title={`Question ${idx + 1}: Correct`}
                  >
                    <span className="material-symbols-outlined text-[18px]">check</span>
                  </button>
                );
              } else {
                return (
                  <button
                    key={idx}
                    id={`nav-question-${idx + 1}`}
                    type="button"
                    className="w-9 h-9 rounded-full bg-[#ba1a1a] text-white text-xs font-bold flex items-center justify-center shadow-xs"
                    title={`Question ${idx + 1}: Incorrect`}
                  >
                    <span className="material-symbols-outlined text-[18px]">close</span>
                  </button>
                );
              }
            }

            if (isCurrent) {
              return (
                <button
                  key={idx}
                  id={`nav-question-${idx + 1}`}
                  type="button"
                  className="w-9 h-9 rounded-full bg-[#fbbf24] text-[#261a00] text-xs font-bold flex items-center justify-center shadow-xs scale-110 ring-2 ring-[#fbbf24]/50"
                  title={`Question ${idx + 1}: Current`}
                >
                  {idx + 1}
                </button>
              );
            }

            // Pending
            return (
              <button
                key={idx}
                id={`nav-question-${idx + 1}`}
                type="button"
                className="w-9 h-9 rounded-full bg-[#eaedff] text-[#817661] text-xs font-semibold flex items-center justify-center"
                title={`Question ${idx + 1}: Pending`}
              >
                {idx + 1}
              </button>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-4 pt-1 text-xs text-[#817661] font-semibold">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#006c49]" />
            <span>Solved</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#fbbf24]" />
            <span>Current</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#eaedff]" />
            <span>Pending</span>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Header } from './components/Header';
import { CategoryScreen } from './components/CategoryScreen';
import { QuizScreen } from './components/QuizScreen';
import { ResultsScreen } from './components/ResultsScreen';
import { BottomNav } from './components/BottomNav';
import { CATEGORIES, QUIZ_QUESTIONS } from './data/quizData';
import { ScreenState, UserAnswerRecord } from './types';

export default function App() {
  const [screen, setScreen] = useState<ScreenState>('categories');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('science');
  const [quizKey, setQuizKey] = useState<number>(0);

  // Results State
  const [resultsData, setResultsData] = useState<{
    score: number;
    totalQuestions: number;
    correctCount: number;
    incorrectCount: number;
    unansweredCount: number;
    timeUsedSeconds: number;
    userAnswers: UserAnswerRecord[];
    timedOut: boolean;
  } | null>(null);

  const selectedCategory =
    CATEGORIES.find((c) => c.id === selectedCategoryId) || CATEGORIES[0];
  const currentQuestions = QUIZ_QUESTIONS[selectedCategoryId] || QUIZ_QUESTIONS.science;

  const handleSelectCategory = (catId: string) => {
    setSelectedCategoryId(catId);
    setQuizKey((k) => k + 1);
    setScreen('quiz');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStartDailyChallenge = () => {
    // Choose General Knowledge or Science for daily challenge
    setSelectedCategoryId('general-knowledge');
    setQuizKey((k) => k + 1);
    setScreen('quiz');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFinishQuiz = (results: {
    score: number;
    totalQuestions: number;
    correctCount: number;
    incorrectCount: number;
    unansweredCount: number;
    timeUsedSeconds: number;
    userAnswers: UserAnswerRecord[];
    timedOut: boolean;
  }) => {
    setResultsData(results);
    setScreen('results');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRetryQuiz = () => {
    setQuizKey((k) => k + 1);
    setScreen('quiz');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToCategories = () => {
    if (screen === 'quiz') {
      const confirmExit = window.confirm(
        'Are you sure you want to leave this quiz? Your active progress will be lost.'
      );
      if (!confirmExit) return;
    }
    setScreen('categories');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#faf8ff] text-[#131b2e] antialiased selection:bg-[#fbbf24] selection:text-[#6c4f00]">
      {/* Top Header */}
      <Header
        screen={screen}
        onBackToCategories={handleBackToCategories}
        categoryName={selectedCategory.name}
      />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col relative w-full pt-16 min-h-screen">
        {screen === 'categories' && (
          <CategoryScreen
            onSelectCategory={handleSelectCategory}
            onStartDailyChallenge={handleStartDailyChallenge}
          />
        )}

        {screen === 'quiz' && (
          <QuizScreen
            key={quizKey}
            categoryName={selectedCategory.name}
            categoryIcon={selectedCategory.icon}
            questions={currentQuestions}
            onFinishQuiz={handleFinishQuiz}
            onExitToCategories={handleBackToCategories}
          />
        )}

        {screen === 'results' && resultsData && (
          <ResultsScreen
            score={resultsData.score}
            totalQuestions={resultsData.totalQuestions}
            correctCount={resultsData.correctCount}
            incorrectCount={resultsData.incorrectCount}
            unansweredCount={resultsData.unansweredCount}
            timeUsedSeconds={resultsData.timeUsedSeconds}
            userAnswers={resultsData.userAnswers}
            questions={currentQuestions}
            categoryName={selectedCategory.name}
            onRetryQuiz={handleRetryQuiz}
            onBackToCategories={handleBackToCategories}
          />
        )}
      </main>

      {/* Persistent Bottom Nav */}
      <BottomNav
        currentScreen={screen}
        onNavigate={(newScreen) => {
          if (newScreen === 'categories') {
            handleBackToCategories();
          } else {
            setScreen(newScreen);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }
        }}
        onStartQuiz={() => handleSelectCategory(selectedCategoryId || 'science')}
        hasActiveQuiz={screen === 'quiz'}
        hasResults={resultsData !== null}
      />
    </div>
  );
}

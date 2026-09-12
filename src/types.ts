export interface Question {
  id: number;
  question: string;
  options: [string, string, string, string];
  correctIndex: number;
  topic: string;
  explanation: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'All Levels';
  difficultyClass: string;
  iconBgClass: string;
  iconColorClass: string;
  questionCount: number;
  durationMinutes: number;
  xp: number;
  tags: string[];
}

export interface UserAnswerRecord {
  questionIndex: number;
  selectedOptionIndex: number | null; // null if time expired
  isCorrect: boolean;
}

export type ScreenState = 'categories' | 'quiz' | 'results';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Trophy, Edit2, Sun, Moon, Send } from 'lucide-react';
import { QuizCard } from './components/QuizCard';
import { ResultScreen } from './components/ResultScreen';
import { QuestionNavigator } from './components/QuestionNavigator';
import { ReviewBeforeSubmit } from './components/ReviewBeforeSubmit';
import { ChapterSelection } from './components/ChapterSelection';
import { Leaderboard } from './components/Leaderboard';
import { InsightEngine } from './components/InsightEngine';
import { api } from './services/api'; // Added import
import questionsData from './data/questions.json';
import insightData from './data/insight-loops.json';

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

function App() {
  // Game State
  const [gameState, setGameState] = useState<'start' | 'chapters' | 'playing' | 'results' | 'review' | 'insight'>('start');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [userName, setUserName] = useState("");
  const [nameInput, setNameInput] = useState("");

  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});
  const [timeRemaining, setTimeRemaining] = useState(600);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  // Premium features state
  const [selectedChapterId, setSelectedChapterId] = useState<string | null>(null);
  const [completedChapters, setCompletedChapters] = useState<string[]>([]);
  const [showLeaderboard, setShowLeaderboard] = useState(false);

  // Dark mode effect
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Timer effect
  useEffect(() => {
    if (gameState === 'playing' && !quizSubmitted) {
      const timer = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            handleSubmitQuiz();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [gameState, quizSubmitted]);

  // Keyboard shortcuts
  useEffect(() => {
    if (gameState === 'playing') {
      const handleKeyPress = (e: KeyboardEvent) => {
        if (e.key === 'ArrowLeft') handlePrevious();
        else if (e.key === 'ArrowRight') handleNext();
        else if (['1', '2', '3', '4'].includes(e.key)) {
          const optionIndex = parseInt(e.key) - 1;
          const currentQuestion = questions[currentQuestionIndex];
          if (currentQuestion && currentQuestion.options[optionIndex]) {
            handleSelectOption(currentQuestionIndex, currentQuestion.options[optionIndex]);
          }
        }
      };
      window.addEventListener('keydown', handleKeyPress);
      return () => window.removeEventListener('keydown', handleKeyPress);
    }
  }, [gameState, currentQuestionIndex, questions]);

  const handleNameSubmit = () => {
    if (!nameInput.trim()) return;
    setUserName(nameInput);
    setGameState('chapters');
  };

  const startChapter = (chapterId: string) => {
    let quizQuestions: Question[] = [];

    if (chapterId === 'overall') {
      // Aggregate all questions from all chapters
      questionsData.chapters.forEach(chapter => {
        quizQuestions = [...quizQuestions, ...chapter.questions];
      });
    } else {
      const chapter = questionsData.chapters.find(c => c.id === chapterId);
      if (!chapter) return;
      quizQuestions = [...chapter.questions];
    }

    setSelectedChapterId(chapterId);

    // Smart Shuffle: Randomize questions AND their options
    // For specific chapters, limit to 15 questions to ensure variety across sessions if pool is larger
    // For overall, keep 50
    const questionLimit = chapterId === 'overall' ? 50 : 10;

    const shuffled = quizQuestions
      .sort(() => 0.5 - Math.random())
      .slice(0, questionLimit)
      .map(q => ({
        ...q,
        options: [...q.options].sort(() => 0.5 - Math.random()) // Jumble choices
      }));

    setQuestions(shuffled);

    setGameState('playing');
    setCurrentQuestionIndex(0);
    setUserAnswers({});

    // Time: 90s per question or max 1 hour
    const timerPerQuestion = 90;
    setTimeRemaining(Math.min(shuffled.length * timerPerQuestion, 3600));

    setQuizSubmitted(false);
  };

  const [streak, setStreak] = useState(0);

  const handleSelectOption = (questionIndex: number, option: string) => {
    setUserAnswers(prev => ({ ...prev, [questionIndex]: option }));

    // Streak logic
    const currentQuestion = questions[currentQuestionIndex];
    if (option === currentQuestion.correctAnswer) {
      setStreak(prev => prev + 1);
    } else {
      setStreak(0);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) setCurrentQuestionIndex(prev => prev - 1);
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) setCurrentQuestionIndex(prev => prev + 1);
  };

  const handleNavigateToQuestion = (index: number) => {
    setCurrentQuestionIndex(index);
  };

  const handleRequestReview = () => {
    setGameState('review');
  };

  const handleEditFromReview = (index: number) => {
    setCurrentQuestionIndex(index);
    setGameState('playing');
  };

  const handleSubmitQuiz = () => {
    // Calculate final score
    let score = 0;
    questions.forEach((q, index) => {
      if (userAnswers[index] === q.correctAnswer) score++;
    });

    // Time used
    const timeUsed = (selectedChapterId === 'overall' ? 3600 : questions.length * 90) - timeRemaining;

    // Submit to API
    api.submitScore({
      name: userName,
      score,
      totalQuestions: questions.length,
      timeUsed,
      percentage: Math.round((score / questions.length) * 100),
      chapterId: selectedChapterId || 'overall'
    }).catch(err => console.error("Score submission failed:", err));

    setQuizSubmitted(true);
    setGameState('results');
  };

  const calculateScore = () => {
    let score = 0;
    questions.forEach((q, index) => {
      if (userAnswers[index] === q.correctAnswer) score++;
    });
    return score;
  };

  const handleRestart = () => {
    const score = calculateScore();
    const percentage = (score / questions.length) * 100;

    if (percentage >= 70 && selectedChapterId && !completedChapters.includes(selectedChapterId)) {
      setCompletedChapters(prev => [...prev, selectedChapterId]);
    }

    setGameState('chapters');
    setSelectedChapterId(null);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')} `;
  };

  const answeredQuestions = new Set(Object.keys(userAnswers).map(Number));

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-orange-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 text-slate-900 dark:text-white flex flex-col items-center justify-center p-4 relative overflow-hidden transition-colors duration-300">
      <button
        onClick={() => setDarkMode(!darkMode)}
        className="fixed top-4 right-4 z-50 p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full shadow-lg hover:scale-110 transition-all"
        aria-label="Toggle dark mode"
      >
        {darkMode ? <Sun className="w-5 h-5 text-yellow-500" /> : <Moon className="w-5 h-5 text-slate-700" />}
      </button>

      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <motion.div
          className="absolute top-20 left-10 w-32 h-32 bg-brand-400/10 rounded-full blur-2xl"
          animate={{ y: [0, -30, 0], x: [0, 20, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzAwMDAwMCIgc3Ryb2tlLW9wYWNpdHk9IjAuMDMiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-40" />
      </div>

      <div className="z-10 w-full max-w-7xl mx-auto flex flex-col items-center">
        <AnimatePresence mode="wait">
          {gameState === 'start' && (
            <motion.div
              key="start"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, y: -20 }}
              className="text-center w-full max-w-md"
            >
              <div className="mb-6 inline-flex items-center justify-center w-20 h-20 bg-white dark:bg-slate-800 rounded-3xl shadow-xl shadow-brand-900/10 mb-8 border border-slate-200 dark:border-slate-700">
                <BookOpen className="w-10 h-10 text-brand-600 dark:text-brand-400" />
              </div>
              {userName ? (
                <>
                  <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-accent-600 dark:from-brand-400 dark:to-accent-400 mb-4 animate-float">
                    InsightLoop
                  </h1>
                  <div className="flex items-center justify-center gap-2 group cursor-pointer" onClick={() => setUserName("")} title="Click to edit name">
                    <p className="text-lg text-slate-600 dark:text-slate-300">
                      Welcome back, <span className="font-bold text-slate-900 dark:text-white">{userName}</span>
                    </p>
                    <div className="p-1 rounded-full bg-slate-100 dark:bg-slate-700 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Edit2 size={14} className="text-slate-500" />
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <h1 className="text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-accent-600 mb-6 tracking-tight">
                    Ad Tech Quiz
                  </h1>
                  <p className="text-xl text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">
                    Test your knowledge of the ad ecosystem.
                  </p>
                </>
              )}

              <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xl">
                <label className="block text-left text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Enter your name to start</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    placeholder="e.g. AdOps Master"
                    onKeyDown={(e) => e.key === 'Enter' && handleNameSubmit()}
                    className="flex-1 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-xl px-4 py-3 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
                  />
                  <button
                    onClick={handleNameSubmit}
                    disabled={!nameInput.trim()}
                    className="px-4 py-3 bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-700 hover:to-brand-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl transition-all shadow-lg shadow-brand-500/30 flex items-center justify-center hover:scale-105 active:scale-95"
                  >
                    <Send size={20} />
                  </button>
                  {/* Leaderboard Button */}
                  <button
                    onClick={() => {
                      setShowLeaderboard(true);
                    }}
                    className="px-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-yellow-500 rounded-xl transition-all shadow-lg hover:scale-105 active:scale-95 flex items-center justify-center group"
                  >
                    <Trophy size={20} className="group-hover:scale-110 transition-transform animate-bounce text-yellow-500" />
                  </button>
                </div>

                {/* Insight Mode Button */}
                <div className="mt-8 pt-8 border-t border-slate-200 dark:border-slate-700">
                  <p className="text-sm font-semibold text-slate-500 mb-3 uppercase tracking-wider">New Mode</p>
                  <button
                    onClick={() => setGameState('insight')}
                    className="w-full px-6 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-2xl shadow-xl shadow-indigo-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-between group"
                  >
                    <div className="text-left">
                      <span className="block text-lg">Enter InsightLoop 🧠</span>
                      <span className="text-white/80 text-sm font-normal">Reasoning-centric adaptive training</span>
                    </div>
                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center group-hover:bg-white/30 transition-colors">
                      <BookOpen size={20} />
                    </div>
                  </button>
                </div>

              </div>
            </motion.div>
          )}

          {gameState === 'chapters' && (
            <ChapterSelection
              completedChapters={completedChapters}
              onSelectChapter={startChapter}
              onBack={() => setGameState('start')}
            />
          )}

          {gameState === 'insight' && (
            <InsightEngine
              data={insightData}
              onBack={() => setGameState('start')}
              onComplete={(stats) => {
                console.log(stats);
                setGameState('start'); // Simple completion for now
              }}
            />
          )}

          {gameState === 'playing' && (
            <div className="w-full flex gap-6">
              <div className="flex-1">
                <div className="mb-6 flex justify-between items-center bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-lg">
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                      Progress: <span className="text-brand-600 font-bold">{answeredQuestions.size}/{questions.length}</span>
                    </span>
                  </div>
                  <div className={`text - lg font - bold ${timeRemaining < 60 ? 'text-red-600 dark:text-red-400 animate-pulse' : 'text-slate-900 dark:text-white'} `}>
                    ⏱️ {formatTime(timeRemaining)}
                  </div>
                </div>

                <QuizCard
                  question={questions[currentQuestionIndex]}
                  questionIndex={currentQuestionIndex}
                  selectedOption={userAnswers[currentQuestionIndex] || null}
                  onSelectOption={handleSelectOption}
                  onPrevious={handlePrevious}
                  onNext={handleNext}
                  onSubmit={handleRequestReview}
                  isFirstQuestion={currentQuestionIndex === 0}
                  isLastQuestion={currentQuestionIndex === questions.length - 1}
                  questionNumber={currentQuestionIndex + 1}
                  totalQuestions={questions.length}
                  streak={streak}
                />
              </div>

              <div className="hidden lg:block w-64 flex-shrink-0">
                <div className="sticky top-4">
                  <QuestionNavigator
                    totalQuestions={questions.length}
                    currentQuestion={currentQuestionIndex}
                    answeredQuestions={answeredQuestions}
                    onNavigate={handleNavigateToQuestion}
                  />
                  <div className="mt-4 p-3 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-lg border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-400">
                    <p className="font-semibold mb-1">💡 Keyboard Shortcuts:</p>
                    <p>← → Navigate</p>
                    <p>1-4 Select option</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {gameState === 'review' && (
            <ReviewBeforeSubmit
              questions={questions}
              userAnswers={userAnswers}
              onEditQuestion={handleEditFromReview}
              onConfirmSubmit={handleSubmitQuiz}
              onCancel={() => setGameState('playing')}
            />
          )}

          {gameState === 'results' && (
            <ResultScreen
              score={calculateScore()}
              totalQuestions={questions.length}
              onRestart={handleRestart}
              userName={userName}
              questions={questions}
              userAnswers={userAnswers}
              onShowLeaderboard={() => {
                setShowLeaderboard(true);
              }}
            />
          )}
        </AnimatePresence>

        <Leaderboard
          isOpen={showLeaderboard}
          onClose={() => setShowLeaderboard(false)}
        />
      </div>

      <div className="absolute bottom-6 text-slate-500 text-sm z-10">
        Based on "The AdTech Book"
      </div>
    </div>
  );
}

export default App;

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Edit2, Sun, Moon, Send, Brain } from 'lucide-react';
import { QuizCard } from './components/QuizCard';
import { ResultScreen } from './components/ResultScreen';
import { QuestionNavigator } from './components/QuestionNavigator';
import { ReviewBeforeSubmit } from './components/ReviewBeforeSubmit';
import { ChapterSelection } from './components/ChapterSelection';
import { InsightEngine } from './components/InsightEngine';
import { StatsDashboard } from './components/StatsDashboard';
import { MouseParallax } from './components/MouseParallax'; // Added import
import { api } from './services/api';
import { storage } from './services/storage';
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
  const [gameState, setGameState] = useState<'start' | 'chapters' | 'playing' | 'results' | 'review' | 'insight' | 'stats'>('start');
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
  const [userRank, setUserRank] = useState<number | null>(null);

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

    // Submit to API and get rank
    api.submitScore({
      name: userName,
      score,
      totalQuestions: questions.length,
      timeUsed,
      percentage: Math.round((score / questions.length) * 100),
      chapterId: selectedChapterId || 'overall'
    })
      .then(response => {
        if (response && response.rank) {
          setUserRank(response.rank);
        }
      })
      .catch(err => console.error("Score submission failed:", err));

    setQuizSubmitted(true);
    setGameState('results');

    // Save to local storage for Pro Stats
    storage.saveResult({
      chapterId: selectedChapterId || 'overall',
      score: score,
      totalQuestions: questions.length,
      timeSpent: 600 - timeRemaining,
      percentage: Math.round((score / questions.length) * 100)
    });
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
    <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-4 relative overflow-hidden font-sans selection:bg-brand-500 selection:text-white">
      <button
        onClick={() => setDarkMode(!darkMode)}
        className="fixed top-6 right-6 z-50 p-3 bg-white/10 backdrop-blur-md border border-white/10 rounded-full shadow-lg hover:scale-110 active:scale-95 transition-all group"
        aria-label="Toggle dark mode"
      >
        {darkMode ? (
          <Sun className="w-5 h-5 text-amber-400 group-hover:rotate-90 transition-transform" />
        ) : (
          <Moon className="w-5 h-5 text-brand-200 group-hover:-rotate-12 transition-transform" />
        )}
      </button>

      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <MouseParallax />
        <div className="absolute top-20 left-10 w-32 h-32 bg-brand-400/10 rounded-full blur-2xl animate-pulse" /> {/* Kept as static fallback/extra layer */}
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
              className="text-center w-full max-w-lg relative z-10"
            >
              <div className="mb-8 inline-flex items-center justify-center w-28 h-28 bg-gradient-to-br from-brand-500/20 to-accent-500/20 backdrop-blur-2xl rounded-[2rem] border border-white/20 shadow-2xl shadow-brand-500/20 animate-float group relative cursor-pointer overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-brand-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <BookOpen className="w-12 h-12 text-brand-400 drop-shadow-lg group-hover:scale-110 transition-transform duration-300" />
                <div className="absolute -inset-1 rounded-[2rem] bg-gradient-to-r from-transparent via-white/20 to-transparent blur-md translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
              </div>

              {userName ? (
                <div className="mb-10">
                  <h1 className="text-5xl md:text-6xl font-display font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-brand-300 via-brand-100 to-accent-200 mb-2 animate-float drop-shadow-xl">
                    InsightLoop
                  </h1>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="inline-flex items-center justify-center gap-3 bg-white/5 backdrop-blur-md px-5 py-2 rounded-full border border-white/10 shadow-lg cursor-pointer group hover:bg-white/10 transition-all"
                    onClick={() => setUserName("")}
                    title="Click to edit name"
                  >
                    <p className="text-lg text-slate-300 font-light">
                      Welcome back, <span className="font-semibold text-white group-hover:text-brand-300 transition-colors">{userName}</span>
                    </p>
                    <div className="p-1.5 rounded-full bg-white/10 group-hover:bg-white/20 transition-colors">
                      <Edit2 size={12} className="text-slate-400 group-hover:text-white" />
                    </div>
                  </motion.div>
                </div>
              ) : (
                <div className="mb-12">
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-300 text-sm font-medium mb-6 animate-pulse-glow">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-500"></span>
                    </span>
                    <span>Knowledge Assessment Protocol</span>
                  </div>
                  <h1 className="text-6xl md:text-8xl font-display font-extrabold text-transparent bg-clip-text bg-gradient-to-b from-white via-brand-100 to-brand-900/50 mb-6 tracking-tight drop-shadow-2xl">
                    Ad Tech
                    <span className="block text-4xl md:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-brand-400 to-accent-400 font-bold mt-1">
                      Certification Quiz
                    </span>
                  </h1>
                  <p className="text-lg md:text-xl text-slate-400/90 leading-relaxed font-light max-w-sm mx-auto">
                    Master the ecosystem. Test your skills. <br />
                    <span className="text-slate-300 font-medium">Verify your expertise.</span>
                  </p>
                </div>
              )}

              <div className="bg-slate-900/60 backdrop-blur-xl p-8 rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden group hover:border-white/20 transition-colors duration-500">
                <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />

                <label className="block text-left text-sm font-semibold text-slate-300 mb-3 ml-1 uppercase tracking-wider">
                  Identify Yourself
                </label>

                <div className="flex gap-3 relative z-10">
                  <div className="relative flex-1 group/input">
                    <input
                      type="text"
                      value={nameInput}
                      onChange={(e) => setNameInput(e.target.value)}
                      placeholder="e.g. Programmatic Pro"
                      onKeyDown={(e) => e.key === 'Enter' && handleNameSubmit()}
                      className="w-full bg-slate-900/50 border border-slate-700/50 rounded-2xl px-5 py-4 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500/50 transition-all font-medium group-hover/input:bg-slate-900/80"
                    />
                  </div>

                  <button
                    onClick={handleNameSubmit}
                    disabled={!nameInput.trim()}
                    className="px-6 bg-gradient-to-br from-brand-500 to-brand-600 hover:from-brand-400 hover:to-brand-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-2xl transition-all shadow-lg shadow-brand-500/20 flex items-center justify-center hover:scale-105 active:scale-95 border border-white/10"
                    title="Start Quiz"
                  >
                    <Send size={24} className={nameInput.trim() ? "fill-current" : ""} />
                  </button>

                  <button
                    onClick={() => {
                      setGameState('insight');
                    }}
                    className="px-5 bg-slate-800/80 hover:bg-slate-800 border border-slate-700 hover:border-brand-500/50 text-brand-400 rounded-2xl transition-all shadow-lg hover:scale-105 active:scale-95 flex items-center justify-center group/brain"
                    title="Mastermind Mode (Unique Feature)"
                  >
                    <BookOpen size={24} className="group-hover/brain:scale-110 transition-transform drop-shadow-md" />
                  </button>
                </div>

                {/* Insight Mode Button (Promoted) */}
                <div className="mt-8 pt-8 border-t border-white/5 relative">
                  <div className="absolute left-1/2 -top-3 -translate-x-1/2 bg-slate-900 px-3 text-xs font-bold text-slate-500 uppercase tracking-widest">
                    Unique Mode
                  </div>

                  <button
                    onClick={() => setGameState('insight')}
                    className="w-full group relative overflow-hidden rounded-2xl p-0.5 transition-all hover:scale-[1.01] active:scale-[0.99]"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-brand-600 via-accent-500 to-brand-600 opacity-70 group-hover:opacity-100 transition-opacity blur-sm" />
                    <div className="relative flex items-center justify-between bg-slate-900/90 backdrop-blur-xl rounded-[14px] px-5 py-4 h-full">
                      <div className="flex flex-col text-left">
                        <span className="text-lg font-display font-bold text-white group-hover:text-brand-200 transition-colors flex items-center gap-2">
                          Mastermind Mode <span className="text-xs bg-brand-500/20 text-brand-300 px-1.5 py-0.5 rounded border border-brand-500/30">FLAGSHIP</span>
                        </span>
                        <span className="text-slate-400 text-xs font-normal group-hover:text-slate-300">Advanced reasoning & scenario analysis</span>
                      </div>
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500/10 to-accent-500/10 border border-white/5 flex items-center justify-center text-brand-400 group-hover:text-white group-hover:bg-brand-500 transition-all shadow-inner">
                        <Brain size={20} />
                      </div>
                    </div>
                  </button>

                  {/* Pro Stats Button */}
                  <button
                    onClick={() => setGameState('stats')}
                    className="w-full mt-3 group relative overflow-hidden rounded-2xl p-0.5 transition-all hover:scale-[1.01] active:scale-[0.99]"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-slate-700 via-slate-600 to-slate-700 opacity-50 group-hover:opacity-80 transition-opacity blur-sm" />
                    <div className="relative flex items-center justify-between bg-slate-900/90 backdrop-blur-xl rounded-[14px] px-5 py-4 h-full border border-white/5">
                      <div className="flex flex-col text-left">
                        <span className="text-lg font-display font-bold text-white group-hover:text-slate-200 transition-colors">
                          Pro Analytics Dashboard
                        </span>
                        <span className="text-slate-400 text-xs font-normal group-hover:text-slate-300">Visual performance breakdown</span>
                      </div>
                      <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-slate-400 group-hover:text-white transition-all">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18" /><path d="M18 17V9" /><path d="M13 17V5" /><path d="M8 17v-3" /></svg>
                      </div>
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

          {gameState === 'stats' && (
            <StatsDashboard
              onBack={() => setGameState('start')}
              mode="full"
            />
          )}

          {gameState === 'playing' && (
            <div className="w-full flex gap-6">
              <div className="flex-1">
                <div className="mb-6 flex justify-between items-center bg-slate-900/60 backdrop-blur-xl p-4 rounded-2xl border border-white/10 shadow-lg relative overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-r from-brand-500/5 to-accent-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="flex items-center gap-4 relative z-10">
                    <span className="text-sm font-medium text-slate-400 font-display uppercase tracking-wider">
                      Progress <span className="text-white ml-2 bg-white/10 px-2 py-0.5 rounded-lg">{answeredQuestions.size} / {questions.length}</span>
                    </span>
                  </div>
                  <div className={`text-xl font-bold font-mono tracking-wider relative z-10 ${timeRemaining < 60 ? 'text-red-400 animate-pulse drop-shadow-[0_0_10px_rgba(248,113,113,0.5)]' : 'text-white'} `}>
                    {formatTime(timeRemaining)}
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
              userRank={userRank}
            />
          )}
        </AnimatePresence>
      </div>


    </div>
  );
}

export default App;

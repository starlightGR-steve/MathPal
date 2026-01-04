import React, { useState, useEffect, useCallback } from 'react';
import {
  Plus, Minus, X, Divide, Grid3x3, Square, Volume2,
  VolumeX, RotateCcw, ChevronRight, Eye, EyeOff
} from 'lucide-react';

// Custom hook for text-to-speech
const useSpeech = () => {
  const [isSpeaking, setIsSpeaking] = useState(false);

  const speak = useCallback((text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1.1;
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    }
  }, []);

  const stop = useCallback(() => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }, []);

  return { speak, stop, isSpeaking };
};

// Generate fact deck based on mode
const generateDeck = (mode) => {
  const facts = [];

  switch(mode) {
    case 'addition':
      // Addition facts 1-10
      for (let a = 1; a <= 10; a++) {
        for (let b = 1; b <= 10; b++) {
          facts.push({
            question: `${a} + ${b}`,
            answer: a + b,
            operands: [a, b],
            operation: 'add',
            visualType: 'add'
          });
        }
      }
      break;

    case 'addSub':
      // Addition facts
      for (let a = 1; a <= 10; a++) {
        for (let b = 1; b <= 10; b++) {
          facts.push({
            question: `${a} + ${b}`,
            answer: a + b,
            operands: [a, b],
            operation: 'add',
            visualType: 'add'
          });
        }
      }
      // Subtraction facts (reverse of addition)
      for (let sum = 2; sum <= 20; sum++) {
        for (let sub = 1; sub < sum && sub <= 10; sub++) {
          const result = sum - sub;
          if (result >= 1 && result <= 10) {
            facts.push({
              question: `${sum} - ${sub}`,
              answer: result,
              operands: [sum, sub],
              operation: 'subtract',
              visualType: 'subtract'
            });
          }
        }
      }
      break;

    case 'multiplication':
      // Multiplication facts 1-10
      for (let a = 1; a <= 10; a++) {
        for (let b = 1; b <= 10; b++) {
          facts.push({
            question: `${a} × ${b}`,
            answer: a * b,
            operands: [a, b],
            operation: 'multiply',
            visualType: 'multiply'
          });
        }
      }
      break;

    case 'multDiv':
      // Multiplication facts
      for (let a = 1; a <= 10; a++) {
        for (let b = 1; b <= 10; b++) {
          facts.push({
            question: `${a} × ${b}`,
            answer: a * b,
            operands: [a, b],
            operation: 'multiply',
            visualType: 'multiply'
          });
        }
      }
      // Division facts (reverse of multiplication)
      for (let a = 1; a <= 10; a++) {
        for (let b = 1; b <= 10; b++) {
          const dividend = a * b;
          facts.push({
            question: `${dividend} ÷ ${b}`,
            answer: a,
            operands: [dividend, b],
            operation: 'divide',
            visualType: 'divide'
          });
        }
      }
      break;
  }

  return facts;
};

// Visual representation component
const VisualRepresentation = ({ fact, isVisible }) => {
  if (!isVisible) return null;

  const { visualType, operands, answer } = fact;

  // Calculate apple size based on total count
  const getAppleSize = (totalCount) => {
    if (totalCount <= 10) return 'w-12 h-12';
    if (totalCount <= 20) return 'w-10 h-10';
    if (totalCount <= 40) return 'w-8 h-8';
    if (totalCount <= 60) return 'w-6 h-6';
    return 'w-5 h-5';
  };

  const Apple = ({ className = '', crossed = false }) => (
    <div className={`relative ${className}`}>
      <div className={`w-full h-full rounded-full ${crossed ? 'bg-red-300' : 'bg-red-500'}
        flex items-center justify-center text-white font-bold relative`}>
        {crossed && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-full h-0.5 bg-gray-800 rotate-45 absolute"></div>
            <div className="w-full h-0.5 bg-gray-800 -rotate-45 absolute"></div>
          </div>
        )}
      </div>
      <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-green-600 rounded-sm"></div>
    </div>
  );

  const Basket = ({ children, label }) => (
    <div className="flex flex-col items-center gap-2">
      <div className="relative">
        <div className="border-4 border-amber-700 rounded-lg p-3 bg-amber-100 min-w-[80px]
          min-h-[80px] flex flex-wrap gap-1 items-center justify-center">
          {children}
        </div>
      </div>
      {label && <div className="text-2xl font-bold text-gray-700">{label}</div>}
    </div>
  );

  const renderVisualization = () => {
    switch(visualType) {
      case 'add': {
        const [a, b] = operands;
        const appleSize = getAppleSize(a + b);

        return (
          <div className="flex flex-wrap gap-8 items-center justify-center">
            <Basket label={a}>
              {Array.from({ length: a }).map((_, i) => (
                <Apple key={i} className={appleSize} />
              ))}
            </Basket>
            <div className="text-6xl font-bold text-blue-600">+</div>
            <Basket label={b}>
              {Array.from({ length: b }).map((_, i) => (
                <Apple key={i} className={appleSize} />
              ))}
            </Basket>
            <div className="text-6xl font-bold text-gray-600">=</div>
            <Basket label={answer}>
              {Array.from({ length: answer }).map((_, i) => (
                <Apple key={i} className={appleSize} />
              ))}
            </Basket>
          </div>
        );
      }

      case 'subtract': {
        const [total, sub] = operands;
        const appleSize = getAppleSize(total);

        return (
          <div className="flex flex-wrap gap-8 items-center justify-center">
            <Basket label={total}>
              {Array.from({ length: total }).map((_, i) => (
                <Apple key={i} className={appleSize} crossed={i < sub} />
              ))}
            </Basket>
            <div className="text-6xl font-bold text-indigo-600">−</div>
            <Basket label={sub}>
              {Array.from({ length: sub }).map((_, i) => (
                <Apple key={i} className={appleSize} crossed />
              ))}
            </Basket>
            <div className="text-6xl font-bold text-gray-600">=</div>
            <Basket label={answer}>
              {Array.from({ length: answer }).map((_, i) => (
                <Apple key={i} className={appleSize} />
              ))}
            </Basket>
          </div>
        );
      }

      case 'multiply': {
        const [groups, perGroup] = operands;
        const appleSize = getAppleSize(groups * perGroup);

        return (
          <div className="flex flex-col gap-6 items-center">
            <div className="flex flex-wrap gap-4 items-center justify-center">
              {Array.from({ length: groups }).map((_, i) => (
                <Basket key={i} label={perGroup}>
                  {Array.from({ length: perGroup }).map((_, j) => (
                    <Apple key={j} className={appleSize} />
                  ))}
                </Basket>
              ))}
            </div>
            <div className="text-4xl font-bold text-emerald-600">
              {groups} groups of {perGroup} = {answer}
            </div>
          </div>
        );
      }

      case 'divide': {
        const [total, divisor] = operands;
        const groupSize = answer;
        const appleSize = getAppleSize(total);

        return (
          <div className="flex flex-col gap-6 items-center">
            <div className="flex flex-wrap gap-4 items-center justify-center">
              {Array.from({ length: groupSize }).map((_, i) => (
                <Basket key={i} label={divisor}>
                  {Array.from({ length: divisor }).map((_, j) => (
                    <Apple key={j} className={appleSize} />
                  ))}
                </Basket>
              ))}
            </div>
            <div className="text-4xl font-bold text-teal-600">
              {total} divided into groups of {divisor} = {groupSize} groups
            </div>
          </div>
        );
      }

      default:
        return null;
    }
  };

  return (
    <div className="w-full py-8 px-4 bg-gradient-to-b from-blue-50 to-white rounded-xl
      border-2 border-blue-200 overflow-auto">
      {renderVisualization()}
    </div>
  );
};

// Main App Component
const FlashcardApp = () => {
  const [mode, setMode] = useState('addition');
  const [viewMode, setViewMode] = useState('card'); // 'card' or 'grid'
  const [deck, setDeck] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [showVisual, setShowVisual] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const { speak, stop } = useSpeech();

  // Generate deck when mode changes
  useEffect(() => {
    const newDeck = generateDeck(mode);
    setDeck(newDeck);
    setCurrentIndex(0);
    setIsFlipped(false);
    setShowVisual(false);
  }, [mode]);

  // Helper function to convert question to speech-friendly text
  const getSpokenQuestion = (fact) => {
    const [a, b] = fact.operands;
    switch(fact.operation) {
      case 'add':
        return `${a} plus ${b}`;
      case 'subtract':
        return `${a} minus ${b}`;
      case 'multiply':
        return `${a} times ${b}`;
      case 'divide':
        return `${a} divided by ${b}`;
      default:
        return fact.question;
    }
  };

  // Auto-play audio when card changes or flips
  useEffect(() => {
    if (audioEnabled && deck.length > 0) {
      const currentFact = deck[currentIndex];
      if (currentFact) {
        if (isFlipped) {
          speak(`The answer is ${currentFact.answer}`);
        } else {
          speak(`What is ${getSpokenQuestion(currentFact)}?`);
        }
      }
    }
  }, [currentIndex, isFlipped, audioEnabled, deck, speak]);

  const handleCardClick = () => {
    setIsFlipped(!isFlipped);
  };

  const handleNext = () => {
    if (currentIndex < deck.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setIsFlipped(false);
      setShowVisual(false);
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setIsFlipped(false);
    setShowVisual(false);
  };

  const handleGridSelect = (index) => {
    setCurrentIndex(index);
    setViewMode('card');
    setIsFlipped(false);
    setShowVisual(false);
  };

  const toggleVisual = () => {
    setShowVisual(!showVisual);
    if (!showVisual && audioEnabled && deck[currentIndex]) {
      const fact = deck[currentIndex];
      speak(`${getSpokenQuestion(fact)} equals ${fact.answer}`);
    }
  };

  const currentFact = deck[currentIndex];
  const progress = deck.length > 0 ? ((currentIndex + 1) / deck.length) * 100 : 0;

  const modes = [
    {
      id: 'addition',
      name: 'Addition',
      icon: Plus,
      activeClass: 'bg-emerald-600 text-white shadow-lg',
      inactiveClass: 'bg-gray-100 text-gray-700 hover:bg-emerald-50',
      progressClass: 'bg-emerald-600',
      borderClass: 'border-emerald-300',
      nextButtonClass: 'bg-emerald-600 text-white hover:bg-emerald-700',
      gridActiveClass: 'bg-emerald-600 text-white border-emerald-700 shadow-lg',
      gridInactiveClass: 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-emerald-50'
    },
    {
      id: 'addSub',
      name: 'Add/Sub Mix',
      icon: Minus,
      activeClass: 'bg-emerald-600 text-white shadow-lg',
      inactiveClass: 'bg-gray-100 text-gray-700 hover:bg-emerald-50',
      progressClass: 'bg-emerald-600',
      borderClass: 'border-emerald-300',
      nextButtonClass: 'bg-emerald-600 text-white hover:bg-emerald-700',
      gridActiveClass: 'bg-emerald-600 text-white border-emerald-700 shadow-lg',
      gridInactiveClass: 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-emerald-50'
    },
    {
      id: 'multiplication',
      name: 'Multiplication',
      icon: X,
      activeClass: 'bg-emerald-600 text-white shadow-lg',
      inactiveClass: 'bg-gray-100 text-gray-700 hover:bg-emerald-50',
      progressClass: 'bg-emerald-600',
      borderClass: 'border-emerald-300',
      nextButtonClass: 'bg-emerald-600 text-white hover:bg-emerald-700',
      gridActiveClass: 'bg-emerald-600 text-white border-emerald-700 shadow-lg',
      gridInactiveClass: 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-emerald-50'
    },
    {
      id: 'multDiv',
      name: 'Mult/Div Mix',
      icon: Divide,
      activeClass: 'bg-emerald-600 text-white shadow-lg',
      inactiveClass: 'bg-gray-100 text-gray-700 hover:bg-emerald-50',
      progressClass: 'bg-emerald-600',
      borderClass: 'border-emerald-300',
      nextButtonClass: 'bg-emerald-600 text-white hover:bg-emerald-700',
      gridActiveClass: 'bg-emerald-600 text-white border-emerald-700 shadow-lg',
      gridInactiveClass: 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-emerald-50'
    }
  ];

  const currentModeConfig = modes.find(m => m.id === mode);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      {/* Top Navigation Bar */}
      <nav className="bg-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            {/* Mode Selection */}
            <div className="flex flex-wrap gap-2">
              {modes.map((m) => {
                const Icon = m.icon;
                return (
                  <button
                    key={m.id}
                    onClick={() => setMode(m.id)}
                    className={`flex items-center gap-2 px-4 py-3 rounded-lg font-semibold
                      transition-all transform hover:scale-105 ${
                      mode === m.id ? m.activeClass : m.inactiveClass
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="hidden sm:inline">{m.name}</span>
                  </button>
                );
              })}
            </div>

            {/* Control Buttons */}
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode(viewMode === 'card' ? 'grid' : 'card')}
                className="p-3 bg-purple-100 hover:bg-purple-200 rounded-lg transition-colors"
                title={viewMode === 'card' ? 'Grid View' : 'Card View'}
              >
                {viewMode === 'card' ? <Grid3x3 className="w-6 h-6" /> : <Square className="w-6 h-6" />}
              </button>

              <button
                onClick={() => setAudioEnabled(!audioEnabled)}
                className={`p-3 rounded-lg transition-colors ${
                  audioEnabled ? 'bg-green-100 hover:bg-green-200' : 'bg-gray-100 hover:bg-gray-200'
                }`}
                title={audioEnabled ? 'Disable Audio' : 'Enable Audio'}
              >
                {audioEnabled ? <Volume2 className="w-6 h-6" /> : <VolumeX className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {viewMode === 'card' ? (
          <div className="space-y-6">
            {/* Progress Bar */}
            <div className="bg-white rounded-lg p-4 shadow-md">
              <div className="flex justify-between items-center mb-2">
                <span className="text-lg font-semibold text-gray-700">
                  Card {currentIndex + 1} of {deck.length}
                </span>
                <span className="text-sm text-gray-500">{Math.round(progress)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className={`h-3 rounded-full transition-all duration-300 ${currentModeConfig?.progressClass}`}
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>

            {/* Flashcard */}
            {currentFact && (
              <div className="space-y-6">
                <div
                  onClick={handleCardClick}
                  className={`bg-white rounded-2xl shadow-2xl p-12 min-h-[400px] flex items-center
                    justify-center cursor-pointer transform transition-all duration-300
                    hover:scale-105 active:scale-95 border-4 ${currentModeConfig?.borderClass}`}
                >
                  <div className="text-center">
                    <div className="text-8xl font-bold mb-6"
                      style={{ color: `var(--${currentModeConfig?.color}-600)` }}>
                      {isFlipped ? currentFact.answer : currentFact.question}
                    </div>
                    <div className="text-2xl text-gray-500">
                      {isFlipped ? 'Tap to see question' : 'Tap to reveal answer'}
                    </div>
                  </div>
                </div>

                {/* Visual Toggle Button */}
                <div className="flex justify-center">
                  <button
                    onClick={toggleVisual}
                    className={`flex items-center gap-2 px-6 py-4 rounded-lg font-semibold
                      text-lg transition-all transform hover:scale-105 ${
                      showVisual
                        ? 'bg-orange-500 text-white shadow-lg'
                        : 'bg-orange-100 text-orange-700 hover:bg-orange-200'
                    }`}
                  >
                    {showVisual ? <EyeOff className="w-6 h-6" /> : <Eye className="w-6 h-6" />}
                    {showVisual ? 'Hide Pictures' : 'Show Pictures'}
                  </button>
                </div>

                {/* Visual Representation */}
                <VisualRepresentation fact={currentFact} isVisible={showVisual} />

                {/* Navigation Buttons */}
                <div className="flex gap-4 justify-center">
                  <button
                    onClick={handleRestart}
                    className="flex items-center gap-2 px-8 py-4 bg-gray-600 text-white
                      rounded-lg font-semibold text-lg hover:bg-gray-700 transition-colors
                      transform hover:scale-105"
                  >
                    <RotateCcw className="w-6 h-6" />
                    Restart
                  </button>

                  <button
                    onClick={handleNext}
                    disabled={currentIndex >= deck.length - 1}
                    className={`flex items-center gap-2 px-8 py-4 rounded-lg font-semibold
                      text-lg transition-colors transform hover:scale-105 ${
                      currentIndex >= deck.length - 1
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : currentModeConfig?.nextButtonClass
                    }`}
                  >
                    Next
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Grid View */
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-3xl font-bold mb-6 text-gray-800">
              Select a Math Fact ({deck.length} total)
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {deck.map((fact, index) => (
                <button
                  key={index}
                  onClick={() => handleGridSelect(index)}
                  className={`p-6 rounded-lg font-bold text-2xl transition-all transform
                    hover:scale-110 hover:shadow-xl border-2 ${
                    index === currentIndex
                      ? currentModeConfig?.gridActiveClass
                      : currentModeConfig?.gridInactiveClass
                  }`}
                >
                  {fact.question}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FlashcardApp;

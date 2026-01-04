import React, { useState, useEffect, useCallback } from 'react';

// Custom hook for text-to-speech
const useSpeech = () => {
  const [isSpeaking, setIsSpeaking] = useState(false);

  const speak = useCallback((text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);

      // Wait for voices to load and select a more natural voice
      const voices = window.speechSynthesis.getVoices();

      // Try to find a high-quality English voice
      const preferredVoice = voices.find(voice =>
        voice.lang.startsWith('en') &&
        (voice.name.includes('Google') ||
         voice.name.includes('Microsoft') ||
         voice.name.includes('Samantha') ||
         voice.name.includes('Natural') ||
         voice.name.includes('Premium'))
      ) || voices.find(voice => voice.lang.startsWith('en'));

      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }

      utterance.rate = 0.85; // Slightly slower for clarity
      utterance.pitch = 1.0; // Natural pitch
      utterance.volume = 1.0;
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
            visual: { type: 'add', v1: a, v2: b }
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
            visual: { type: 'add', v1: a, v2: b }
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
              visual: { type: 'subtract', v1: sum, v2: sub }
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
            visual: { type: 'multiply', v1: a, v2: b }
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
            visual: { type: 'multiply', v1: a, v2: b }
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
            visual: { type: 'divide', v1: dividend, v2: b }
          });
        }
      }
      break;
  }

  return facts;
};

// Visual representation component - matching original design with emoji apples
const Visualizer = ({ visual }) => {
  if (!visual) return null;

  const { type, v1, v2 } = visual;

  // Calculate apple size classes based on total count
  const getAppleSizeClass = (totalCount) => {
    if (totalCount <= 10) return 'text-5xl';
    if (totalCount <= 20) return 'text-4xl';
    if (totalCount <= 40) return 'text-3xl';
    if (totalCount <= 60) return 'text-2xl';
    return 'text-xl';
  };

  const getContainerSizeClass = (totalCount) => {
    if (totalCount <= 10) return 'gap-3';
    if (totalCount <= 20) return 'gap-2';
    return 'gap-1';
  };

  const renderApples = (count, crossed = false) => {
    const sizeClass = getAppleSizeClass(count);
    return Array.from({ length: count }).map((_, i) => (
      <span key={i} className={`${sizeClass} ${crossed ? 'opacity-40 line-through' : ''}`}>
        🍎
      </span>
    ));
  };

  const renderVisualization = () => {
    switch(type) {
      case 'add': {
        const totalCount = v1 + v2;
        const containerClass = getContainerSizeClass(totalCount);

        return (
          <div className="flex flex-col items-center gap-6">
            <div className="flex flex-wrap items-center justify-center gap-8">
              {/* First group */}
              <div className="flex flex-col items-center gap-2">
                <div className={`flex flex-wrap justify-center ${containerClass} p-4 bg-amber-100 border-4 border-amber-600 rounded-lg min-w-[120px]`}>
                  {renderApples(v1)}
                </div>
                <div className="text-3xl font-bold text-gray-700">{v1}</div>
              </div>

              <div className="text-5xl font-bold text-emerald-600">+</div>

              {/* Second group */}
              <div className="flex flex-col items-center gap-2">
                <div className={`flex flex-wrap justify-center ${containerClass} p-4 bg-amber-100 border-4 border-amber-600 rounded-lg min-w-[120px]`}>
                  {renderApples(v2)}
                </div>
                <div className="text-3xl font-bold text-gray-700">{v2}</div>
              </div>

              <div className="text-5xl font-bold text-gray-600">=</div>

              {/* Result group */}
              <div className="flex flex-col items-center gap-2">
                <div className={`flex flex-wrap justify-center ${containerClass} p-4 bg-amber-100 border-4 border-amber-600 rounded-lg min-w-[120px]`}>
                  {renderApples(totalCount)}
                </div>
                <div className="text-3xl font-bold text-gray-700">{totalCount}</div>
              </div>
            </div>
          </div>
        );
      }

      case 'subtract': {
        const containerClass = getContainerSizeClass(v1);

        return (
          <div className="flex flex-col items-center gap-6">
            <div className="flex flex-wrap items-center justify-center gap-8">
              {/* Start with total */}
              <div className="flex flex-col items-center gap-2">
                <div className={`flex flex-wrap justify-center ${containerClass} p-4 bg-amber-100 border-4 border-amber-600 rounded-lg min-w-[120px]`}>
                  {renderApples(v2).concat(renderApples(v1 - v2, true))}
                </div>
                <div className="text-3xl font-bold text-gray-700">{v1}</div>
              </div>

              <div className="text-5xl font-bold text-emerald-600">−</div>

              {/* Subtract group */}
              <div className="flex flex-col items-center gap-2">
                <div className={`flex flex-wrap justify-center ${containerClass} p-4 bg-amber-100 border-4 border-amber-600 rounded-lg min-w-[120px]`}>
                  {renderApples(v2, true)}
                </div>
                <div className="text-3xl font-bold text-gray-700">{v2}</div>
              </div>

              <div className="text-5xl font-bold text-gray-600">=</div>

              {/* Result */}
              <div className="flex flex-col items-center gap-2">
                <div className={`flex flex-wrap justify-center ${containerClass} p-4 bg-amber-100 border-4 border-amber-600 rounded-lg min-w-[120px]`}>
                  {renderApples(v1 - v2)}
                </div>
                <div className="text-3xl font-bold text-gray-700">{v1 - v2}</div>
              </div>
            </div>
          </div>
        );
      }

      case 'multiply': {
        const totalCount = v1 * v2;
        const containerClass = getContainerSizeClass(v2);

        return (
          <div className="flex flex-wrap justify-center gap-4">
            {Array.from({ length: v1 }).map((_, i) => (
              <div key={i} className="flex flex-col items-center gap-2">
                <div className={`flex flex-wrap justify-center ${containerClass} p-4 bg-amber-100 border-4 border-amber-600 rounded-lg min-w-[100px]`}>
                  {renderApples(v2)}
                </div>
                <div className="text-2xl font-bold text-gray-700">{v2}</div>
              </div>
            ))}
          </div>
        );
      }

      case 'divide': {
        const groupCount = v1 / v2;
        const containerClass = getContainerSizeClass(v2);

        return (
          <div className="flex flex-wrap justify-center gap-4">
            {Array.from({ length: groupCount }).map((_, i) => (
              <div key={i} className="flex flex-col items-center gap-2">
                <div className={`flex flex-wrap justify-center ${containerClass} p-4 bg-amber-100 border-4 border-amber-600 rounded-lg min-w-[100px]`}>
                  {renderApples(v2)}
                </div>
                <div className="text-2xl font-bold text-gray-700">{v2}</div>
              </div>
            ))}
          </div>
        );
      }

      default:
        return null;
    }
  };

  return (
    <div className="w-full py-8 px-4 bg-gradient-to-b from-blue-50 to-white rounded-xl border-2 border-blue-200 overflow-auto">
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
  const [isFlipping, setIsFlipping] = useState(false);
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
    if (showVisual) return; // Don't flip when showing visual
    if (!isFlipped) {
      setIsFlipped(true);
    }
  };

  const handleNext = () => {
    if (currentIndex < deck.length - 1) {
      setIsFlipped(false);
      setShowVisual(false);
      setCurrentIndex(currentIndex + 1);
    } else {
      if (window.confirm("You finished the set! Restart?")) {
        setCurrentIndex(0);
        setIsFlipped(false);
        setShowVisual(false);
      }
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
    setIsFlipping(true);
    setTimeout(() => {
      setShowVisual(!showVisual);
      setIsFlipping(false);
      if (!showVisual && audioEnabled && deck[currentIndex]) {
        const fact = deck[currentIndex];
        speak(`${getSpokenQuestion(fact)} equals ${fact.answer}`);
      }
    }, 300); // Half of animation time
  };

  const currentFact = deck[currentIndex];
  const progress = deck.length > 0 ? ((currentIndex + 1) / deck.length) * 100 : 0;

  const modes = [
    {
      id: 'addition',
      name: 'Addition',
      emoji: '➕',
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
      emoji: '➕➖',
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
      emoji: '✖️',
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
      emoji: '✖️➗',
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
                return (
                  <button
                    key={m.id}
                    onClick={() => setMode(m.id)}
                    className={`flex items-center gap-2 px-4 py-3 rounded-lg font-semibold text-xl
                      transition-all transform hover:scale-105 ${
                      mode === m.id ? m.activeClass : m.inactiveClass
                    }`}
                  >
                    <span className="text-2xl">{m.emoji}</span>
                    <span className="hidden sm:inline">{m.name}</span>
                  </button>
                );
              })}
            </div>

            {/* Control Buttons */}
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode(viewMode === 'card' ? 'grid' : 'card')}
                className="p-3 bg-purple-100 hover:bg-purple-200 rounded-lg transition-colors text-2xl"
                title={viewMode === 'card' ? 'Grid View' : 'Card View'}
              >
                {viewMode === 'card' ? '📊' : '🃏'}
              </button>

              <button
                onClick={() => setAudioEnabled(!audioEnabled)}
                className={`p-3 rounded-lg transition-colors text-2xl ${
                  audioEnabled ? 'bg-green-100 hover:bg-green-200' : 'bg-gray-100 hover:bg-gray-200'
                }`}
                title={audioEnabled ? 'Disable Audio' : 'Enable Audio'}
              >
                {audioEnabled ? '🔊' : '🔇'}
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
                    hover:scale-105 active:scale-95 border-4 ${currentModeConfig?.borderClass}
                    ${isFlipping ? 'flip-animation' : ''}`}
                >
                  {showVisual ? (
                    <Visualizer visual={currentFact.visual} />
                  ) : (
                    <div className="text-center">
                      <div className="text-8xl font-bold mb-6"
                        style={{ color: `var(--${currentModeConfig?.color}-600)` }}>
                        {isFlipped ? currentFact.answer : currentFact.question}
                      </div>
                      <div className="text-2xl text-gray-500">
                        {isFlipped ? 'Tap to see question' : 'Tap to reveal answer'}
                      </div>
                    </div>
                  )}
                </div>

                {/* Action Bar - matching original design */}
                <div className="w-full mt-6 flex justify-between items-center gap-4 px-2">

                  {/* Visualize Toggle */}
                  <button
                    onClick={toggleVisual}
                    className={`flex items-center gap-2 px-4 md:px-6 py-3 rounded-xl font-bold transition-all shadow-md ${
                      showVisual
                        ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                        : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
                    }`}
                  >
                    {showVisual ? (
                      <>
                        <span className="text-2xl">🔢</span>
                        <span className="hidden md:inline">Show Numbers</span>
                      </>
                    ) : (
                      <>
                        <span className="text-2xl">📊</span>
                        <span className="hidden md:inline">Visualize Math</span>
                      </>
                    )}
                  </button>

                  {/* Next Button - only shows after flip or visualize */}
                  <div className="h-14 flex-1 flex justify-end">
                    {(isFlipped || showVisual) ? (
                      <button
                        onClick={handleNext}
                        className="flex items-center gap-2 bg-emerald-600 text-white px-8 py-3 rounded-xl text-lg font-bold shadow-lg hover:bg-emerald-700 hover:scale-105 transition-all"
                      >
                        Next <span className="text-2xl">➡️</span>
                      </button>
                    ) : (
                      <div className="px-8 py-3 text-slate-400 italic">Thinking...</div>
                    )}
                  </div>
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

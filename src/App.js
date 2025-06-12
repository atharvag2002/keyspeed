import React, { useState, useEffect } from 'react';
import TypingBox from './components/TypingBox';
import './App.css';

const App = () => {
  const easyParagraphs = [
  "Raindrops tapped gently on the window as the tea steamed beside her favorite book.",
  "She found an old camera in the attic and wondered about the stories it once captured.",
  "The dog wagged its tail wildly every time the door creaked open.",
  "He planted a seed, not knowing it would someday become the tallest tree in the garden.",
  "On Sunday mornings, the smell of pancakes filled the tiny kitchen with warmth."
];

const hardParagraphs = [
  "Epistemological debates surrounding machine consciousness often hinge not only on observable behavior but also on elusive constructs like qualia and subjective intentionality, making definitive conclusions inherently slippery.",
  "As quantum entanglement challenges classical notions of locality, physicists are increasingly confronted with metaphysical implications that blur the lines between determinism and probabilistic chaos.",
  "In a world where language models mimic human articulation with unnerving accuracy, the boundaries between authentic cognition and algorithmic illusion become perilously ambiguous, prompting urgent philosophical inquiry.",
  "The recursive self-modification of artificial intelligence raises unprecedented ethical concerns about alignment, autonomy, and the irrevocability of synthetic evolution once it surpasses human oversight.",
  "Neuroscience’s reductionist attempts to localize consciousness within cortical substrates ignore the emergent properties of networked brain systems, where the whole is demonstrably more than the sum of its biological parts."
];



  const [currentParaIndex, setCurrentParaIndex] = useState(0);
  const [isHardMode, setIsHardMode] = useState(false);
  const [history, setHistory] = useState([]);

  const currentParagraphs = isHardMode ? hardParagraphs : easyParagraphs;
  const appThemeClass = isHardMode ? 'hard-theme' : 'easy-theme';

  useEffect(() => {
    const saved = localStorage.getItem('typingTestHistory');
    if (saved) {
      setHistory(JSON.parse(saved));
    }
  }, []);

  const handleComplete = (wpm) => {
    const result = {
      paragraphNumber: currentParaIndex + 1,
      difficulty: isHardMode ? 'Hard' : 'Easy',
      date: new Date().toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      }),
      wpm
    };
    const updated = [result, ...history];
    setHistory(updated);
    localStorage.setItem('typingTestHistory', JSON.stringify(updated));
  };

  const nextParagraph = () => {
    setCurrentParaIndex(prev => (prev + 1) % currentParagraphs.length);
  };

  const toggleDifficulty = () => {
    setIsHardMode(!isHardMode);
    setCurrentParaIndex(0);
  };

  return (
    <div className={`outer-bg ${isHardMode ? 'outer-hard' : 'outer-easy'}`}>
      <div className={`app ${appThemeClass}`}>
        <h1>KeySpeed</h1>

        <div className="difficulty-toggle-switch">
          <button 
            className={`switch-btn ${isHardMode ? 'right' : 'left'}`} 
            onClick={toggleDifficulty}
          >
            <span className="option easy">Easy</span>
            <span className="option hard">Hard</span>
            <div className="slider" />
          </button>
        </div>

        <div className="test-container">
          <TypingBox
            targetText={currentParagraphs[currentParaIndex]}
            onComplete={handleComplete}
            isHardMode={isHardMode}
          />
          <div className="controls">
            <button onClick={nextParagraph} className="next-btn">
              Next Paragraph
            </button>
          </div>
        </div>

        <div className="history">
          <h3>Test History:</h3>
          {history.length === 0 ? (
            <p className="placeholder">No history found</p>
          ) : (
            <ul>
              {history.map((test, idx) => (
                <li key={idx} className="history-item">
                  <div className="history-left">
                    Para #{test.paragraphNumber} | Mode: {test.difficulty} | {test.date}
                  </div>
                  <div className="history-right">
                    {test.wpm} WPM
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;

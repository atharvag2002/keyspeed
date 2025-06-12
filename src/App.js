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
  "Though the clock ticked steadily, his thoughts ran wild, looping through memories and imagined futures he couldn’t escape.",
  "In an age of constant distraction, moments of stillness feel almost rebellious—yet that silence is where the real clarity often lives.",
  "As curiosity outpaced fear, she dove deeper into the unknown, chasing questions that had no promise of answers.",
  "The rustling leaves whispered secrets of the past, echoing stories long forgotten by even the oldest trees in the forest.",
  "What we define as intelligence isn’t just speed or memory, but the ability to adapt, reflect, and reshape our understanding when challenged."
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

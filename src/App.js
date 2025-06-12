import React, { useState, useEffect } from 'react';
import TypingBox from './components/TypingBox';
import './App.css';

const App = () => {
  const easyParagraphs = [
    "The quick brown fox jumps over the lazy dog.",
    "Pack my box with five dozen liquor jugs.",
    "How vexingly quick daft zebras jump!"
  ];

  const hardParagraphs = [
    "The juxtaposition of quantum mechanics and classical physics creates fascinating paradoxes that challenge our understanding of reality.",
    "Pneumonoultramicroscopicsilicovolcanoconiosis, the longest word in English, refers to a lung disease caused by inhaling very fine silicate or quartz dust.",
    "The epistemological implications of artificial intelligence's emergent behavior remain hotly debated among cognitive scientists and philosophers alike."
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
    const updated = [...history, result];
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
        <div className="difficulty-toggle">
          <button 
            onClick={toggleDifficulty}
            className={`toggle-btn ${isHardMode ? 'hard' : 'easy'}`}
          >
            {isHardMode ? 'Hard Mode' : 'Easy Mode'}
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

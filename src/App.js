import React, { useState } from 'react';
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
  const [completedTests, setCompletedTests] = useState([]);
  const [isHardMode, setIsHardMode] = useState(false);

  const handleComplete = () => {
    setCompletedTests(prev => {
      if (prev.includes(currentParaIndex)) return prev;
      return [...prev, currentParaIndex];
    });
  };

  const nextParagraph = () => {
    setCurrentParaIndex(prev => (prev + 1) % currentParagraphs.length);
  };

  const toggleDifficulty = () => {
    setIsHardMode(!isHardMode);
    setCurrentParaIndex(0); // Reset to first paragraph when changing mode
  };

  const currentParagraphs = isHardMode ? hardParagraphs : easyParagraphs;
  const appThemeClass = isHardMode ? 'hard-theme' : 'easy-theme';

  return (
    <div className={`outer-bg ${isHardMode ? 'outer-hard' : 'outer-easy'}`}>
    <div className={`app ${appThemeClass}`}>
      <h1>Typing Speed Test</h1>
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

      {completedTests.length > 0 && (
        <div className="history">
          <h3>Completed Tests:</h3>
          <ul>
            {completedTests.map((index, i) => (
              <li key={i}>Paragraph #{index + 1} ({isHardMode ? 'Hard' : 'Easy'})</li>
            ))}
          </ul>
        </div>
      )}
    </div>
    </div>
  );
};

export default App;
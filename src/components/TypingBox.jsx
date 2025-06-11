import React, { useState, useEffect, useRef } from 'react';
import './App.css'; // Your styling file

const TypingBox = ({ targetText = "", onComplete }) => {
  const [typedText, setTypedText] = useState('');
  const [startTime, setStartTime] = useState(null);
  const [wpm, setWpm] = useState(0);
  const inputRef = useRef(null);

  // Focus input on mount and reset on new text
  useEffect(() => {
    setTypedText('');
    setStartTime(null);
    setWpm(0);
    inputRef.current?.focus();
  }, [targetText]);

  // Calculate WPM
  useEffect(() => {
    if (startTime && typedText.length === targetText.length) {
      const timeElapsed = (Date.now() - startTime) / 60000; // minutes
      const words = targetText.split(' ').length;
      setWpm(Math.round(words / timeElapsed));
      onComplete?.();
    }
  }, [typedText, targetText, startTime, onComplete]);

  const handleInputChange = (e) => {
    if (!startTime && e.target.value.length > 0) {
      setStartTime(Date.now());
    }
    setTypedText(e.target.value);
  };

  const renderTargetText = () => {
    if (!targetText) return <div className="placeholder">Loading text...</div>;
    
    return targetText.split('').map((char, index) => {
      let color = 'black';
      let bgColor = 'transparent';
      
      if (index < typedText.length) {
        if (typedText[index] === char) {
          color = 'black';
          bgColor = '#e6ffe6'; // Light green for correct
        } else {
          color = 'red';
          bgColor = '#ffe6e6'; // Light red for incorrect
        }
      }

      return (
        <span 
          key={index} 
          style={{ color, backgroundColor: bgColor }}
          className="character"
        >
          {char}
        </span>
      );
    });
  };

  return (
    <div className="typing-container">
      <div className="text-display">
        {renderTargetText()}
      </div>
      <input
        type="text"
        ref={inputRef}
        value={typedText}
        onChange={handleInputChange}
        placeholder="Start typing here..."
        className="typing-input"
        disabled={!targetText}
      />
      {wpm > 0 && (
        <div className="results">
          <p>Your typing speed: <strong>{wpm} WPM</strong></p>
        </div>
      )}
    </div>
  );
};

const App = () => {
  const paragraphs = [
    "The quick brown fox jumps over the lazy dog. Pack my box with five dozen liquor jugs.",
    "React components let you split the UI into independent, reusable pieces. useState() is a Hook for functional components.",
    "The pursuit of knowledge is fundamental to human progress. Typing quickly and accurately is essential in today's digital world."
  ];

  const [currentParaIndex, setCurrentParaIndex] = useState(0);
  const [completedTests, setCompletedTests] = useState([]);

  const handleComplete = () => {
    setCompletedTests(prev => [...prev, currentParaIndex]);
  };

  const nextParagraph = () => {
    setCurrentParaIndex(prev => (prev + 1) % paragraphs.length);
  };

  return (
    <div className="app">
      <h1>Typing Speed Test</h1>
      <div className="test-container">
        <TypingBox 
          targetText={paragraphs[currentParaIndex]} 
          onComplete={handleComplete}
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
              <li key={i}>Paragraph #{index + 1}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default TypingBox;
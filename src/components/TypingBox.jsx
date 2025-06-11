import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

const TypingBox = ({ targetText = "", onComplete, isHardMode }) => {
  const [typedText, setTypedText] = useState('');
  const [startTime, setStartTime] = useState(null);
  const [wpm, setWpm] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    setTypedText('');
    setStartTime(null);
    setWpm(0);
    setIsComplete(false);
    inputRef.current?.focus();
  }, [targetText]);

  useEffect(() => {
    if (!startTime || isComplete) return;

    if (typedText.length === targetText.length) {
      const timeElapsed = (Date.now() - startTime) / 60000;
      const words = targetText.trim().split(/\s+/).length;
      const calculatedWpm = Math.round(words / timeElapsed);
      setWpm(calculatedWpm);
      setIsComplete(true);
      onComplete?.(calculatedWpm);
    }
  }, [typedText, targetText, startTime, isComplete, onComplete]);

  const handleInputChange = (e) => {
    if (!startTime && e.target.value.length > 0) {
      setStartTime(Date.now());
    }
    setTypedText(e.target.value);
  };

  const renderTargetText = () => {
    if (!targetText) return <div className="placeholder">Loading text...</div>;

    return targetText.split('').map((char, index) => {
      let color = isHardMode ? '#f8f8f8' : '#333';
      let bgColor = 'transparent';

      if (index < typedText.length) {
        if (typedText[index] === char) {
          bgColor = isHardMode ? '#4a8c5e' : '#a5d6a7';
        } else {
          bgColor = isHardMode ? '#c62828' : '#ffcdd2';
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
    <div className={`typing-container ${isHardMode ? 'hard' : 'easy'}`}>
      <div className="text-display">{renderTargetText()}</div>
      <input
        type="text"
        ref={inputRef}
        value={typedText}
        onChange={handleInputChange}
        placeholder="Start typing here..."
        className={`typing-input ${isHardMode ? 'hard' : 'easy'}`}
        disabled={!targetText || isComplete}
      />
      {wpm > 0 && (
        <div className={`results ${isHardMode ? 'hard' : 'easy'}`}>
          <p>Your typing speed: <strong>{wpm} WPM</strong></p>
          <p>Difficulty: <strong>{isHardMode ? 'Hard' : 'Easy'}</strong></p>
        </div>
      )}
    </div>
  );
};

TypingBox.propTypes = {
  targetText: PropTypes.string,
  onComplete: PropTypes.func,
  isHardMode: PropTypes.bool
};

export default TypingBox;

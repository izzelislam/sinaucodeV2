import { useState, useEffect } from 'react';

const TypingText = ({
  text,
  speed = 50,
  showCursor = true,
  cursorChar = '|',
  className = '',
  onComplete = null
}) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const [showCaret, setShowCaret] = useState(true);

  useEffect(() => {
    let currentIndex = 0;
    let typingInterval;
    let cursorInterval;

    // Typing animation
    const startTyping = () => {
      typingInterval = setInterval(() => {
        if (currentIndex < text.length) {
          setDisplayedText(text.substring(0, currentIndex + 1));
          currentIndex++;
        } else {
          setIsTyping(false);
          clearInterval(typingInterval);
          if (onComplete) {
            onComplete();
          }
        }
      }, speed);
    };

    // Cursor blinking animation
    cursorInterval = setInterval(() => {
      setShowCaret(prev => !prev);
    }, 500);

    startTyping();

    return () => {
      clearInterval(typingInterval);
      clearInterval(cursorInterval);
    };
  }, [text, speed, onComplete]);

  return (
    <span className={className}>
      {displayedText}
      {showCursor && (
        <span
          className={`inline-block ml-1 transition-opacity duration-100 ${
            showCaret ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {cursorChar}
        </span>
      )}
    </span>
  );
};

export default TypingText;
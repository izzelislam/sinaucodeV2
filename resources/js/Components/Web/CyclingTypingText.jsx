import { useState, useEffect, useRef } from 'react';

const CyclingTypingText = ({
  phrases,
  typingSpeed = 100,
  deletingSpeed = 50,
  delayBetweenPhrases = 2000,
  className = '',
  cursorChar = '|'
}) => {
  const [currentText, setCurrentText] = useState('');
  const [showCursor, setShowCursor] = useState(true);
  const timeoutRef = useRef(null);
  const phraseIndexRef = useRef(0);
  const charIndexRef = useRef(0);
  const isDeletingRef = useRef(false);
  const isWaitingRef = useRef(false);

  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 500);

    const type = () => {
      const currentPhrase = phrases[phraseIndexRef.current];

      // Handle waiting phase
      if (isWaitingRef.current) {
        timeoutRef.current = setTimeout(() => {
          isWaitingRef.current = false;
          isDeletingRef.current = true;
          type();
        }, delayBetweenPhrases);
        return;
      }

      // Handle deleting phase
      if (isDeletingRef.current) {
        if (charIndexRef.current > 0) {
          charIndexRef.current--;
          setCurrentText(currentPhrase.substring(0, charIndexRef.current));
          timeoutRef.current = setTimeout(type, deletingSpeed);
        } else {
          // Move to next phrase
          isDeletingRef.current = false;
          phraseIndexRef.current = (phraseIndexRef.current + 1) % phrases.length;
          charIndexRef.current = 0;
          timeoutRef.current = setTimeout(type, typingSpeed);
        }
        return;
      }

      // Handle typing phase
      if (charIndexRef.current < currentPhrase.length) {
        charIndexRef.current++;
        setCurrentText(currentPhrase.substring(0, charIndexRef.current));
        timeoutRef.current = setTimeout(type, typingSpeed);
      } else {
        // Finished typing, start waiting
        isWaitingRef.current = true;
        timeoutRef.current = setTimeout(type, 100); // Small delay before waiting
      }
    };

    // Start the animation
    timeoutRef.current = setTimeout(type, 500); // Initial delay

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      clearInterval(cursorInterval);
    };
  }, [phrases, typingSpeed, deletingSpeed, delayBetweenPhrases]);

  return (
    <span className={className}>
      {currentText}
      <span
        className={`inline-block transition-opacity duration-100 ${
          showCursor ? 'opacity-100' : 'opacity-0'
        }`}
      >
        {cursorChar}
      </span>
    </span>
  );
};

export default CyclingTypingText;
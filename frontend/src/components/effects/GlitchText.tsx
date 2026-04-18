"use client";

import { useState, useEffect } from "react";

const GLITCH_CHARS = "!@#$%^&*()_+-=[]{}|;:,./<>?~`01";

export default function GlitchText({ 
  text, 
  className = "",
  active = true,
  speed = 50,
}: { 
  text: string;
  className?: string;
  active?: boolean;
  speed?: number;
}) {
  const [display, setDisplay] = useState(text);
  const [isGlitching, setIsGlitching] = useState(false);

  useEffect(() => {
    if (!active) {
      setDisplay(text);
      return;
    }

    // Random glitch bursts
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        setIsGlitching(true);
        
        let iterations = 0;
        const maxIterations = 6;
        
        const glitchInterval = setInterval(() => {
          setDisplay(
            text
              .split("")
              .map((char) => {
                /* istanbul ignore next */
                if (char === " ") return " ";
                if (Math.random() > 0.5 + iterations / maxIterations) {
                  return GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)];
                }
                return char;
              })
              .join("")
          );
          iterations++;
          
          if (iterations >= maxIterations) {
            clearInterval(glitchInterval);
            setDisplay(text);
            setIsGlitching(false);
          }
        }, speed);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [text, active, speed]);

  return (
    <span
      className={`${className} ${isGlitching ? "glitch-active" : ""}`}
      data-text={text}
    >
      {display}
    </span>
  );
}

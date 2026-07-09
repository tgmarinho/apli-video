import React from 'react';
import { useCurrentFrame } from 'remotion';

interface Props {
  text: string;
  startFrame?: number;
  charsPerFrame?: number;
  style?: React.CSSProperties;
  showCursor?: boolean;
}

export const TypingText: React.FC<Props> = ({
  text,
  startFrame = 0,
  charsPerFrame = 0.6,
  style,
  showCursor = true,
}) => {
  const frame = useCurrentFrame();
  const elapsed = Math.max(0, frame - startFrame);
  const charsVisible = Math.min(text.length, Math.floor(elapsed * charsPerFrame));
  const done = charsVisible >= text.length;
  const cursorOn = (frame % 30) < 15;

  return (
    <span style={style}>
      {text.slice(0, charsVisible)}
      {showCursor && (
        <span
          style={{
            opacity: done ? (cursorOn ? 1 : 0) : 1,
            color: 'inherit',
            fontWeight: 300,
          }}
        >
          |
        </span>
      )}
    </span>
  );
};

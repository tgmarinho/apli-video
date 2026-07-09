import React from 'react';
import { FadeIn } from './FadeIn';

interface Props {
  delay?: number;
  gap?: number;       // frames between each item (default 4 = 133ms @ 30fps)
  duration?: number;
  translateY?: number;
  children: React.ReactNode[];
  style?: React.CSSProperties;
  itemStyle?: React.CSSProperties;
}

// Stagger-animates an array of children with consistent FadeIn easing.
export const StaggerList: React.FC<Props> = ({
  delay = 0,
  gap = 4,
  duration = 12,
  translateY = 12,
  children,
  style,
  itemStyle,
}) => (
  <div style={style}>
    {React.Children.map(children, (child, i) => (
      <FadeIn key={i} delay={delay + i * gap} duration={duration} translateY={translateY} style={itemStyle}>
        {child}
      </FadeIn>
    ))}
  </div>
);

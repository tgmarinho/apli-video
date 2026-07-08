import React from 'react';
import { Img, staticFile } from 'remotion';

interface Props {
  size?: number;
  style?: React.CSSProperties;
}

export const LogoMark: React.FC<Props> = ({ size = 48, style }) => (
  <Img
    src={staticFile('brand/kochavit.png')}
    width={size}
    height={size}
    style={{ objectFit: 'contain', ...style }}
  />
);

export const LogoFull: React.FC<Props> = ({ size = 32, style }) => (
  <Img
    src={staticFile('brand/logo.png')}
    height={size}
    style={{ objectFit: 'contain', ...style }}
  />
);

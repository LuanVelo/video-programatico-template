import React from 'react';
import {AbsoluteFill} from 'remotion';

export const Scene02: React.FC = () => {
  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#ffffff',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'DM Sans, system-ui, sans-serif',
      }}
    >
      <div
        style={{
          color: '#111111',
          fontSize: 72,
          fontWeight: 700,
          letterSpacing: -1.5,
          textAlign: 'center',
          textTransform: 'uppercase',
        }}
      >
        Bloco 2 - Sobre os tecidos
      </div>
    </AbsoluteFill>
  );
};

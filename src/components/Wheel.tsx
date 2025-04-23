import React, { useState, useEffect, useCallback } from 'react';
import styled from '@emotion/styled';

interface WheelProps {
  names: string[];
  isSpinning: boolean;
  onSpinComplete: (winner: string) => void;
}

const WheelContainer = styled.div`
  position: relative;
  width: 400px;
  height: 400px;
  margin: 2rem auto;

  @media (max-width: 500px) {
    width: 300px;
    height: 300px;
  }
`;

const WheelSVG = styled.svg<{ spinning: boolean; spinDuration: number; finalRotation: number }>`
  width: 100%;
  height: 100%;
  transform-origin: center;
  transition: transform 0.1s ease;
  transform: rotate(${props => props.finalRotation}deg);
  ${({ spinning, spinDuration, finalRotation }) =>
    spinning &&
    `
    animation: spin ${spinDuration}s cubic-bezier(0.3, 0.0, 0.2, 1) forwards;
    @keyframes spin {
      from {
        transform: rotate(0deg);
      }
      to {
        transform: rotate(${finalRotation}deg);
      }
    }
  `}
`;

const Pointer = styled.div`
  position: absolute;
  top: -20px;
  left: 50%;
  transform: translateX(-50%);
  width: 40px;
  height: 40px;
  background-color: #F44336;
  clip-path: polygon(50% 100%, 0 0, 100% 0);
  z-index: 1;
`;

const colors = [
  '#2196F3', // Blue
  '#FF5722', // Orange
  '#4CAF50', // Green
  '#F44336', // Red
  '#FFC107', // Yellow
  '#673AB7', // Purple
];

const getTextSize = (totalNames: number): number => {
  // Smaller text sizes for better fit
  if (totalNames <= 4) return 0.14;
  if (totalNames <= 6) return 0.12;
  if (totalNames <= 8) return 0.10;
  if (totalNames <= 12) return 0.08;
  if (totalNames <= 16) return 0.07;
  return 0.06;
};

const getTextRadius = (totalNames: number): number => {
  // Move text even further out for more space
  if (totalNames <= 4) return 0.65;
  if (totalNames <= 6) return 0.7;
  if (totalNames <= 8) return 0.75;
  if (totalNames <= 12) return 0.8;
  return 0.85;
};

const Wheel: React.FC<WheelProps> = ({ names, isSpinning, onSpinComplete }) => {
  const [finalRotation, setFinalRotation] = useState(0);
  const spinDuration = 4;

  // Calculate which name is at the top based on the rotation
  const getWinnerFromRotation = useCallback((rotation: number) => {
    const sliceAngle = 360 / names.length;
    // Normalize rotation to 0-360 degrees and account for the half slice offset
    const normalizedRotation = ((rotation % 360) + 360 + sliceAngle / 2) % 360;
    // Calculate which slice is at the top (0 degrees)
    const winnerIndex = Math.floor(normalizedRotation / sliceAngle);
    // Since we rotate clockwise, we need to go backwards through the array
    const actualIndex = (names.length - winnerIndex) % names.length;
    return names[actualIndex];
  }, [names]);

  useEffect(() => {
    if (isSpinning) {
      const sliceAngle = 360 / names.length;
      
      // Generate a random rotation between 5-7 full spins
      const spins = 5 + Math.floor(Math.random() * 3);
      // Add a random section rotation
      const randomSection = Math.floor(Math.random() * names.length);
      const sectionRotation = randomSection * sliceAngle;
      // Add half a section to center the pointer
      const centerOffset = sliceAngle / 2;
      
      const totalRotation = (spins * 360) + sectionRotation + centerOffset;
      
      console.log('Spin details:', {
        spins,
        randomSection,
        sectionRotation,
        centerOffset,
        totalRotation,
        expectedWinner: names[randomSection]
      });
      
      setFinalRotation(totalRotation);

      const timer = setTimeout(() => {
        const winner = getWinnerFromRotation(totalRotation);
        onSpinComplete(winner);
      }, spinDuration * 1000);
      
      return () => clearTimeout(timer);
    }
  }, [isSpinning, names, onSpinComplete, getWinnerFromRotation]);

  const createWheel = () => {
    const total = names.length;
    const anglePerSlice = (2 * Math.PI) / total;
    const fontSize = getTextSize(total);
    const textRadius = getTextRadius(total);
    
    return names.map((name, i) => {
      // Start angle from top (subtract PI/2 to start from top instead of right)
      const startAngle = i * anglePerSlice - Math.PI / 2;
      const endAngle = (i + 1) * anglePerSlice - Math.PI / 2;
      
      const startX = Math.cos(startAngle);
      const startY = Math.sin(startAngle);
      const endX = Math.cos(endAngle);
      const endY = Math.sin(endAngle);
      
      const largeArcFlag = anglePerSlice > Math.PI ? 1 : 0;
      
      const pathData = [
        `M ${startX} ${startY}`,
        `A 1 1 0 ${largeArcFlag} 1 ${endX} ${endY}`,
        'L 0 0',
        'Z'
      ].join(' ');

      const midAngle = startAngle + anglePerSlice / 2;
      const textX = Math.cos(midAngle) * textRadius;
      const textY = Math.sin(midAngle) * textRadius;
      
      const textRotation = (midAngle + Math.PI / 2) * (180 / Math.PI);

      return (
        <g key={i}>
          <path
            d={pathData}
            fill={colors[i % colors.length]}
            stroke="white"
            strokeWidth="0.01"
          />
          <text
            x={textX}
            y={textY}
            fontSize={fontSize}
            fill="white"
            textAnchor="middle"
            dominantBaseline="middle"
            transform={`rotate(${textRotation} ${textX} ${textY})`}
            style={{ 
              textShadow: '1px 1px 2px rgba(0,0,0,0.5)',
              fontWeight: 'bold',
              letterSpacing: '-0.02em'
            }}
          >
            {name}
          </text>
        </g>
      );
    });
  };

  return (
    <WheelContainer>
      <Pointer />
      <WheelSVG
        viewBox="-1 -1 2 2"
        spinning={isSpinning}
        spinDuration={spinDuration}
        finalRotation={finalRotation}
      >
        {createWheel()}
      </WheelSVG>
    </WheelContainer>
  );
};

export default Wheel; 
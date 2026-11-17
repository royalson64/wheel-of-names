import React, { useState, useEffect, useRef } from "react";
import styled from "@emotion/styled";
import { nextSpinRotation } from "../wheelMath";

interface WheelProps {
  names: string[];
  isSpinning: boolean;
  onSpinComplete: (winner: string, color: string) => void;
}

const WheelContainer = styled.div<{ glowing: boolean }>`
  position: relative;
  width: 450px;
  height: 450px;
  margin: 2rem auto;
  filter: drop-shadow(0 10px 40px rgba(0, 0, 0, 0.4));

  @media (max-width: 500px) {
    width: 320px;
    height: 320px;
  }

  ${({ glowing }) =>
    glowing &&
    `
    animation: wheelGlow 4s ease-in-out forwards;
    @keyframes wheelGlow {
      0%,
      100% {
        filter: drop-shadow(0 10px 40px rgba(0, 0, 0, 0.4));
      }
      50% {
        filter: drop-shadow(0 10px 48px rgba(255, 255, 255, 0.35));
      }
    }
  `}
`;

const WheelSVG = styled.svg<{ spinning: boolean; spinDuration: number }>`
  width: 100%;
  height: 100%;
  transform-origin: center;
  transition: ${({ spinning, spinDuration }) =>
    spinning
      ? `transform ${spinDuration}s cubic-bezier(0.3, 0.0, 0.2, 1)`
      : "none"};
`;

const Pointer = styled.div`
  position: absolute;
  top: -25px;
  left: 50%;
  transform: translateX(-50%);
  width: 50px;
  height: 50px;
  background: linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%);
  clip-path: polygon(50% 100%, 0 0, 100% 0);
  z-index: 10;
  filter: drop-shadow(0 4px 12px rgba(244, 67, 54, 0.6));
  animation: pointerPulse 2s ease-in-out infinite;
  border: 2px solid rgba(255, 255, 255, 0.8);
  box-sizing: border-box;

  &::after {
    content: "";
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 12px;
    height: 12px;
    background: white;
    border-radius: 50%;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  }

  @keyframes pointerPulse {
    0%,
    100% {
      transform: translateX(-50%) scale(1);
    }
    50% {
      transform: translateX(-50%) scale(1.1);
    }
  }
`;

const colors = [
  "#2196F3",
  "#FF5722",
  "#4CAF50",
  "#F44336",
  "#FFC107",
  "#673AB7",
];

const getTextSize = (totalNames: number): number => {
  if (totalNames <= 4) return 0.14;
  if (totalNames <= 6) return 0.12;
  if (totalNames <= 8) return 0.1;
  if (totalNames <= 12) return 0.08;
  if (totalNames <= 16) return 0.07;
  if (totalNames <= 24) return 0.055;
  return 0.045;
};

const getTextRadius = (totalNames: number): number => {
  if (totalNames <= 4) return 0.65;
  if (totalNames <= 6) return 0.7;
  if (totalNames <= 8) return 0.75;
  if (totalNames <= 12) return 0.8;
  return 0.85;
};

const Wheel: React.FC<WheelProps> = ({ names, isSpinning, onSpinComplete }) => {
  const [rotation, setRotation] = useState(0);
  const chosenWinnerIndexRef = useRef<number | null>(null);
  const hasCompletedRef = useRef(false);
  const spinLockRef = useRef(false);
  const namesRef = useRef(names);
  const wheelRef = useRef<SVGSVGElement>(null);
  const spinDuration = 4;

  namesRef.current = names;

  useEffect(() => {
    if (!isSpinning) {
      spinLockRef.current = false;
      return;
    }

    if (spinLockRef.current) {
      return;
    }

    const currentNames = namesRef.current;
    if (currentNames.length === 0) {
      return;
    }

    spinLockRef.current = true;
    hasCompletedRef.current = false;

    const spins = 5 + Math.floor(Math.random() * 3);
    const randomWinnerIndex = Math.floor(Math.random() * currentNames.length);
    chosenWinnerIndexRef.current = randomWinnerIndex;

    setRotation((currentRotation) =>
      nextSpinRotation(
        currentRotation,
        randomWinnerIndex,
        currentNames.length,
        spins
      )
    );
  }, [isSpinning]);

  useEffect(() => {
    const wheelElement = wheelRef.current;
    if (!wheelElement) {
      return;
    }

    const handleTransitionEnd = (event: TransitionEvent) => {
      if (event.propertyName !== "transform") {
        return;
      }
      if (hasCompletedRef.current) {
        return;
      }

      const currentNames = namesRef.current;
      const index = chosenWinnerIndexRef.current;
      if (index === null || index < 0 || index >= currentNames.length) {
        return;
      }

      hasCompletedRef.current = true;
      onSpinComplete(currentNames[index], colors[index % colors.length]);
      chosenWinnerIndexRef.current = null;
    };

    wheelElement.addEventListener("transitionend", handleTransitionEnd);
    return () => {
      wheelElement.removeEventListener("transitionend", handleTransitionEnd);
    };
  }, [onSpinComplete]);

  const createWheel = () => {
    const total = names.length;
    const anglePerSlice = (2 * Math.PI) / total;
    const fontSize = getTextSize(total);
    const textRadius = getTextRadius(total);

    return names.map((name, i) => {
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
        "L 0 0",
        "Z",
      ].join(" ");

      const midAngle = startAngle + anglePerSlice / 2;
      const textX = Math.cos(midAngle) * textRadius;
      const textY = Math.sin(midAngle) * textRadius;
      const textRotation = (midAngle + Math.PI / 2) * (180 / Math.PI);
      const colorIndex = i % colors.length;

      return (
        <g key={`${name}-${i}`}>
          <path
            d={pathData}
            fill={`url(#slice-gradient-${colorIndex})`}
            stroke="rgba(255, 255, 255, 0.5)"
            strokeWidth="0.015"
            filter="url(#slice-shadow)"
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
              textShadow: "0 2px 4px rgba(0,0,0,0.6)",
              fontWeight: "800",
              letterSpacing: "-0.01em",
              paintOrder: "stroke fill",
              stroke: "rgba(0, 0, 0, 0.3)",
              strokeWidth: "0.003",
            }}
          >
            {name}
          </text>
        </g>
      );
    });
  };

  return (
    <WheelContainer glowing={isSpinning}>
      <Pointer />
      <WheelSVG
        ref={wheelRef}
        viewBox="-1.1 -1.1 2.2 2.2"
        spinning={isSpinning}
        spinDuration={spinDuration}
        style={{ transform: `rotate(${rotation}deg)` }}
      >
        <defs>
          {colors.map((color, i) => (
            <linearGradient
              key={color}
              id={`slice-gradient-${i}`}
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" stopColor={color} stopOpacity="1" />
              <stop offset="100%" stopColor={color} stopOpacity="0.85" />
            </linearGradient>
          ))}
          <filter id="slice-shadow">
            <feDropShadow
              dx="0"
              dy="0.01"
              stdDeviation="0.02"
              floodColor="rgba(0,0,0,0.3)"
            />
          </filter>
          <radialGradient id="wheelGlow">
            <stop offset="0%" stopColor="rgba(255, 255, 255, 0.1)" />
            <stop offset="100%" stopColor="rgba(255, 255, 255, 0)" />
          </radialGradient>
        </defs>
        <circle cx="0" cy="0" r="1.05" fill="url(#wheelGlow)" opacity="0.3" />
        {createWheel()}
        <circle
          cx="0"
          cy="0"
          r="0.08"
          fill="#667eea"
          stroke="white"
          strokeWidth="0.015"
        />
        <circle cx="0" cy="0" r="0.04" fill="white" opacity="0.9" />
      </WheelSVG>
    </WheelContainer>
  );
};

export default Wheel;

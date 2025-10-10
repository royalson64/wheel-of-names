import React, { useState, useEffect, useCallback, useRef } from "react";
import styled from "@emotion/styled";

interface WheelProps {
  names: string[];
  isSpinning: boolean;
  onSpinComplete: (winner: string, color: string) => void;
}

const WheelContainer = styled.div`
  position: relative;
  width: 450px;
  height: 450px;
  margin: 2rem auto;
  filter: drop-shadow(0 10px 40px rgba(0, 0, 0, 0.4));

  @media (max-width: 500px) {
    width: 320px;
    height: 320px;
  }
`;

const WheelSVG = styled.svg<{
  spinning: boolean;
  spinDuration: number;
  finalRotation: number;
}>`
  width: 100%;
  height: 100%;
  transform-origin: center;
  /* Avoid small post-animation transitions that can cause visual flicker */
  transition: none;
  transform: rotate(${(props) => props.finalRotation}deg);
  filter: drop-shadow(0 0 20px rgba(255, 255, 255, 0.2));
  ${({ spinning, spinDuration, finalRotation }) =>
    spinning &&
    `
    animation: spin ${spinDuration}s cubic-bezier(0.3, 0.0, 0.2, 1) forwards,
               spinGlow ${spinDuration}s ease-in-out forwards;
    @keyframes spin {
      from {
        transform: rotate(0deg);
      }
      to {
        transform: rotate(${finalRotation}deg);
      }
    }
    @keyframes spinGlow {
      0% {
        filter: drop-shadow(0 0 20px rgba(255, 255, 255, 0.2));
      }
      50% {
        filter: drop-shadow(0 0 40px rgba(255, 255, 255, 0.6));
      }
      100% {
        filter: drop-shadow(0 0 20px rgba(255, 255, 255, 0.2));
      }
    }
  `}
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
  if (totalNames <= 8) return 0.1;
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
  // Persist the chosen winner for a given spin to avoid any rounding drift
  const chosenWinnerIndexRef = useRef<number | null>(null);
  // Protect against duplicate animationend events
  const hasCompletedRef = useRef<boolean>(false);
  const wheelRef = useRef<SVGSVGElement>(null);
  const spinDuration = 4;

  // Calculate which name is at the top based on the rotation
  const getWinnerFromRotation = useCallback(
    (rotation: number) => {
      const sliceAngle = 360 / names.length;
      // Normalize rotation to [0, 360)
      const normalized = ((rotation % 360) + 360) % 360;
      // Angle at the unrotated wheel that the pointer selects
      const pointerAngleOnWheel = (360 - normalized) % 360;
      // Use rounding to the nearest center to avoid boundary flicker
      const winnerIndex =
        Math.round(pointerAngleOnWheel / sliceAngle) % names.length;
      const winnerName = names[winnerIndex];
      const winnerColor = colors[winnerIndex % colors.length];
      return { name: winnerName, color: winnerColor };
    },
    [names]
  );

  useEffect(() => {
    if (isSpinning) {
      const sliceAngle = 360 / names.length;

      // Generate a random rotation between 5-7 full spins
      const spins = 5 + Math.floor(Math.random() * 3);
      // Pick a random winner
      const randomWinnerIndex = Math.floor(Math.random() * names.length);
      // Store the chosen winner index for this spin to guarantee consistency
      chosenWinnerIndexRef.current = randomWinnerIndex;
      hasCompletedRef.current = false;
      // Calculate rotation needed to land on that winner
      // Rotate clockwise so the pointer (top) lands at the CENTER of slice i
      const targetRotation =
        (360 - (randomWinnerIndex + 0.5) * sliceAngle + 360) % 360;

      const totalRotation = spins * 360 + targetRotation;

      console.log("Spin details:", {
        spins,
        randomWinnerIndex,
        targetRotation,
        totalRotation,
        expectedWinner: names[randomWinnerIndex],
      });

      setFinalRotation(totalRotation);

      // Listen for animation completion instead of using setTimeout
      const handleAnimationEnd = () => {
        if (hasCompletedRef.current) return;
        hasCompletedRef.current = true;
        // Prefer the previously chosen index; fall back to rotation math if missing
        const index = chosenWinnerIndexRef.current;
        if (index !== null && index >= 0 && index < names.length) {
          const name = names[index];
          const color = colors[index % colors.length];
          console.log("Animation completed, winner (stored):", { name, color });
          onSpinComplete(name, color);
        } else {
          const winner = getWinnerFromRotation(totalRotation);
          console.log("Animation completed, winner (computed):", winner);
          onSpinComplete(winner.name, winner.color);
        }
        // Reset stored winner after use
        chosenWinnerIndexRef.current = null;
      };

      const wheelElement = wheelRef.current;
      if (wheelElement) {
        wheelElement.addEventListener("animationend", handleAnimationEnd);
      }

      return () => {
        if (wheelElement) {
          wheelElement.removeEventListener("animationend", handleAnimationEnd);
        }
      };
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
        "L 0 0",
        "Z",
      ].join(" ");

      const midAngle = startAngle + anglePerSlice / 2;
      const textX = Math.cos(midAngle) * textRadius;
      const textY = Math.sin(midAngle) * textRadius;

      const textRotation = (midAngle + Math.PI / 2) * (180 / Math.PI);

      return (
        <g key={i}>
          <defs>
            <linearGradient
              id={`gradient-${i}`}
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop
                offset="0%"
                stopColor={colors[i % colors.length]}
                stopOpacity="1"
              />
              <stop
                offset="100%"
                stopColor={colors[i % colors.length]}
                stopOpacity="0.85"
              />
            </linearGradient>
            <filter id={`shadow-${i}`}>
              <feDropShadow
                dx="0"
                dy="0.01"
                stdDeviation="0.02"
                floodColor="rgba(0,0,0,0.3)"
              />
            </filter>
          </defs>
          <path
            d={pathData}
            fill={`url(#gradient-${i})`}
            stroke="rgba(255, 255, 255, 0.5)"
            strokeWidth="0.015"
            filter={`url(#shadow-${i})`}
            style={{
              transition: "all 0.3s ease",
            }}
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
    <WheelContainer>
      <Pointer />
      <WheelSVG
        ref={wheelRef}
        viewBox="-1.1 -1.1 2.2 2.2"
        spinning={isSpinning}
        spinDuration={spinDuration}
        finalRotation={finalRotation}
      >
        <defs>
          <radialGradient id="wheelGlow">
            <stop offset="0%" stopColor="rgba(255, 255, 255, 0.1)" />
            <stop offset="100%" stopColor="rgba(255, 255, 255, 0)" />
          </radialGradient>
          <filter id="outerGlow">
            <feGaussianBlur stdDeviation="0.02" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>
        <circle cx="0" cy="0" r="1.05" fill="url(#wheelGlow)" opacity="0.3" />
        {createWheel()}
        <circle
          cx="0"
          cy="0"
          r="0.08"
          fill="linear-gradient(135deg, #667eea, #764ba2)"
          stroke="white"
          strokeWidth="0.015"
          filter="drop-shadow(0 0 0.03 rgba(0, 0, 0, 0.5))"
        />
        <circle cx="0" cy="0" r="0.04" fill="white" opacity="0.9" />
      </WheelSVG>
    </WheelContainer>
  );
};

export default Wheel;

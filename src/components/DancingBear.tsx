import React from "react";
import styled from "@emotion/styled";

interface DancingBearProps {
  visible: boolean;
  onAnimationEnd?: () => void;
}

const BearContainer = styled.div<{ visible: boolean }>`
  position: fixed;
  bottom: 10%;
  left: -20%;
  width: 180px;
  height: 180px;
  z-index: 9999;
  pointer-events: none;
  transform: translateX(0);
  transition: opacity 0.3s ease;
  opacity: ${(props) => (props.visible ? 1 : 0)};

  @media (max-width: 500px) {
    width: 120px;
    height: 120px;
    bottom: 8%;
  }

  ${(props) =>
    props.visible &&
    `
        		animation: bearMove 7s ease-in-out forwards;
        	`}

  @keyframes bearMove {
    /* start off-screen left */
    0% {
      left: -25%;
      transform: rotate(-6deg) translateY(0) scale(0.95);
    }

    /* move to a centered stop (about 45% across) over ~2.45s (35% of 7s) */
    35% {
      left: 45%;
      transform: rotate(6deg) translateY(-6px) scale(1);
    }

    /* pause in place for ~2s (≈28.57% of 7s) by repeating the same position */
    64.2857% {
      left: 45%;
      transform: rotate(6deg) translateY(-6px) scale(1);
    }

    /* finish moving off-screen right */
    100% {
      left: 110%;
      transform: rotate(0deg) translateY(0) scale(1);
    }
  }
`;

const BearSVG = styled.svg`
  width: 100%;
  height: 100%;
  filter: drop-shadow(0 8px 30px rgba(0, 0, 0, 0.35));

  /* Animated parts inside the SVG: head, arms, body, legs */
  .head {
    transform-origin: 100px 70px;
    animation: headBob 0.9s ease-in-out infinite;
  }

  .left-arm {
    transform-origin: 60px 120px;
    animation: armSwing 0.8s cubic-bezier(0.4, 0.05, 0.2, 1) infinite;
  }

  .right-arm {
    transform-origin: 140px 120px;
    animation: armSwing 0.95s cubic-bezier(0.4, 0.05, 0.2, 1) infinite reverse;
  }

  .body {
    animation: bodyBounce 0.9s ease-in-out infinite;
  }

  .leg-left,
  .leg-right {
    transform-origin: center;
    animation: footTap 0.6s ease-in-out infinite;
  }

  .blush {
    opacity: 0.9;
  }

  @keyframes headBob {
    0% {
      transform: translateY(0) rotate(0deg);
    }
    50% {
      transform: translateY(-6px) rotate(6deg);
    }
    100% {
      transform: translateY(0) rotate(0deg);
    }
  }

  @keyframes armSwing {
    0% {
      transform: rotate(-12deg);
    }
    50% {
      transform: rotate(22deg) translateY(-6px);
    }
    100% {
      transform: rotate(-12deg);
    }
  }

  @keyframes bodyBounce {
    0% {
      transform: translateY(0) scale(1);
    }
    50% {
      transform: translateY(-6px) scale(1.02);
    }
    100% {
      transform: translateY(0) scale(1);
    }
  }

  @keyframes footTap {
    0% {
      transform: translateY(0) rotate(0deg);
    }
    50% {
      transform: translateY(4px) rotate(-6deg);
    }
    100% {
      transform: translateY(0) rotate(0deg);
    }
  }
`;

/**
 * DancingBear
 * - visible: controls whether the bear animation plays
 * - onAnimationEnd: optional callback fired after animation completes
 */
const DancingBear: React.FC<DancingBearProps> = ({
  visible,
  onAnimationEnd,
}) => {
  return (
    <BearContainer
      visible={visible}
      role="img"
      aria-hidden={!visible}
      onAnimationEnd={() => {
        if (onAnimationEnd) onAnimationEnd();
      }}
    >
      <BearSVG viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
        {/* Improved stylized dancing bear with separable parts for animation */}
        {/* Body group (bounces slightly) */}
        <g className="body">
          {/* Ears */}
          <circle cx="64" cy="48" r="14" fill="#7B4D33" />
          <circle cx="136" cy="48" r="14" fill="#7B4D33" />

          {/* Head group (moves/tilts) */}
          <g className="head">
            <ellipse cx="100" cy="72" rx="44" ry="38" fill="#A46A43" />
            {/* inner face */}
            <ellipse cx="100" cy="82" rx="32" ry="28" fill="#8B5E3C" />

            {/* Eyes */}
            <circle cx="86" cy="78" r="5" fill="#111111" />
            <circle cx="114" cy="78" r="5" fill="#111111" />

            {/* Nose */}
            <ellipse cx="100" cy="92" rx="8" ry="6" fill="#2D2D2D" />

            {/* Smile */}
            <path
              d="M90 100c4 6 12 6 20 0"
              stroke="#2D2D2D"
              strokeWidth="3"
              strokeLinecap="round"
              fill="none"
            />

            {/* Blush */}
            <ellipse
              className="blush"
              cx="74"
              cy="90"
              rx="6"
              ry="4"
              fill="#FFB6A6"
            />
            <ellipse
              className="blush"
              cx="126"
              cy="90"
              rx="6"
              ry="4"
              fill="#FFB6A6"
            />
          </g>

          {/* Arms (separate for swinging) */}
          <g className="left-arm">
            <rect
              x="36"
              y="110"
              width="20"
              height="44"
              rx="10"
              fill="#8B5E3C"
              transform="rotate(-18 46 132)"
            />
          </g>
          <g className="right-arm">
            <rect
              x="144"
              y="110"
              width="20"
              height="44"
              rx="10"
              fill="#8B5E3C"
              transform="rotate(18 154 132)"
            />
          </g>

          {/* Body / belly */}
          <ellipse cx="100" cy="140" rx="52" ry="40" fill="#7B4D33" />

          {/* Legs (tapping) */}
          <g>
            <rect
              className="leg-left"
              x="60"
              y="150"
              width="20"
              height="34"
              rx="10"
              fill="#8B5E3C"
              transform="rotate(-8 70 167)"
            />
            <rect
              className="leg-right"
              x="120"
              y="150"
              width="20"
              height="34"
              rx="10"
              fill="#8B5E3C"
              transform="rotate(8 130 167)"
            />
          </g>
        </g>
      </BearSVG>
    </BearContainer>
  );
};

export default DancingBear;

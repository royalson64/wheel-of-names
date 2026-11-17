import React, { useCallback, useMemo, useRef, useState } from "react";
import styled from "@emotion/styled";
import "./App.css";
import Wheel from "./components/Wheel";
import DancingBear from "./components/DancingBear";
import { parseNameCountCsv } from "./csv";
import {
  clampSelectionCount,
  createEmptyEntries,
  expandEntriesToNames,
  INITIAL_ENTRY_COUNT,
  MAX_SELECTIONS_PER_NAME,
  NameEntry,
} from "./types";

const Container = styled.div<{ isLandscape: boolean; isDark: boolean }>`
  text-align: center;
  padding: 2rem 1rem;
  max-width: ${(props) => (props.isLandscape ? "1600px" : "1200px")};
  margin: 0 auto;
  min-height: 100vh;
  background: ${(props) =>
    props.isDark
      ? "linear-gradient(135deg, #1a2332 0%, #2d3748 100%)"
      : "linear-gradient(135deg, #2c5f7c 0%, #3a7d8f 100%)"};
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
    Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  color: ${(props) => (props.isDark ? "#ffffff" : "#ffffff")};
  transition: background 0.5s ease, color 0.3s ease;
  position: relative;

  &::before {
    content: "";
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: ${(props) =>
      props.isDark
        ? "radial-gradient(circle at 20% 50%, rgba(74, 144, 226, 0.08), transparent 50%), radial-gradient(circle at 80% 80%, rgba(80, 200, 120, 0.06), transparent 50%)"
        : "radial-gradient(circle at 20% 50%, rgba(255, 255, 255, 0.1), transparent 50%), radial-gradient(circle at 80% 80%, rgba(255, 255, 255, 0.08), transparent 50%)"};
    pointer-events: none;
    z-index: 0;
  }

  & > * {
    position: relative;
    z-index: 1;
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 1.5rem;
  position: relative;

  @media (max-width: 768px) {
    margin-bottom: 1rem;
  }
`;

const Title = styled.h1<{ isDark: boolean }>`
  font-size: 3rem;
  font-weight: 800;
  background: linear-gradient(135deg, #ffffff 0%, #f0f0f0 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  letter-spacing: -0.03em;
  margin: 0;
  text-shadow: 0 2px 20px rgba(255, 255, 255, 0.3);
  filter: drop-shadow(0 4px 6px rgba(0, 0, 0, 0.2));

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const Logo = styled.div`
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 60px;
  height: 60px;
  animation: logoSpin 20s linear infinite;

  @keyframes logoSpin {
    0% {
      transform: translateY(-50%) rotate(0deg);
    }
    100% {
      transform: translateY(-50%) rotate(360deg);
    }
  }

  @media (max-width: 768px) {
    width: 50px;
    height: 50px;
  }
`;

const ControlsGroup = styled.div`
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  gap: 0.5rem;
  align-items: center;
`;

const IconButton = styled.button<{ isDark?: boolean }>`
  padding: 0.5rem;
  background: rgba(255, 255, 255, 0.2);
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 12px;
  cursor: pointer;
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  width: 44px;
  height: 44px;
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);

  &:hover {
    background: rgba(255, 255, 255, 0.3);
    border-color: rgba(255, 255, 255, 0.5);
    transform: translateY(-2px) scale(1.05);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
  }

  &:active {
    transform: translateY(0) scale(0.98);
  }

  svg {
    width: 22px;
    height: 22px;
    filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
  }
`;

const MainContent = styled.div<{ isLandscape: boolean }>`
  display: ${(props) => (props.isLandscape ? "grid" : "flex")};
  ${(props) =>
    props.isLandscape
      ? `
    grid-template-columns: 1fr 1fr;
    gap: 2rem;
    align-items: start;
  `
      : `
    flex-direction: column;
    gap: 1.5rem;
  `}
`;

const InputSection = styled.div<{ isLandscape: boolean; isDark: boolean }>`
  max-width: ${(props) => (props.isLandscape ? "none" : "900px")};
  margin: ${(props) => (props.isLandscape ? "0 auto 3rem" : "0 auto")};
  padding: 2rem;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(20px);
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 24px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.3);
  display: grid;
  grid-template-columns: 1fr 1px 1fr;
  gap: 0;
  align-items: start;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.4) 50%,
      transparent
    );
  }

  @media (max-width: 768px) {
    padding: 1.5rem;
    grid-template-columns: 1fr;
    .separator {
      display: none;
    }
  }
`;

const WheelSection = styled.div<{ isLandscape: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  ${(props) =>
    props.isLandscape &&
    `
    position: sticky;
    top: 2rem;
  `}
`;

const InputsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 0 1.5rem;

  @media (max-width: 768px) {
    padding: 0;
    gap: 0.75rem;
  }
`;

const ColumnSeparator = styled.div`
  width: 1px;
  height: 100%;
  background: linear-gradient(
    to bottom,
    transparent,
    rgba(255, 255, 255, 0.3) 10%,
    rgba(255, 255, 255, 0.3) 90%,
    transparent
  );
  box-shadow: 0 0 8px rgba(255, 255, 255, 0.2);
`;

const InputWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  position: relative;
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-1px);
  }
`;

const InputGroup = styled.div`
  display: flex;
  gap: 0.75rem;
  flex: 1;
`;

const Input = styled.input<{ isDark: boolean }>`
  padding: 0.875rem 1rem;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 12px;
  font-size: 1rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  background: rgba(255, 255, 255, 0.25);
  backdrop-filter: blur(10px);
  color: #ffffff;
  font-weight: 500;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

  &::placeholder {
    color: rgba(255, 255, 255, 0.6);
  }

  &:focus {
    outline: none;
    border-color: rgba(255, 255, 255, 0.6);
    background: rgba(255, 255, 255, 0.35);
    box-shadow: 0 4px 20px rgba(255, 255, 255, 0.2),
      0 0 0 4px rgba(255, 255, 255, 0.1);
    transform: translateY(-2px);
  }

  &:disabled {
    background-color: rgba(255, 255, 255, 0.1);
    cursor: not-allowed;
    opacity: 0.6;
  }
`;

const NameInput = styled(Input)`
  width: 100%;
`;

const CountInput = styled(Input)`
  width: 70px;
  text-align: center;
  font-weight: 700;
  /* Remove default number input spinners */
  &::-webkit-inner-spin-button,
  &::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  &[type="number"] {
    -moz-appearance: textfield;
  }
`;

const CountInputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const CountButton = styled.button<{ isDark?: boolean }>`
  position: absolute;
  padding: 0;
  background: rgba(255, 255, 255, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.4);
  border-radius: 6px;
  color: #ffffff;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 1;
  backdrop-filter: blur(10px);

  &:hover {
    background: rgba(255, 255, 255, 0.5);
    transform: scale(1.1);
  }

  &:active {
    transform: scale(0.95);
  }

  &:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }

  svg {
    width: 14px;
    height: 14px;
    display: block;
  }

  &.decrease {
    left: 5px;
  }

  &.increase {
    right: 5px;
  }
`;

const Button = styled.button<{ variant?: "primary" | "spin" }>`
  padding: ${(props) =>
    props.variant === "spin" ? "1rem 2.5rem" : "0.875rem 1.5rem"};
  background: ${(props) => {
    if (props.variant === "spin") {
      return "linear-gradient(135deg, #4A90E2 0%, #50C878 100%)";
    }
    return "linear-gradient(135deg, #50C878 0%, #87CEEB 100%)";
  }};
  color: white;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 16px;
  cursor: pointer;
  font-size: ${(props) => (props.variant === "spin" ? "1.25rem" : "1rem")};
  font-weight: 700;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.25),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
  margin: 1rem auto;
  display: block;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  position: relative;
  overflow: hidden;
  backdrop-filter: blur(10px);

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.3),
      transparent
    );
    transition: left 0.5s ease;
  }

  &:hover::before {
    left: 100%;
  }

  @media (max-width: 768px) {
    padding: ${(props) =>
      props.variant === "spin" ? "0.875rem 2rem" : "0.75rem 1.25rem"};
    font-size: ${(props) =>
      props.variant === "spin" ? "1.125rem" : "0.875rem"};
  }

  &:hover {
    transform: translateY(-3px) scale(1.02);
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.35),
      inset 0 1px 0 rgba(255, 255, 255, 0.3);
  }

  &:active {
    transform: translateY(-1px) scale(0.98);
  }

  &:disabled {
    background: rgba(255, 255, 255, 0.2);
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
    opacity: 0.5;
  }
`;

const ActionsRow = styled.div`
  grid-column: 1 / -1;
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  justify-content: center;
  align-items: center;
  margin-top: 1rem;
`;

const AddButton = styled(Button)`
  width: fit-content;
  margin: 0;
`;

const CsvHint = styled.p`
  grid-column: 1 / -1;
  margin: 0.5rem 0 0;
  color: rgba(255, 255, 255, 0.75);
  font-size: 0.8rem;
`;

const CsvError = styled.p`
  grid-column: 1 / -1;
  margin: 0.35rem 0 0;
  color: #ffcdd2;
  font-size: 0.85rem;
  font-weight: 600;
`;

const WinnerDisplay = styled.div<{ backgroundColor: string }>`
  margin-top: 1.5rem;
  padding: 2rem;
  background: linear-gradient(
    135deg,
    ${(props) => props.backgroundColor} 0%,
    ${(props) => props.backgroundColor}dd 100%
  );
  backdrop-filter: blur(20px);
  color: white;
  border: 3px solid rgba(255, 255, 255, 0.4);
  border-radius: 24px;
  animation: winnerReveal 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
  box-shadow: 0 8px 40px rgba(0, 0, 0, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.4);
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: linear-gradient(
      45deg,
      transparent,
      rgba(255, 255, 255, 0.1),
      transparent
    );
    animation: shimmer 2s infinite;
  }

  h2 {
    font-size: 2rem;
    margin: 0;
    font-weight: 800;
    letter-spacing: -0.02em;
    text-shadow: 0 2px 8px rgba(0, 0, 0, 0.4);
    position: relative;
    z-index: 1;
  }

  @media (max-width: 768px) {
    margin-top: 1rem;
    padding: 1.5rem;

    h2 {
      font-size: 1.5rem;
    }
  }

  @keyframes winnerReveal {
    0% {
      opacity: 0;
      transform: translateY(30px) scale(0.9);
    }
    50% {
      transform: translateY(-10px) scale(1.05);
    }
    100% {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }

  @keyframes shimmer {
    0% {
      transform: translateX(-100%) translateY(-100%) rotate(45deg);
    }
    100% {
      transform: translateX(100%) translateY(100%) rotate(45deg);
    }
  }
`;

const HistoryDisplay = styled.div`
  margin-top: 1.5rem;
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(20px);
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);

  @media (max-width: 768px) {
    margin-top: 1rem;
    padding: 1.25rem;
  }
`;

const HistoryTitle = styled.h3`
  color: rgba(255, 255, 255, 0.95);
  margin: 0 0 1rem 0;
  font-size: 1.125rem;
  font-weight: 700;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
`;

const HistoryList = styled.div`
  display: flex;
  gap: 0.75rem;
  flex-direction: column;
  max-height: 22rem;
  overflow-y: auto;
  padding-right: 0.25rem;
`;

const HistoryItem = styled.div<{ index: number }>`
  padding: 1rem 1.5rem;
  background: ${(props) => {
    const colors = [
      "linear-gradient(135deg, #4A90E2 0%, #50C878 100%)",
      "linear-gradient(135deg, #50C878 0%, #87CEEB 100%)",
      "linear-gradient(135deg, #708090 0%, #4A90E2 100%)",
    ];
    return colors[props.index % colors.length];
  }};
  color: white;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 16px;
  font-size: 1rem;
  font-weight: 600;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(10px);
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);

  &:hover {
    transform: translateX(4px);
    box-shadow: 0 6px 24px rgba(0, 0, 0, 0.3);
  }
`;

function readFileAsText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = () =>
      reject(reader.error || new Error("Could not read the CSV file."));
    reader.readAsText(file);
  });
}

function NameRow({
  entry,
  index,
  isSpinning,
  isDark,
  onNameChange,
  onCountChange,
}: {
  entry: NameEntry;
  index: number;
  isSpinning: boolean;
  isDark: boolean;
  onNameChange: (index: number, value: string) => void;
  onCountChange: (index: number, value: number) => void;
}) {
  return (
    <InputWrapper>
      <InputGroup>
        <NameInput
          type="text"
          value={entry.name}
          onChange={(e) => onNameChange(index, e.target.value)}
          placeholder="Enter name"
          disabled={isSpinning}
          isDark={isDark}
        />
        <CountInputWrapper>
          <CountInput
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            value={entry.count}
            onChange={(e) => {
              const value = e.target.value.replace(/[^0-9]/g, "");
              onCountChange(index, value === "" ? 1 : parseInt(value, 10));
            }}
            disabled={isSpinning}
            isDark={isDark}
            placeholder="#"
          />
          <CountButton
            className="decrease"
            onClick={() => onCountChange(index, entry.count - 1)}
            disabled={entry.count <= 1 || isSpinning}
            isDark={isDark}
            aria-label="Decrease count"
          >
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 13H5v-2h14v2z" />
            </svg>
          </CountButton>
          <CountButton
            className="increase"
            onClick={() => onCountChange(index, entry.count + 1)}
            disabled={entry.count >= MAX_SELECTIONS_PER_NAME || isSpinning}
            isDark={isDark}
            aria-label="Increase count"
          >
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
            </svg>
          </CountButton>
        </CountInputWrapper>
      </InputGroup>
    </InputWrapper>
  );
}

function App() {
  const [entries, setEntries] = useState<NameEntry[]>(() =>
    createEmptyEntries(INITIAL_ENTRY_COUNT)
  );
  const [winner, setWinner] = useState<string | null>(null);
  const [winnerColor, setWinnerColor] = useState<string>("#34a853");
  const [isSpinning, setIsSpinning] = useState(false);
  const [winnerHistory, setWinnerHistory] = useState<string[]>([]);
  const [isLandscape, setIsLandscape] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [showBear, setShowBear] = useState(false);
  const [csvError, setCsvError] = useState<string | null>(null);
  const csvInputRef = useRef<HTMLInputElement>(null);

  const handleNameChange = (index: number, value: string) => {
    setEntries((prev) =>
      prev.map((item, i) => (i === index ? { ...item, name: value } : item))
    );
  };

  const handleCountChange = (index: number, value: number) => {
    setEntries((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, count: clampSelectionCount(value) } : item
      )
    );
  };

  const handleAddMoreInputs = () => {
    setEntries((prev) => [...prev, ...createEmptyEntries(2)]);
  };

  const handleCsvUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file) {
      return;
    }

    if (file.size > 512 * 1024) {
      setCsvError("CSV must be smaller than 512 KB.");
      return;
    }

    try {
      const text = await readFileAsText(file);
      const result = parseNameCountCsv(text);

      if ("error" in result) {
        setCsvError(result.error);
        return;
      }

      setCsvError(null);
      setWinner(null);
      setEntries(result.entries);
    } catch {
      setCsvError("Could not read the CSV file.");
    }
  };

  const handleSpin = () => {
    if (expandEntriesToNames(entries).length < 2) return;
    setIsSpinning(true);
    setWinner(null);
  };

  const handleSpinComplete = useCallback((nextWinner: string, color: string) => {
    setWinner(nextWinner);
    setWinnerColor(color);
    setWinnerHistory((prev) => [nextWinner, ...prev]);
    setIsSpinning(false);
    setShowBear(true);
  }, []);

  const wheelNames = useMemo(() => expandEntriesToNames(entries), [entries]);
  const canSpin = wheelNames.length >= 2;

  return (
    <Container isLandscape={isLandscape} isDark={isDark}>
      <Header>
        <Logo>
          <svg
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient
                id="logoGradient1"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop
                  offset="0%"
                  style={{ stopColor: "#4A90E2", stopOpacity: 1 }}
                />
                <stop
                  offset="100%"
                  style={{ stopColor: "#50C878", stopOpacity: 1 }}
                />
              </linearGradient>
              <linearGradient
                id="logoGradient2"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop
                  offset="0%"
                  style={{ stopColor: "#50C878", stopOpacity: 1 }}
                />
                <stop
                  offset="100%"
                  style={{ stopColor: "#708090", stopOpacity: 1 }}
                />
              </linearGradient>
              <linearGradient
                id="logoGradient3"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop
                  offset="0%"
                  style={{ stopColor: "#708090", stopOpacity: 1 }}
                />
                <stop
                  offset="100%"
                  style={{ stopColor: "#87CEEB", stopOpacity: 1 }}
                />
              </linearGradient>
              <linearGradient
                id="logoGradient4"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop
                  offset="0%"
                  style={{ stopColor: "#87CEEB", stopOpacity: 1 }}
                />
                <stop
                  offset="100%"
                  style={{ stopColor: "#E57373", stopOpacity: 1 }}
                />
              </linearGradient>
              <filter id="logoShadow">
                <feDropShadow
                  dx="0"
                  dy="2"
                  stdDeviation="3"
                  floodOpacity="0.3"
                />
              </filter>
            </defs>
            {/* Outer circle */}
            <circle
              cx="50"
              cy="50"
              r="48"
              fill="white"
              opacity="0.2"
              filter="url(#logoShadow)"
            />
            {/* Wheel segments */}
            <path
              d="M 50 50 L 50 2 A 48 48 0 0 1 84 16 Z"
              fill="url(#logoGradient1)"
              stroke="white"
              strokeWidth="1.5"
            />
            <path
              d="M 50 50 L 84 16 A 48 48 0 0 1 98 50 Z"
              fill="url(#logoGradient2)"
              stroke="white"
              strokeWidth="1.5"
            />
            <path
              d="M 50 50 L 98 50 A 48 48 0 0 1 84 84 Z"
              fill="url(#logoGradient3)"
              stroke="white"
              strokeWidth="1.5"
            />
            <path
              d="M 50 50 L 84 84 A 48 48 0 0 1 50 98 Z"
              fill="url(#logoGradient4)"
              stroke="white"
              strokeWidth="1.5"
            />
            <path
              d="M 50 50 L 50 98 A 48 48 0 0 1 16 84 Z"
              fill="url(#logoGradient1)"
              stroke="white"
              strokeWidth="1.5"
            />
            <path
              d="M 50 50 L 16 84 A 48 48 0 0 1 2 50 Z"
              fill="url(#logoGradient2)"
              stroke="white"
              strokeWidth="1.5"
            />
            <path
              d="M 50 50 L 2 50 A 48 48 0 0 1 16 16 Z"
              fill="url(#logoGradient3)"
              stroke="white"
              strokeWidth="1.5"
            />
            <path
              d="M 50 50 L 16 16 A 48 48 0 0 1 50 2 Z"
              fill="url(#logoGradient4)"
              stroke="white"
              strokeWidth="1.5"
            />
            {/* Center circle */}
            <circle
              cx="50"
              cy="50"
              r="12"
              fill="white"
              stroke="rgba(0,0,0,0.2)"
              strokeWidth="1"
            />
            <circle cx="50" cy="50" r="6" fill="#4A90E2" />
          </svg>
        </Logo>
        <Title isDark={isDark} aria-label="Wheel of Names">
          Wheel of Names
        </Title>
        <ControlsGroup>
          <IconButton
            onClick={() => setIsLandscape(!isLandscape)}
            aria-label={
              isLandscape
                ? "Switch to portrait mode"
                : "Switch to landscape mode"
            }
            isDark={isDark}
          >
            {isLandscape ? (
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14z" />
                <path d="M7 7h10v10H7z" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14z" />
                <path d="M7 7h4v10H7zm6 0h4v10h-4z" />
              </svg>
            )}
          </IconButton>
          <IconButton
            onClick={() => setIsDark(!isDark)}
            aria-label={
              isDark ? "Switch to light theme" : "Switch to dark theme"
            }
            isDark={isDark}
          >
            {isDark ? (
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zM2 13h2c.55 0 1-.45 1-1s-.45-1-1-1H2c-.55 0-1 .45-1 1s.45 1 1 1zm18 0h2c.55 0 1-.45 1-1s-.45-1-1-1h-2c-.55 0-1 .45-1 1s.45 1 1 1zM11 2v2c0 .55.45 1 1 1s1-.45 1-1V2c0-.55-.45-1-1-1s-1 .45-1 1zm0 18v2c0 .55.45 1 1 1s1-.45 1-1v-2c0-.55-.45-1-1-1s-1 .45-1 1zM5.99 4.58c-.39-.39-1.03-.39-1.41 0-.39.39-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0s.39-1.03 0-1.41L5.99 4.58zm12.37 12.37c-.39-.39-1.03-.39-1.41 0-.39.39-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0 .39-.39.39-1.03 0-1.41l-1.06-1.06zm1.06-10.96c.39-.39.39-1.03 0-1.41-.39-.39-1.03-.39-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06zM7.05 18.36c.39-.39.39-1.03 0-1.41-.39-.39-1.03-.39-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06z" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9c0-.46-.04-.92-.1-1.36-.98 1.37-2.58 2.26-4.4 2.26-3.03 0-5.5-2.47-5.5-5.5 0-1.82.89-3.42 2.26-4.4-.44-.06-.9-.1-1.36-.1z" />
              </svg>
            )}
          </IconButton>
        </ControlsGroup>
      </Header>

      <MainContent isLandscape={isLandscape}>
        <InputSection isLandscape={isLandscape} isDark={isDark}>
          <InputsContainer>
            {entries
              .slice(0, Math.ceil(entries.length / 2))
              .map((entry, index) => (
                <NameRow
                  key={index}
                  entry={entry}
                  index={index}
                  isSpinning={isSpinning}
                  isDark={isDark}
                  onNameChange={handleNameChange}
                  onCountChange={handleCountChange}
                />
              ))}
          </InputsContainer>

          <ColumnSeparator className="separator" />

          <InputsContainer>
            {entries
              .slice(Math.ceil(entries.length / 2))
              .map((entry, index) => {
                const actualIndex = index + Math.ceil(entries.length / 2);
                return (
                  <NameRow
                    key={actualIndex}
                    entry={entry}
                    index={actualIndex}
                    isSpinning={isSpinning}
                    isDark={isDark}
                    onNameChange={handleNameChange}
                    onCountChange={handleCountChange}
                  />
                );
              })}
          </InputsContainer>

          <ActionsRow>
            <AddButton onClick={handleAddMoreInputs} disabled={isSpinning}>
              Add More Names
            </AddButton>
            <AddButton
              type="button"
              onClick={() => csvInputRef.current?.click()}
              disabled={isSpinning}
            >
              Upload CSV
            </AddButton>
            <input
              ref={csvInputRef}
              type="file"
              accept=".csv,text/csv,text/tab-separated-values"
              onChange={handleCsvUpload}
              hidden
              aria-label="Upload CSV of names and counts"
            />
          </ActionsRow>
          <CsvHint>
            CSV format: two columns, name and count. Header row optional.
          </CsvHint>
          {csvError && <CsvError role="alert">{csvError}</CsvError>}
        </InputSection>

        {canSpin && (
          <WheelSection isLandscape={isLandscape}>
            <Wheel
              names={wheelNames}
              isSpinning={isSpinning}
              onSpinComplete={handleSpinComplete}
            />
            <Button variant="spin" onClick={handleSpin} disabled={isSpinning}>
              {isSpinning ? "Spinning..." : "Spin the Wheel!"}
            </Button>

            {winner && (
              <WinnerDisplay backgroundColor={winnerColor}>
                <h2>🎉 Winner: {winner} 🎉</h2>
              </WinnerDisplay>
            )}
            {winnerHistory.length > 0 && (
              <HistoryDisplay>
                <HistoryTitle>Previous Winners</HistoryTitle>
                <HistoryList>
                  {winnerHistory.map((historyWinner, index) => {
                    const spinNumber = winnerHistory.length - index;
                    return (
                      <HistoryItem
                        key={`${spinNumber}-${historyWinner}`}
                        index={index}
                      >
                        {spinNumber}. {historyWinner}
                      </HistoryItem>
                    );
                  })}
                </HistoryList>
              </HistoryDisplay>
            )}
            {/* Dancing bear overlays the app when showBear is true. It auto-hides after animation via onAnimationEnd. */}
            <DancingBear
              visible={showBear}
              onAnimationEnd={() => setShowBear(false)}
            />
          </WheelSection>
        )}
      </MainContent>
    </Container>
  );
}

export default App;

import React, { useState } from 'react';
import styled from '@emotion/styled';
import './App.css';
import Wheel from './components/Wheel';

const Container = styled.div<{ isLandscape: boolean; isDark: boolean }>`
  text-align: center;
  padding: 1rem;
  max-width: ${props => props.isLandscape ? '1600px' : '1200px'};
  margin: 0 auto;
  min-height: 100vh;
  background-color: ${props => props.isDark ? '#1a1a1a' : '#ffffff'};
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  color: ${props => props.isDark ? '#ffffff' : '#000000'};
  transition: background-color 0.3s ease, color 0.3s ease;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;

  @media (max-width: 768px) {
    margin-bottom: 1rem;
  }
`;

const Title = styled.h1<{ isDark: boolean }>`
  color: #1a73e8;
  font-size: 2.5rem;
  
  @media (max-width: 768px) {
    font-size: 2rem;
  }

  font-weight: 700;
  background: ${props => props.isDark ? 
    'linear-gradient(135deg, #60a5fa, #3b82f6)' : 
    'linear-gradient(135deg, #1a73e8, #4285f4)'};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  letter-spacing: -0.02em;
  margin: 0;
`;

const ControlsGroup = styled.div`
  display: flex;
  gap: 0.5rem;
  align-items: center;
`;

const IconButton = styled.button<{ isDark?: boolean }>`
  padding: 0.5rem;
  background: ${props => props.isDark ? '#2d2d2d' : '#f8f9fa'};
  border: 2px solid ${props => props.isDark ? '#404040' : '#e8eaed'};
  border-radius: 12px;
  cursor: pointer;
  color: ${props => props.isDark ? '#e0e0e0' : '#5f6368'};
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  width: 40px;
  height: 40px;

  &:hover {
    background: ${props => props.isDark ? '#404040' : '#f1f3f4'};
    border-color: ${props => props.isDark ? '#525252' : '#dadce0'};
  }

  svg {
    width: 20px;
    height: 20px;
  }
`;

const MainContent = styled.div<{ isLandscape: boolean }>`
  display: ${props => props.isLandscape ? 'grid' : 'flex'};
  ${props => props.isLandscape ? `
    grid-template-columns: 1fr 1fr;
    gap: 2rem;
    align-items: start;
  ` : `
    flex-direction: column;
    gap: 1.5rem;
  `}
`;

const InputSection = styled.div<{ isLandscape: boolean; isDark: boolean }>`
  max-width: ${props => props.isLandscape ? 'none' : '900px'};
  margin: ${props => props.isLandscape ? '0 auto 3rem' : '0 auto'};
  padding: 1.5rem;
  background: ${props => props.isDark ? '#2d2d2d' : '#ffffff'};
  border-radius: 16px;
  box-shadow: 0 4px 20px ${props => props.isDark ? 'rgba(0, 0, 0, 0.3)' : 'rgba(0, 0, 0, 0.08)'};
  display: grid;
  grid-template-columns: 1fr 1px 1fr;
  gap: 0;
  align-items: start;
  transition: background-color 0.3s ease, box-shadow 0.3s ease;

  @media (max-width: 768px) {
    padding: 1rem;
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
  ${props => props.isLandscape && `
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
    #e8eaed 10%,
    #e8eaed 90%,
    transparent
  );
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
  border: 2px solid ${props => props.isDark ? '#404040' : '#e8eaed'};
  border-radius: 12px;
  font-size: 1rem;
  transition: all 0.2s ease;
  background: ${props => props.isDark ? '#1a1a1a' : '#f8f9fa'};
  color: ${props => props.isDark ? '#ffffff' : 'inherit'};

  &:focus {
    outline: none;
    border-color: #1a73e8;
    background: ${props => props.isDark ? '#2d2d2d' : '#ffffff'};
    box-shadow: 0 0 0 4px rgba(26, 115, 232, 0.1);
  }

  &:disabled {
    background-color: ${props => props.isDark ? '#262626' : '#f1f3f4'};
    cursor: not-allowed;
  }
`;

const NameInput = styled(Input)`
  width: 100%;
`;

const CountInput = styled(Input)`
  width: 80px;
  text-align: center;
  /* Remove default number input spinners */
  &::-webkit-inner-spin-button,
  &::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  &[type=number] {
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
  padding: 0.25rem;
  background: ${props => props.isDark ? '#404040' : '#f1f3f4'};
  border: none;
  border-radius: 6px;
  color: ${props => props.isDark ? '#e0e0e0' : '#5f6368'};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  transition: all 0.2s ease;
  z-index: 1;

  &:hover {
    background: ${props => props.isDark ? '#525252' : '#e8eaed'};
  }

  &:active {
    transform: scale(0.95);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  svg {
    width: 16px;
    height: 16px;
  }

  &.decrease {
    left: 6px;
  }

  &.increase {
    right: 6px;
  }
`;

const InputLabel = styled.span`
  color: #5f6368;
  font-size: 0.75rem;
  font-weight: 500;
  position: absolute;
  top: -18px;
  left: 12px;
`;

const Button = styled.button<{ variant?: 'primary' | 'spin' }>`
  padding: ${props => props.variant === 'spin' ? '0.875rem 1.75rem' : '0.75rem 1.25rem'};
  background: ${props => {
    if (props.variant === 'spin') {
      return 'linear-gradient(135deg, #34a853 0%, #1e8e3e 100%)';
    }
    return 'linear-gradient(135deg, #1a73e8 0%, #1557b0 100%)';
  }};
  color: white;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  font-size: ${props => props.variant === 'spin' ? '1.125rem' : '1rem'};
  font-weight: 600;
  transition: all 0.2s ease;
  box-shadow: 0 2px 6px ${props => props.variant === 'spin' ? 'rgba(30, 142, 62, 0.3)' : 'rgba(26, 115, 232, 0.3)'};
  margin: 1rem auto;
  display: block;
  letter-spacing: 0.01em;

  @media (max-width: 768px) {
    padding: ${props => props.variant === 'spin' ? '0.75rem 1.5rem' : '0.625rem 1rem'};
    font-size: ${props => props.variant === 'spin' ? '1rem' : '0.875rem'};
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px ${props => props.variant === 'spin' ? 'rgba(30, 142, 62, 0.4)' : 'rgba(26, 115, 232, 0.4)'};
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    background: #dadce0;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

const AddButton = styled(Button)`
  grid-column: 1 / -1;
  width: fit-content;
  margin: 1rem auto 0;
`;

const WinnerDisplay = styled.div`
  margin-top: 1.5rem;
  padding: 1.25rem;
  background: linear-gradient(135deg, #34a853 0%, #1e8e3e 100%);
  color: white;
  border-radius: 16px;
  animation: fadeIn 0.5s ease;
  box-shadow: 0 4px 20px rgba(30, 142, 62, 0.2);

  h2 {
    font-size: 1.5rem;
    margin: 0;
    font-weight: 600;
    letter-spacing: -0.01em;
  }

  @media (max-width: 768px) {
    margin-top: 1rem;
    padding: 1rem;
    
    h2 {
      font-size: 1.25rem;
    }
  }

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;

const HistoryDisplay = styled.div`
  margin-top: 1.5rem;
  padding: 1.25rem;
  background: #f8f9fa;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);

  @media (max-width: 768px) {
    margin-top: 1rem;
    padding: 1rem;
  }
`;

const HistoryTitle = styled.h3`
  color: #5f6368;
  margin: 0 0 1rem 0;
  font-size: 1.125rem;
  font-weight: 500;
  letter-spacing: -0.01em;
`;

const HistoryList = styled.div`
  display: flex;
  gap: 0.75rem;
  flex-direction: column;
`;

const HistoryItem = styled.div<{ index: number }>`
  padding: 1rem 1.25rem;
  background: ${props => {
    const colors = [
      'linear-gradient(135deg, #34a853 0%, #1e8e3e 100%)',
      'linear-gradient(135deg, #1a73e8 0%, #1557b0 100%)',
      'linear-gradient(135deg, #fbbc04 0%, #f29900 100%)'
    ];
    return colors[props.index] || '#e8eaed';
  }};
  color: ${props => props.index === 2 ? '#202124' : 'white'};
  border-radius: 12px;
  font-size: 1rem;
  opacity: ${props => 1 - props.index * 0.1};
  transform: scale(${props => 1 - props.index * 0.02});
  transition: all 0.2s ease;
  box-shadow: 0 2px 8px ${props => {
    const shadows = [
      'rgba(30, 142, 62, 0.2)',
      'rgba(26, 115, 232, 0.2)',
      'rgba(251, 188, 4, 0.2)'
    ];
    return shadows[props.index] || 'rgba(0, 0, 0, 0.1)';
  }};

  &:hover {
    transform: scale(${props => (1 - props.index * 0.02) * 1.02});
  }
`;

interface NameEntry {
  name: string;
  count: number;
}

function App() {
  const [entries, setEntries] = useState<NameEntry[]>(
    Array(10).fill({ name: '', count: 1 })
  );
  const [winner, setWinner] = useState<string | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [winnerHistory, setWinnerHistory] = useState<string[]>([]);
  const [isLandscape, setIsLandscape] = useState(false);
  const [isDark, setIsDark] = useState(false);

  const handleInputChange = (
    index: number,
    field: 'name' | 'count',
    value: string
  ) => {
    setEntries(prev => prev.map((item, i) => {
      if (i === index) {
        if (field === 'count') {
          const count = parseInt(value) || 1;
          return { ...item, count: Math.max(1, Math.min(10, count)) };
        }
        return { ...item, [field]: value };
      }
      return item;
    }));
  };

  const handleCountChange = (index: number, value: number) => {
    setEntries(prev => prev.map((item, i) => {
      if (i === index) {
        return { ...item, count: Math.max(1, Math.min(10, value)) };
      }
      return item;
    }));
  };

  const handleAddMoreInputs = () => {
    if (entries.length < 30) {
      setEntries(prev => [...prev, { name: '', count: 1 }, { name: '', count: 1 }]);
    }
  };

  const getValidNames = () => {
    return entries
      .filter(entry => entry.name.trim() !== '')
      .flatMap(entry => Array(entry.count).fill(entry.name));
  };

  const handleSpin = () => {
    const validNames = getValidNames();
    if (validNames.length < 2) return;
    setIsSpinning(true);
    setWinner(null);
  };

  const handleSpinComplete = (winner: string) => {
    setWinner(winner);
    setWinnerHistory(prev => [winner, ...prev.slice(0, 2)]);
    setIsSpinning(false);
  };

  const validNames = getValidNames();

  return (
    <Container isLandscape={isLandscape} isDark={isDark}>
      <Header>
        <Title isDark={isDark}>Wheel of Names</Title>
        <ControlsGroup>
          <IconButton 
            onClick={() => setIsLandscape(!isLandscape)}
            aria-label={isLandscape ? "Switch to portrait mode" : "Switch to landscape mode"}
            isDark={isDark}
          >
            {isLandscape ? (
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14z"/>
                <path d="M7 7h10v10H7z"/>
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14z"/>
                <path d="M7 7h4v10H7zm6 0h4v10h-4z"/>
              </svg>
            )}
          </IconButton>
          <IconButton
            onClick={() => setIsDark(!isDark)}
            aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
            isDark={isDark}
          >
            {isDark ? (
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zM2 13h2c.55 0 1-.45 1-1s-.45-1-1-1H2c-.55 0-1 .45-1 1s.45 1 1 1zm18 0h2c.55 0 1-.45 1-1s-.45-1-1-1h-2c-.55 0-1 .45-1 1s.45 1 1 1zM11 2v2c0 .55.45 1 1 1s1-.45 1-1V2c0-.55-.45-1-1-1s-1 .45-1 1zm0 18v2c0 .55.45 1 1 1s1-.45 1-1v-2c0-.55-.45-1-1-1s-1 .45-1 1zM5.99 4.58c-.39-.39-1.03-.39-1.41 0-.39.39-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0s.39-1.03 0-1.41L5.99 4.58zm12.37 12.37c-.39-.39-1.03-.39-1.41 0-.39.39-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0 .39-.39.39-1.03 0-1.41l-1.06-1.06zm1.06-10.96c.39-.39.39-1.03 0-1.41-.39-.39-1.03-.39-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06zM7.05 18.36c.39-.39.39-1.03 0-1.41-.39-.39-1.03-.39-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06z"/>
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9c0-.46-.04-.92-.1-1.36-.98 1.37-2.58 2.26-4.4 2.26-3.03 0-5.5-2.47-5.5-5.5 0-1.82.89-3.42 2.26-4.4-.44-.06-.9-.1-1.36-.1z"/>
              </svg>
            )}
          </IconButton>
        </ControlsGroup>
      </Header>

      <MainContent isLandscape={isLandscape}>
        <InputSection isLandscape={isLandscape} isDark={isDark}>
          <InputsContainer>
            {entries.slice(0, Math.ceil(entries.length / 2)).map((entry, index) => (
              <InputWrapper key={index}>
                <InputGroup>
                  <div style={{ position: 'relative', flex: 1 }}>
                    <InputLabel>Name</InputLabel>
                    <NameInput
                      type="text"
                      value={entry.name}
                      onChange={(e) => handleInputChange(index, 'name', e.target.value)}
                      placeholder="Enter name"
                      disabled={isSpinning}
                      isDark={isDark}
                    />
                  </div>
                  <CountInputWrapper>
                    <InputLabel>Count</InputLabel>
                    <CountInput
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      value={entry.count}
                      onChange={(e) => {
                        const value = e.target.value.replace(/[^0-9]/g, '');
                        if (value === '') {
                          handleCountChange(index, 1);
                        } else {
                          handleCountChange(index, parseInt(value));
                        }
                      }}
                      disabled={isSpinning}
                      isDark={isDark}
                    />
                    <CountButton
                      className="decrease"
                      onClick={() => handleCountChange(index, entry.count - 1)}
                      disabled={entry.count <= 1 || isSpinning}
                      isDark={isDark}
                      aria-label="Decrease count"
                    >
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M19 13H5v-2h14v2z"/>
                      </svg>
                    </CountButton>
                    <CountButton
                      className="increase"
                      onClick={() => handleCountChange(index, entry.count + 1)}
                      disabled={entry.count >= 10 || isSpinning}
                      isDark={isDark}
                      aria-label="Increase count"
                    >
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
                      </svg>
                    </CountButton>
                  </CountInputWrapper>
                </InputGroup>
              </InputWrapper>
            ))}
          </InputsContainer>

          <ColumnSeparator className="separator" />

          <InputsContainer>
            {entries.slice(Math.ceil(entries.length / 2)).map((entry, index) => (
              <InputWrapper key={index + Math.ceil(entries.length / 2)}>
                <InputGroup>
                  <div style={{ position: 'relative', flex: 1 }}>
                    <InputLabel>Name</InputLabel>
                    <NameInput
                      type="text"
                      value={entry.name}
                      onChange={(e) => handleInputChange(index + Math.ceil(entries.length / 2), 'name', e.target.value)}
                      placeholder="Enter name"
                      disabled={isSpinning}
                      isDark={isDark}
                    />
                  </div>
                  <CountInputWrapper>
                    <InputLabel>Count</InputLabel>
                    <CountInput
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      value={entry.count}
                      onChange={(e) => {
                        const value = e.target.value.replace(/[^0-9]/g, '');
                        if (value === '') {
                          handleCountChange(index + Math.ceil(entries.length / 2), 1);
                        } else {
                          handleCountChange(index + Math.ceil(entries.length / 2), parseInt(value));
                        }
                      }}
                      disabled={isSpinning}
                      isDark={isDark}
                    />
                    <CountButton
                      className="decrease"
                      onClick={() => handleCountChange(index + Math.ceil(entries.length / 2), entry.count - 1)}
                      disabled={entry.count <= 1 || isSpinning}
                      isDark={isDark}
                      aria-label="Decrease count"
                    >
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M19 13H5v-2h14v2z"/>
                      </svg>
                    </CountButton>
                    <CountButton
                      className="increase"
                      onClick={() => handleCountChange(index + Math.ceil(entries.length / 2), entry.count + 1)}
                      disabled={entry.count >= 10 || isSpinning}
                      isDark={isDark}
                      aria-label="Increase count"
                    >
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
                      </svg>
                    </CountButton>
                  </CountInputWrapper>
                </InputGroup>
              </InputWrapper>
            ))}
          </InputsContainer>

          {entries.length < 30 && (
            <AddButton 
              onClick={handleAddMoreInputs} 
              disabled={isSpinning}
            >
              Add More Names
            </AddButton>
          )}
        </InputSection>

        {validNames.length >= 2 && (
          <WheelSection isLandscape={isLandscape}>
            <Wheel
              names={validNames}
              isSpinning={isSpinning}
              onSpinComplete={handleSpinComplete}
            />
            <Button 
              variant="spin" 
              onClick={handleSpin}
              disabled={isSpinning}
            >
              {isSpinning ? 'Spinning...' : 'Spin the Wheel!'}
            </Button>

            {winner && (
              <>
                <WinnerDisplay>
                  <h2>🎉 Winner: {winner} 🎉</h2>
                </WinnerDisplay>
                {winnerHistory.length > 1 && (
                  <HistoryDisplay>
                    <HistoryTitle>Previous Winners:</HistoryTitle>
                    <HistoryList>
                      {winnerHistory.map((historyWinner, index) => (
                        index > 0 && (
                          <HistoryItem key={index} index={index}>
                            {index === 1 ? '2nd' : '3rd'} last winner: {historyWinner}
                          </HistoryItem>
                        )
                      ))}
                    </HistoryList>
                  </HistoryDisplay>
                )}
              </>
            )}
          </WheelSection>
        )}
      </MainContent>
    </Container>
  );
}

export default App;

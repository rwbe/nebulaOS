import { useState } from 'react';
import { Delete } from 'lucide-react';

export const CalculatorApp = () => {
  const [display, setDisplay] = useState('0');
  const [previousValue, setPreviousValue] = useState<number | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [shouldResetDisplay, setShouldResetDisplay] = useState(false);

  const handleNumber = (num: string) => {
    if (shouldResetDisplay) {
      setDisplay(num);
      setShouldResetDisplay(false);
    } else {
      setDisplay(display === '0' ? num : display + num);
    }
  };

  const handleOperation = (op: string) => {
    const current = parseFloat(display);
    
    if (previousValue !== null && operation) {
      const result = calculate(previousValue, current, operation);
      setDisplay(result.toString());
      setPreviousValue(result);
    } else {
      setPreviousValue(current);
    }
    
    setOperation(op);
    setShouldResetDisplay(true);
  };

  const calculate = (a: number, b: number, op: string): number => {
    switch (op) {
      case '+': return a + b;
      case '-': return a - b;
      case '×': return a * b;
      case '÷': return a / b;
      default: return b;
    }
  };

  const handleEquals = () => {
    if (previousValue !== null && operation) {
      const current = parseFloat(display);
      const result = calculate(previousValue, current, operation);
      setDisplay(result.toString());
      setPreviousValue(null);
      setOperation(null);
      setShouldResetDisplay(true);
    }
  };

  const handleClear = () => {
    setDisplay('0');
    setPreviousValue(null);
    setOperation(null);
    setShouldResetDisplay(false);
  };

  const handleDecimal = () => {
    if (!display.includes('.')) {
      setDisplay(display + '.');
    }
  };

  const buttons = [
    ['C', '±', '%', '÷'],
    ['7', '8', '9', '×'],
    ['4', '5', '6', '-'],
    ['1', '2', '3', '+'],
    ['0', '.', '='],
  ];

  return (
    <div className="flex flex-col h-full bg-[hsl(var(--window-bg))] p-4">
      <div className="mb-4">
        <div className="text-right text-4xl font-light p-6 bg-[hsl(var(--window-titlebar))] rounded-lg border border-border">
          {display}
        </div>
      </div>

      <div className="flex-1 grid grid-cols-4 gap-2">
        {buttons.flat().map((btn, idx) => {
          const isOperation = ['÷', '×', '-', '+', '='].includes(btn);
          const isSpecial = ['C', '±', '%'].includes(btn);
          const isZero = btn === '0';
          
          return (
            <button
              key={idx}
              onClick={() => {
                if (btn === 'C') handleClear();
                else if (btn === '=') handleEquals();
                else if (btn === '.') handleDecimal();
                else if (isOperation) handleOperation(btn);
                else if (!isSpecial) handleNumber(btn);
              }}
              className={`
                rounded-lg font-medium text-lg transition-all hover:scale-105 active:scale-95
                ${isZero ? 'col-span-2' : ''}
                ${isOperation 
                  ? 'bg-primary text-primary-foreground hover:bg-primary/90' 
                  : isSpecial
                    ? 'bg-muted hover:bg-muted/80'
                    : 'bg-card hover:bg-muted border border-border'
                }
              `}
            >
              {btn}
            </button>
          );
        })}
      </div>
    </div>
  );
};

import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [currentOperand, setCurrentOperand] = useState('0');
  const [previousOperand, setPreviousOperand] = useState('');
  const [operation, setOperation] = useState(undefined);

  const appendNumber = (number) => {
    if (number === '.' && currentOperand.includes('.')) return;
    if (currentOperand === '0' && number !== '.') {
      setCurrentOperand(number);
    } else {
      setCurrentOperand(prev => prev.toString() + number.toString());
    }
  };

  const appendOperator = (op) => {
    if (currentOperand === '' && op === '-') {
      setCurrentOperand('-');
      return;
    }
    if (currentOperand === '' && currentOperand !== '-') return;

    if (previousOperand !== '') {
      computeState(previousOperand, currentOperand, operation, op);
    } else {
      setOperation(op);
      setPreviousOperand(currentOperand);
      setCurrentOperand('');
    }
  };

  const computeState = (prevStr, currentStr, currentOp, nextOp = undefined) => {
    let computation;
    const prev = parseFloat(prevStr);
    const current = parseFloat(currentStr);
    if (isNaN(prev) || isNaN(current)) return;

    switch (currentOp) {
      case '+':
        computation = prev + current;
        break;
      case '-':
        computation = prev - current;
        break;
      case '*':
        computation = prev * current;
        break;
      case '/':
        computation = current === 0 ? 'Error' : prev / current;
        break;
      case '%':
        computation = prev % current;
        break;
      default:
        return;
    }
    computation = Math.round(computation * 100000000) / 100000000;

    if (nextOp !== undefined) {
      setPreviousOperand(computation.toString());
      setOperation(nextOp);
      setCurrentOperand('');
    } else {
      setCurrentOperand(computation.toString());
      setOperation(undefined);
      setPreviousOperand('');
    }
  };

  const compute = () => {
    if (previousOperand === '' || currentOperand === '') return;
    computeState(previousOperand, currentOperand, operation);
  };

  const clearDisplay = () => {
    setCurrentOperand('0');
    setPreviousOperand('');
    setOperation(undefined);
  };

  const deleteNumber = () => {
    if (currentOperand === 'Error') {
      clearDisplay();
      return;
    }
    if (currentOperand.length === 1 || (currentOperand.length === 2 && currentOperand.startsWith('-'))) {
      setCurrentOperand('0');
    } else {
      setCurrentOperand(prev => prev.toString().slice(0, -1));
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key >= '0' && e.key <= '9') appendNumber(e.key);
      if (e.key === '.') appendNumber('.');
      if (e.key === '=' || e.key === 'Enter') {
        e.preventDefault();
        compute();
      }
      if (e.key === 'Backspace') deleteNumber();
      if (e.key === 'Escape') clearDisplay();
      if (['+', '-', '*', '/', '%'].includes(e.key)) appendOperator(e.key);
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [currentOperand, previousOperand, operation]);

  return (
    <div className="calculator">
      <div className="display">
        <div className="previous-operand">
          {previousOperand} {operation && (operation === '/' ? '÷' : operation === '*' ? '×' : operation === '-' ? '−' : operation)}
        </div>
        <div className="current-operand">{currentOperand}</div>
      </div>
      <div className="buttons">
        <button className="operator" onClick={clearDisplay}>AC</button>
        <button className="operator" onClick={deleteNumber}>DEL</button>
        <button className="operator" onClick={() => appendOperator('%')}>%</button>
        <button className="operator" onClick={() => appendOperator('/')}>÷</button>

        <button onClick={() => appendNumber('7')}>7</button>
        <button onClick={() => appendNumber('8')}>8</button>
        <button onClick={() => appendNumber('9')}>9</button>
        <button className="operator" onClick={() => appendOperator('*')}>×</button>

        <button onClick={() => appendNumber('4')}>4</button>
        <button onClick={() => appendNumber('5')}>5</button>
        <button onClick={() => appendNumber('6')}>6</button>
        <button className="operator" onClick={() => appendOperator('-')}>−</button>

        <button onClick={() => appendNumber('1')}>1</button>
        <button onClick={() => appendNumber('2')}>2</button>
        <button onClick={() => appendNumber('3')}>3</button>
        <button className="operator" onClick={() => appendOperator('+')}>+</button>

        <button onClick={() => appendNumber('0')} className="span-two">0</button>
        <button onClick={() => appendNumber('.')}>.</button>
        <button className="equals" onClick={compute}>=</button>
      </div>
    </div>
  );
}

export default App;

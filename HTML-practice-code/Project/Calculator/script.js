/**
 * NEXUS CALC - Production Calculator Engine
 * State-based evaluation, precision math normalization, and accessible input handling.
 */

'use strict';

// -------------------------------------------------------------------------
// 1. Core Mathematical Operations
// -------------------------------------------------------------------------
const MathOperations = {
  add: (a, b) => a + b,
  sub: (a, b) => a - b,
  mul: (a, b) => a * b,
  div: (a, b) => (b === 0 ? 'CANNOT_DIVIDE_BY_ZERO' : a / b),

  calculate(a, b, op) {
    switch (op) {
      case '+':
        return this.add(a, b);
      case '−':
      case '-':
        return this.sub(a, b);
      case '×':
      case '*':
        return this.mul(a, b);
      case '÷':
      case '/':
        return this.div(a, b);
      default:
        return 'INVALID_OPERATION';
    }
  }
};

// -------------------------------------------------------------------------
// 2. State Management
// -------------------------------------------------------------------------
const calculatorState = {
  currentValue: '0',
  previousValue: null,
  activeOperator: null,
  expressionLine: '',
  awaitingNextNumber: false,
  hasError: false
};

// -------------------------------------------------------------------------
// 3. Precision & Formatting Helpers
// -------------------------------------------------------------------------
/**
 * Normalizes floating point numbers to prevent representation errors like 0.1 + 0.2
 * @param {number} num 
 * @returns {string} Clean string representation
 */
function roundResult(num) {
  if (!Number.isFinite(num)) return 'Error';
  // Use a precision factor of 10 digits
  const factor = 1e10;
  const rounded = Math.round(num * factor) / factor;
  
  // Format for display: avoid scientific notation unless magnitude is extreme
  if (Math.abs(rounded) >= 1e12 || (Math.abs(rounded) > 0 && Math.abs(rounded) < 1e-6)) {
    return rounded.toExponential(6).replace(/\+/, '');
  }
  return rounded.toString();
}

/**
 * Adds thousands separators for integers while leaving trailing decimals unformatted.
 */
function formatNumberForDisplay(numStr) {
  if (numStr === 'Error' || numStr === 'Cannot divide by 0') return numStr;
  if (numStr.includes('e')) return numStr;

  const parts = numStr.split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return parts.length > 1 ? `${parts[0]}.${parts[1]}` : parts[0];
}

// -------------------------------------------------------------------------
// 4. DOM Elements
// -------------------------------------------------------------------------
const DOM = {
  mainDisplay: document.getElementById('mainDisplay'),
  expressionDisplay: document.getElementById('expressionDisplay'),
  calcScreen: document.querySelector('.calc-screen'),
  keypad: document.querySelector('.calc-keypad'),
  operatorButtons: document.querySelectorAll('.btn-operator')
};

// -------------------------------------------------------------------------
// 5. UI Updates
// -------------------------------------------------------------------------
function updateDisplay() {
  if (calculatorState.hasError) {
    DOM.mainDisplay.textContent = calculatorState.currentValue;
    DOM.expressionDisplay.innerHTML = '&nbsp;';
    DOM.calcScreen.classList.add('error');
    triggerErrorShake();
    return;
  }

  DOM.calcScreen.classList.remove('error');
  DOM.mainDisplay.textContent = formatNumberForDisplay(calculatorState.currentValue);
  
  if (calculatorState.expressionLine) {
    DOM.expressionDisplay.textContent = calculatorState.expressionLine;
  } else {
    DOM.expressionDisplay.innerHTML = '&nbsp;';
  }

  // Update active operator visual state
  DOM.operatorButtons.forEach((btn) => {
    if (
      calculatorState.activeOperator &&
      btn.dataset.op === calculatorState.activeOperator &&
      calculatorState.awaitingNextNumber
    ) {
      btn.classList.add('is-active');
    } else {
      btn.classList.remove('is-active');
    }
  });

  // Ensure scroll is visible on long entries
  DOM.mainDisplay.scrollLeft = DOM.mainDisplay.scrollWidth;
}

function triggerErrorShake() {
  DOM.calcScreen.classList.remove('shake');
  // Trigger DOM reflow to restart CSS animation
  void DOM.calcScreen.offsetWidth;
  DOM.calcScreen.classList.add('shake');
}

// -------------------------------------------------------------------------
// 6. Action Handlers
// -------------------------------------------------------------------------
function inputDigit(digit) {
  if (calculatorState.hasError) {
    resetAll();
  }

  if (calculatorState.awaitingNextNumber) {
    calculatorState.currentValue = digit;
    calculatorState.awaitingNextNumber = false;
  } else {
    if (calculatorState.currentValue === '0') {
      calculatorState.currentValue = digit;
    } else {
      // Impose a sensible digit limit
      if (calculatorState.currentValue.replace(/[^0-9]/g, '').length >= 14) return;
      calculatorState.currentValue += digit;
    }
  }
  updateDisplay();
}

function inputDecimal() {
  if (calculatorState.hasError) resetAll();

  if (calculatorState.awaitingNextNumber) {
    calculatorState.currentValue = '0.';
    calculatorState.awaitingNextNumber = false;
    updateDisplay();
    return;
  }

  if (!calculatorState.currentValue.includes('.')) {
    calculatorState.currentValue += '.';
    updateDisplay();
  }
}

function handleOperator(op) {
  if (calculatorState.hasError) return;

  const currentNum = Number(calculatorState.currentValue);

  // If operator is already pressed and user is changing mind before entering a new number
  if (calculatorState.activeOperator && calculatorState.awaitingNextNumber) {
    calculatorState.activeOperator = op;
    calculatorState.expressionLine = `${formatNumberForDisplay(calculatorState.previousValue.toString())} ${op}`;
    updateDisplay();
    return;
  }

  if (calculatorState.previousValue === null) {
    calculatorState.previousValue = currentNum;
  } else if (calculatorState.activeOperator) {
    const outcome = MathOperations.calculate(
      calculatorState.previousValue,
      currentNum,
      calculatorState.activeOperator
    );

    if (outcome === 'CANNOT_DIVIDE_BY_ZERO') {
      handleCalculationError('Cannot divide by 0');
      return;
    }

    const roundedVal = Number(roundResult(outcome));
    calculatorState.previousValue = roundedVal;
    calculatorState.currentValue = roundedVal.toString();
  }

  calculatorState.activeOperator = op;
  calculatorState.expressionLine = `${formatNumberForDisplay(calculatorState.previousValue.toString())} ${op}`;
  calculatorState.awaitingNextNumber = true;
  updateDisplay();
}

function executeEquals() {
  if (calculatorState.hasError || !calculatorState.activeOperator || calculatorState.previousValue === null) {
    return;
  }

  const currentNum = Number(calculatorState.currentValue);
  const operator = calculatorState.activeOperator;
  const prevNum = calculatorState.previousValue;

  const result = MathOperations.calculate(prevNum, currentNum, operator);

  if (result === 'CANNOT_DIVIDE_BY_ZERO') {
    handleCalculationError('Cannot divide by 0');
    return;
  }

  const formattedResult = roundResult(result);

  calculatorState.expressionLine = `${formatNumberForDisplay(prevNum.toString())} ${operator} ${formatNumberForDisplay(currentNum.toString())} =`;
  calculatorState.currentValue = formattedResult;
  calculatorState.previousValue = null;
  calculatorState.activeOperator = null;
  calculatorState.awaitingNextNumber = true;
  updateDisplay();
}

function handlePercent() {
  if (calculatorState.hasError) return;

  const current = Number(calculatorState.currentValue);
  if (Number.isNaN(current)) return;

  let calculated;
  if (calculatorState.previousValue !== null && calculatorState.activeOperator) {
    // Relative percentage (e.g., 200 + 10% = 200 + 20)
    calculated = (calculatorState.previousValue * current) / 100;
  } else {
    // Direct percentage (e.g., 50% = 0.5)
    calculated = current / 100;
  }

  calculatorState.currentValue = roundResult(calculated);
  updateDisplay();
}

function toggleSign() {
  if (calculatorState.hasError || calculatorState.currentValue === '0') return;

  if (calculatorState.currentValue.startsWith('-')) {
    calculatorState.currentValue = calculatorState.currentValue.slice(1);
  } else {
    calculatorState.currentValue = '-' + calculatorState.currentValue;
  }
  updateDisplay();
}

function deleteLastChar() {
  if (calculatorState.hasError) {
    resetAll();
    return;
  }

  if (calculatorState.awaitingNextNumber) return;

  if (
    calculatorState.currentValue.length === 1 ||
    (calculatorState.currentValue.length === 2 && calculatorState.currentValue.startsWith('-'))
  ) {
    calculatorState.currentValue = '0';
  } else {
    calculatorState.currentValue = calculatorState.currentValue.slice(0, -1);
  }
  updateDisplay();
}

function resetAll() {
  calculatorState.currentValue = '0';
  calculatorState.previousValue = null;
  calculatorState.activeOperator = null;
  calculatorState.expressionLine = '';
  calculatorState.awaitingNextNumber = false;
  calculatorState.hasError = false;
  updateDisplay();
}

function handleCalculationError(message) {
  calculatorState.currentValue = message;
  calculatorState.previousValue = null;
  calculatorState.activeOperator = null;
  calculatorState.expressionLine = '';
  calculatorState.hasError = true;
  updateDisplay();
}

// -------------------------------------------------------------------------
// 7. Event Dispatcher
// -------------------------------------------------------------------------
DOM.keypad.addEventListener('click', (e) => {
  const btn = e.target.closest('button');
  if (!btn) return;

  const { num, op, action } = btn.dataset;

  if (num !== undefined) {
    inputDigit(num);
  } else if (op !== undefined) {
    handleOperator(op);
  } else if (action !== undefined) {
    switch (action) {
      case 'clear':
        resetAll();
        break;
      case 'delete':
        deleteLastChar();
        break;
      case 'equals':
        executeEquals();
        break;
      case 'decimal':
        inputDecimal();
        break;
      case 'negate':
        toggleSign();
        break;
      case 'percent':
        handlePercent();
        break;
    }
  }
});

// -------------------------------------------------------------------------
// 8. Keyboard Accessibility
// -------------------------------------------------------------------------
window.addEventListener('keydown', (e) => {
  // Prevent spacebar from triggering unexpected scroll/button click
  if (e.key === ' ') {
    e.preventDefault();
    return;
  }

  if (e.key >= '0' && e.key <= '9') {
    inputDigit(e.key);
  } else if (e.key === '.') {
    inputDecimal();
  } else if (e.key === '+' || e.key === '-') {
    handleOperator(e.key === '-' ? '−' : '+');
  } else if (e.key === '*') {
    handleOperator('×');
  } else if (e.key === '/') {
    e.preventDefault(); // Prevent Firefox quick-find shortcut
    handleOperator('÷');
  } else if (e.key === 'Enter' || e.key === '=') {
    e.preventDefault();
    executeEquals();
  } else if (e.key === 'Backspace') {
    deleteLastChar();
  } else if (e.key === 'Escape') {
    resetAll();
  } else if (e.key === '%') {
    handlePercent();
  }
});

// Initialization
updateDisplay();
console.log('NEXUS CALC Engine initialized ✓');
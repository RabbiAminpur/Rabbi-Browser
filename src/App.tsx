import React, { useState, useEffect, useCallback } from 'react';
import { 
  History, 
  Settings, 
  Trash2, 
  Moon, 
  Sun, 
  RotateCcw, 
  ChevronRight,
  Calculator,
  FlaskConical,
  Ruler,
  Clock
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

type Mode = 'standard' | 'scientific' | 'converter';

interface HistoryItem {
  expression: string;
  result: string;
  timestamp: number;
}

const CONVERSIONS = {
  length: [
    { name: 'CM to Inch', factor: 0.393701 },
    { name: 'Inch to CM', factor: 2.54 },
    { name: 'M to Feet', factor: 3.28084 },
    { name: 'Feet to M', factor: 0.3048 },
  ],
  weight: [
    { name: 'KG to LBS', factor: 2.20462 },
    { name: 'LBS to KG', factor: 0.453592 },
  ]
};

export default function App() {
  const [display, setDisplay] = useState('0');
  const [expression, setExpression] = useState('');
  const [mode, setMode] = useState<Mode>('standard');
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [isDark, setIsDark] = useState(false);

  // Load history from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('omni_calc_history');
    if (saved) setHistory(JSON.parse(saved));
  }, []);

  // Save history to localStorage
  useEffect(() => {
    localStorage.setItem('omni_calc_history', JSON.stringify(history));
  }, [history]);

  const handleNumber = (num: string) => {
    if (display === '0' || display === 'Error') {
      setDisplay(num);
    } else {
      setDisplay(display + num);
    }
  };

  const handleOperator = (op: string) => {
    setExpression(display + ' ' + op + ' ');
    setDisplay('0');
  };

  const calculate = useCallback(() => {
    try {
      const fullExpression = expression + display;
      const sanitized = fullExpression.replace(/[^-()\d/*+.]/g, '');
      const result = eval(sanitized);
      
      const resultStr = Number.isInteger(result) ? result.toString() : result.toFixed(8).replace(/\.?0+$/, '');
      
      const newItem: HistoryItem = {
        expression: fullExpression,
        result: resultStr,
        timestamp: Date.now()
      };
      
      setHistory([newItem, ...history].slice(0, 20));
      setDisplay(resultStr);
      setExpression('');
    } catch (e) {
      setDisplay('Error');
    }
  }, [display, expression, history]);

  const clear = () => {
    setDisplay('0');
    setExpression('');
  };

  const backspace = () => {
    if (display.length > 1) {
      setDisplay(display.slice(0, -1));
    } else {
      setDisplay('0');
    }
  };

  const handleScientific = (func: string) => {
    try {
      const val = parseFloat(display);
      let res = 0;
      switch (func) {
        case 'sin': res = Math.sin(val); break;
        case 'cos': res = Math.cos(val); break;
        case 'tan': res = Math.tan(val); break;
        case 'sqrt': res = Math.sqrt(val); break;
        case 'log': res = Math.log10(val); break;
        case 'ln': res = Math.log(val); break;
        case 'pow2': res = Math.pow(val, 2); break;
        case 'pi': res = Math.PI; break;
      }
      setDisplay(res.toString());
    } catch (e) {
      setDisplay('Error');
    }
  };

  const handleConvert = (factor: number, name: string) => {
    const val = parseFloat(display);
    const res = val * factor;
    const resStr = res.toFixed(4).replace(/\.?0+$/, '');
    
    const newItem: HistoryItem = {
      expression: `${val} (${name})`,
      result: resStr,
      timestamp: Date.now()
    };
    
    setHistory([newItem, ...history].slice(0, 20));
    setDisplay(resStr);
  };

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 transition-colors duration-300 ${isDark ? 'bg-[#0F172A]' : 'bg-[#F1F5F9]'}`}>
      <div className={`w-full max-w-md glass rounded-[2.5rem] overflow-hidden flex flex-col h-[800px] relative ${isDark ? 'bg-slate-900/90 border-slate-800' : ''}`}>
        
        {/* Header */}
        <div className="p-6 flex justify-between items-center">
          <div className="flex gap-2 p-1 bg-gray-100 dark:bg-slate-800 rounded-xl">
            <button 
              onClick={() => setMode('standard')}
              className={`p-2 rounded-lg transition-all ${mode === 'standard' ? 'bg-white dark:bg-slate-700 shadow-sm text-blue-600' : 'text-gray-400'}`}
            >
              <Calculator size={18} />
            </button>
            <button 
              onClick={() => setMode('scientific')}
              className={`p-2 rounded-lg transition-all ${mode === 'scientific' ? 'bg-white dark:bg-slate-700 shadow-sm text-blue-600' : 'text-gray-400'}`}
            >
              <FlaskConical size={18} />
            </button>
            <button 
              onClick={() => setMode('converter')}
              className={`p-2 rounded-lg transition-all ${mode === 'converter' ? 'bg-white dark:bg-slate-700 shadow-sm text-blue-600' : 'text-gray-400'}`}
            >
              <Ruler size={18} />
            </button>
          </div>
          
          <div className="flex gap-3">
            <button 
              onClick={() => setIsDark(!isDark)}
              className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
            >
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button 
              onClick={() => setShowHistory(!showHistory)}
              className={`p-2 transition-colors ${showHistory ? 'text-blue-600' : 'text-gray-400'}`}
            >
              <History size={20} />
            </button>
          </div>
        </div>

        {/* Display */}
        <div className="flex-1 flex flex-col justify-end p-8 text-right overflow-hidden">
          <div className="text-sm font-medium text-gray-400 dark:text-slate-500 mb-2 h-6 overflow-hidden whitespace-nowrap">
            {expression}
          </div>
          <div className={`text-6xl font-bold tracking-tight break-all ${isDark ? 'text-white' : 'text-slate-900'}`}>
            {display}
          </div>
        </div>

        {/* Keypad */}
        <div className={`p-6 grid grid-cols-4 gap-3 ${isDark ? 'bg-slate-900/50' : 'bg-white/50'}`}>
          {mode === 'scientific' && (
            <div className="col-span-4 grid grid-cols-4 gap-3 mb-3">
              <button onClick={() => handleScientific('sin')} className="calc-btn calc-btn-func h-12 text-sm">sin</button>
              <button onClick={() => handleScientific('cos')} className="calc-btn calc-btn-func h-12 text-sm">cos</button>
              <button onClick={() => handleScientific('tan')} className="calc-btn calc-btn-func h-12 text-sm">tan</button>
              <button onClick={() => handleScientific('sqrt')} className="calc-btn calc-btn-func h-12 text-sm">√</button>
              <button onClick={() => handleScientific('log')} className="calc-btn calc-btn-func h-12 text-sm">log</button>
              <button onClick={() => handleScientific('ln')} className="calc-btn calc-btn-func h-12 text-sm">ln</button>
              <button onClick={() => handleScientific('pow2')} className="calc-btn calc-btn-func h-12 text-sm">x²</button>
              <button onClick={() => handleScientific('pi')} className="calc-btn calc-btn-func h-12 text-sm">π</button>
            </div>
          )}

          {mode === 'converter' && (
            <div className="col-span-4 grid grid-cols-2 gap-3 mb-3">
              {CONVERSIONS.length.map(c => (
                <button key={c.name} onClick={() => handleConvert(c.factor, c.name)} className="calc-btn calc-btn-func h-12 text-xs">{c.name}</button>
              ))}
              {CONVERSIONS.weight.map(c => (
                <button key={c.name} onClick={() => handleConvert(c.factor, c.name)} className="calc-btn calc-btn-func h-12 text-xs">{c.name}</button>
              ))}
            </div>
          )}

          <button onClick={clear} className="calc-btn calc-btn-func h-16 text-red-500">AC</button>
          <button onClick={() => handleOperator('%')} className="calc-btn calc-btn-func h-16">%</button>
          <button onClick={backspace} className="calc-btn calc-btn-func h-16"><RotateCcw size={20} /></button>
          <button onClick={() => handleOperator('/')} className="calc-btn calc-btn-op h-16">÷</button>

          <button onClick={() => handleNumber('7')} className="calc-btn calc-btn-num h-16">7</button>
          <button onClick={() => handleNumber('8')} className="calc-btn calc-btn-num h-16">8</button>
          <button onClick={() => handleNumber('9')} className="calc-btn calc-btn-num h-16">9</button>
          <button onClick={() => handleOperator('*')} className="calc-btn calc-btn-op h-16">×</button>

          <button onClick={() => handleNumber('4')} className="calc-btn calc-btn-num h-16">4</button>
          <button onClick={() => handleNumber('5')} className="calc-btn calc-btn-num h-16">5</button>
          <button onClick={() => handleNumber('6')} className="calc-btn calc-btn-num h-16">6</button>
          <button onClick={() => handleOperator('-')} className="calc-btn calc-btn-op h-16">−</button>

          <button onClick={() => handleNumber('1')} className="calc-btn calc-btn-num h-16">1</button>
          <button onClick={() => handleNumber('2')} className="calc-btn calc-btn-num h-16">2</button>
          <button onClick={() => handleNumber('3')} className="calc-btn calc-btn-num h-16">3</button>
          <button onClick={() => handleOperator('+')} className="calc-btn calc-btn-op h-16">+</button>

          <button onClick={() => handleNumber('0')} className="calc-btn calc-btn-num h-16 col-span-2">0</button>
          <button onClick={() => handleNumber('.')} className="calc-btn calc-btn-num h-16">.</button>
          <button onClick={calculate} className="calc-btn calc-btn-eq h-16">=</button>
        </div>

        {/* History Overlay */}
        <AnimatePresence>
          {showHistory && (
            <motion.div 
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className={`absolute inset-0 z-20 flex flex-col ${isDark ? 'bg-slate-900' : 'bg-white'}`}
            >
              <div className="p-6 flex justify-between items-center border-b border-gray-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <History size={20} className="text-blue-600" />
                  <h3 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>History</h3>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => setHistory([])}
                    className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={20} />
                  </button>
                  <button 
                    onClick={() => setShowHistory(false)}
                    className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                  >
                    <ChevronRight size={24} />
                  </button>
                </div>
              </div>
              
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {history.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-gray-400 space-y-4">
                    <Clock size={48} strokeWidth={1} />
                    <p>No history yet</p>
                  </div>
                ) : (
                  history.map((item, i) => (
                    <div 
                      key={i} 
                      className="text-right group cursor-pointer"
                      onClick={() => {
                        setDisplay(item.result);
                        setShowHistory(false);
                      }}
                    >
                      <div className="text-sm text-gray-400 dark:text-slate-500 mb-1 group-hover:text-blue-400 transition-colors">
                        {item.expression}
                      </div>
                      <div className="text-xl font-bold dark:text-white">
                        = {item.result}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}

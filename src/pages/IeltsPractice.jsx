import React, { useState, useEffect, useMemo, useRef } from 'react';
import Card from '../components/Card';
import { Timer, Play, Square, ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import styles from './IeltsPractice.module.css';

const DEFAULT_TIME = 40 * 60;

const IeltsPractice = () => {
  const [sessions, setSessions] = useState([]);
  const [currentSessionIndex, setCurrentSessionIndex] = useState(0);
  
  const [prompt, setPrompt] = useState('');
  const [answer, setAnswer] = useState('');
  const [timeLeft, setTimeLeft] = useState(DEFAULT_TIME);
  const [isActive, setIsActive] = useState(false);
  const [saveStatus, setSaveStatus] = useState('');
  const [isLoaded, setIsLoaded] = useState(false);
  
  const timerRef = useRef(null);
  
  // Load initial data
  useEffect(() => {
    try {
      const savedSessionsStr = localStorage.getItem('4books_ielts_sessions');
      let loadedSessions = [];
      
      if (savedSessionsStr) {
        loadedSessions = JSON.parse(savedSessionsStr);
      } else {
        // Migration from old single-entry format
        const oldPrompt = localStorage.getItem('4books_ielts_prompt');
        const oldAnswer = localStorage.getItem('4books_ielts_answer');
        if (oldPrompt || oldAnswer) {
          loadedSessions = [{
            id: Date.now(),
            date: new Date().toISOString(),
            prompt: oldPrompt || '',
            answer: oldAnswer || '',
            timeLeft: DEFAULT_TIME
          }];
        }
      }
      
      if (loadedSessions.length === 0) {
        loadedSessions = [{
          id: Date.now(),
          date: new Date().toISOString(),
          prompt: '',
          answer: '',
          timeLeft: DEFAULT_TIME
        }];
      }
      
      setSessions(loadedSessions);
      setCurrentSessionIndex(0);
      setIsLoaded(true);
    } catch (e) {
      console.error("Failed to parse IELTS sessions", e);
      setSessions([{
        id: Date.now(),
        date: new Date().toISOString(),
        prompt: '',
        answer: '',
        timeLeft: DEFAULT_TIME
      }]);
      setCurrentSessionIndex(0);
      setIsLoaded(true);
    }
  }, []);

  // Update local state when session index changes
  useEffect(() => {
    if (sessions.length > 0 && isLoaded) {
      const current = sessions[currentSessionIndex];
      setPrompt(current.prompt || '');
      setAnswer(current.answer || '');
      setTimeLeft(current.timeLeft ?? DEFAULT_TIME);
      setIsActive(false); // Pause timer on session switch
    }
  }, [currentSessionIndex, sessions, isLoaded]);

  // Persist timer running state in background if tab is left open
  useEffect(() => {
    if (isActive && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [isActive, timeLeft]);

  // Debounced Auto-save current session
  useEffect(() => {
    if (!isLoaded || sessions.length === 0) return;
    
    setSaveStatus('Saving...');
    const timeoutId = setTimeout(() => {
      const updatedSessions = [...sessions];
      updatedSessions[currentSessionIndex] = {
        ...updatedSessions[currentSessionIndex],
        prompt,
        answer,
        timeLeft
      };
      setSessions(updatedSessions);
      localStorage.setItem('4books_ielts_sessions', JSON.stringify(updatedSessions));
      setSaveStatus('Saved');
      setTimeout(() => setSaveStatus(''), 2000);
    }, 1000);
    
    return () => clearTimeout(timeoutId);
  }, [prompt, answer, timeLeft, isLoaded]); // Omitting currentSessionIndex & sessions intentionally to avoid loop

  const toggleTimer = () => setIsActive(!isActive);
  
  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(DEFAULT_TIME);
  };

  const createNewSession = () => {
    const newSession = {
      id: Date.now(),
      date: new Date().toISOString(),
      prompt: '',
      answer: '',
      timeLeft: DEFAULT_TIME
    };
    const updatedSessions = [newSession, ...sessions];
    setSessions(updatedSessions);
    setCurrentSessionIndex(0);
    localStorage.setItem('4books_ielts_sessions', JSON.stringify(updatedSessions));
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const wordCount = useMemo(() => {
    const words = answer.trim().split(/\s+/);
    return answer.trim() === '' ? 0 : words.length;
  }, [answer]);
  
  const currentSessionDate = sessions[currentSessionIndex]?.date 
    ? new Date(sessions[currentSessionIndex].date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : '';

  return (
    <div className={`${styles.container} animate-slide-up`}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>IELTS Writing Practice</h1>
          <p className={styles.subtitle}>Focus on Task 1 or Task 2 simulation with a timer.</p>
        </div>
        <div className={styles.headerRight}>
          <div className={styles.sessionNav}>
            <button 
              className={styles.navButton} 
              onClick={() => setCurrentSessionIndex(prev => Math.min(sessions.length - 1, prev + 1))} 
              disabled={currentSessionIndex === sessions.length - 1}
              aria-label="Previous session"
              title="Previous session"
            >
              <ChevronLeft size={20} />
            </button>
            <span className={styles.sessionLabel}>
              {currentSessionIndex === 0 ? 'Current Session' : currentSessionDate}
            </span>
            <button 
              className={styles.navButton} 
              onClick={() => setCurrentSessionIndex(prev => Math.max(0, prev - 1))} 
              disabled={currentSessionIndex === 0}
              aria-label="Next session"
              title="Next session"
            >
              <ChevronRight size={20} />
            </button>
            <button className={styles.newSessionBtn} onClick={createNewSession} title="Start new session">
              <Plus size={16} /> New
            </button>
          </div>
          
          <div className={`${styles.timer} ${timeLeft < 300 ? styles.warning : ''}`}>
            <Timer size={20} />
            <span>{formatTime(timeLeft)}</span>
          </div>
        </div>
      </div>

      <div className={styles.splitView}>
        <Card className={styles.promptCard}>
          <div className={styles.promptLabel}>Prompt / Question</div>
          <textarea
            className={styles.promptTextarea}
            placeholder="Type your IELTS prompt here..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
        </Card>

        <Card className={styles.answerCard}>
          <textarea
            className={styles.answerTextarea}
            placeholder="Start writing your answer here..."
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
          />
          <div className={styles.footer}>
            <div className={styles.wordCount}>
              Words: {wordCount} (Target: {prompt.toLowerCase().includes('task 1') ? '150+' : '250+'})
            </div>
            <div className={styles.controls}>
              <span className={styles.saveStatus}>{saveStatus}</span>
              <button className={styles.timerBtn} onClick={toggleTimer}>
                {isActive ? <><Square size={16} /> Pause</> : <><Play size={16} /> Start Timer</>}
              </button>
              <button className={styles.timerBtn} onClick={resetTimer}>Reset</button>
              <button 
                className={styles.saveButton}
                onClick={() => {
                  const updatedSessions = [...sessions];
                  updatedSessions[currentSessionIndex] = { ...updatedSessions[currentSessionIndex], prompt, answer, timeLeft };
                  setSessions(updatedSessions);
                  localStorage.setItem('4books_ielts_sessions', JSON.stringify(updatedSessions));
                  setSaveStatus('Saved');
                  setTimeout(() => setSaveStatus(''), 2000);
                }}
              >
                Save
              </button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default IeltsPractice;

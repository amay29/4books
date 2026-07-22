import React, { useState, useEffect, useMemo, useRef } from 'react';
import Card from '../components/Card';
import { CheckCircle, Clock, ChevronLeft, ChevronRight } from 'lucide-react';
import styles from './Journal.module.css';

const getFormattedDate = (date) => {
  return date.toISOString().split('T')[0];
};

const Journal = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [text, setText] = useState('');
  const [isLoaded, setIsLoaded] = useState(false);
  const [saveStatus, setSaveStatus] = useState('');
  
  const dateKey = `4books_journal_${getFormattedDate(currentDate)}`;

  // Load data when date changes
  useEffect(() => {
    setIsLoaded(false);
    const saved = localStorage.getItem(dateKey);
    setText(saved || '');
    setIsLoaded(true);
    setSaveStatus('');
  }, [dateKey]);

  // Save to local storage on change, only if loaded
  useEffect(() => {
    if (!isLoaded) return;
    
    setSaveStatus('Saving...');
    const timeoutId = setTimeout(() => {
      localStorage.setItem(dateKey, text);
      setSaveStatus('Saved');
      
      // Clear status after a while
      setTimeout(() => setSaveStatus(''), 2000);
    }, 1000);
    
    return () => clearTimeout(timeoutId);
  }, [text, isLoaded, dateKey]);

  const wordCount = useMemo(() => {
    const words = text.trim().split(/\s+/);
    return text.trim() === '' ? 0 : words.length;
  }, [text]);

  const isGoalMet = wordCount >= 150;

  const navigateDate = (days) => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + days);
    setCurrentDate(newDate);
  };

  const isToday = getFormattedDate(currentDate) === getFormattedDate(new Date());
  
  const dateDisplay = currentDate.toLocaleDateString('en-US', { 
    weekday: 'short', 
    month: 'short', 
    day: 'numeric' 
  });

  return (
    <div className={`${styles.container} animate-slide-up`}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Daily Journal</h1>
          <p className={styles.subtitle}>Write at least 150 words every day to improve your fluency.</p>
        </div>
        <div className={styles.headerRight}>
          <div className={styles.dateNav}>
            <button className={styles.navButton} onClick={() => navigateDate(-1)} aria-label="Previous day">
              <ChevronLeft size={20} />
            </button>
            <span className={styles.dateLabel}>{isToday ? 'Today' : dateDisplay}</span>
            <button 
              className={styles.navButton} 
              onClick={() => navigateDate(1)} 
              disabled={isToday}
              aria-label="Next day"
            >
              <ChevronRight size={20} />
            </button>
          </div>
          <div className={`${styles.stats} ${isGoalMet ? styles.success : styles.pending}`}>
            {isGoalMet ? <CheckCircle size={18} /> : <Clock size={18} />}
            <span>{wordCount} / 150 words</span>
          </div>
        </div>
      </div>

      <Card className={styles.editorCard}>
        <textarea
          className={styles.textarea}
          placeholder="How was your day? Or write your opinion about a specific topic..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <div className={styles.footer}>
          <span className={styles.saveStatus}>{saveStatus}</span>
          <button 
            className={styles.saveButton}
            onClick={() => {
              localStorage.setItem(dateKey, text);
              setSaveStatus('Saved');
              setTimeout(() => setSaveStatus(''), 2000);
            }}
          >
            Save Entry
          </button>
        </div>
      </Card>
    </div>
  );
};

export default Journal;

import React, { useState, useEffect, useMemo, useRef } from 'react';
import Card from '../components/Card';
import { Timer, Play, Square } from 'lucide-react';
import styles from './IeltsPractice.module.css';

const IeltsPractice = () => {
  const [prompt, setPrompt] = useState('');
  const [answer, setAnswer] = useState('');
  
  // Timer states
  const [timeLeft, setTimeLeft] = useState(40 * 60); // 40 minutes default
  const [isActive, setIsActive] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    const savedPrompt = localStorage.getItem('4books_ielts_prompt');
    const savedAnswer = localStorage.getItem('4books_ielts_answer');
    if (savedPrompt) setPrompt(savedPrompt);
    if (savedAnswer) setAnswer(savedAnswer);
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      localStorage.setItem('4books_ielts_prompt', prompt);
      localStorage.setItem('4books_ielts_answer', answer);
    }, 1000);
    return () => clearTimeout(timeoutId);
  }, [prompt, answer]);

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

  const toggleTimer = () => setIsActive(!isActive);
  
  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(40 * 60);
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

  return (
    <div className={`${styles.container} animate-slide-up`}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>IELTS Writing Practice</h1>
          <p className={styles.subtitle}>Fokus simulasi Task 1 atau Task 2 dengan timer.</p>
        </div>
        <div className={`${styles.timer} ${timeLeft < 300 ? styles.warning : ''}`}>
          <Timer size={20} />
          <span>{formatTime(timeLeft)}</span>
        </div>
      </div>

      <div className={styles.splitView}>
        <Card className={styles.promptCard}>
          <div className={styles.promptLabel}>Soal / Prompt</div>
          <textarea
            className={styles.promptTextarea}
            placeholder="Ketik soal IELTS di sini..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
        </Card>

        <Card className={styles.answerCard}>
          <textarea
            className={styles.answerTextarea}
            placeholder="Mulai menulis jawabanmu di sini..."
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
          />
          <div className={styles.footer}>
            <div className={styles.wordCount}>
              Word count: {wordCount} (Target: {prompt.toLowerCase().includes('task 1') ? '150+' : '250+'})
            </div>
            <div className={styles.controls}>
              <button className={styles.timerBtn} onClick={toggleTimer}>
                {isActive ? <><Square size={16} style={{display:'inline', marginRight:'5px'}}/> Pause</> : <><Play size={16} style={{display:'inline', marginRight:'5px'}}/> Start Timer</>}
              </button>
              <button className={styles.timerBtn} onClick={resetTimer}>Reset</button>
              <button 
                className={styles.saveButton}
                onClick={() => {
                  localStorage.setItem('4books_ielts_prompt', prompt);
                  localStorage.setItem('4books_ielts_answer', answer);
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

import React, { useState, useEffect, useMemo } from 'react';
import Card from '../components/Card';
import { CheckCircle, Clock } from 'lucide-react';
import styles from './Journal.module.css';

const Journal = () => {
  const [text, setText] = useState('');
  
  // Load from local storage on mount
  useEffect(() => {
    const saved = localStorage.getItem('4books_journal');
    if (saved) {
      setText(saved);
    }
  }, []);

  // Save to local storage on change
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      localStorage.setItem('4books_journal', text);
    }, 1000);
    return () => clearTimeout(timeoutId);
  }, [text]);

  const wordCount = useMemo(() => {
    const words = text.trim().split(/\s+/);
    return text.trim() === '' ? 0 : words.length;
  }, [text]);

  const isGoalMet = wordCount >= 150;

  return (
    <div className={`${styles.container} animate-slide-up`}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Daily Journal</h1>
          <p className={styles.subtitle}>Tulis minimal 150 kata setiap hari untuk melatih fluency.</p>
        </div>
        <div className={`${styles.stats} ${isGoalMet ? styles.success : styles.pending}`}>
          {isGoalMet ? <CheckCircle size={18} /> : <Clock size={18} />}
          <span>{wordCount} / 150 kata</span>
        </div>
      </div>

      <Card className={styles.editorCard}>
        <textarea
          className={styles.textarea}
          placeholder="Ceritain hari ini ada apa aja... atau tulis opini tentang sesuatu."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <div className={styles.footer}>
          <button 
            className={styles.saveButton}
            onClick={() => localStorage.setItem('4books_journal', text)}
          >
            Simpan Jurnal
          </button>
        </div>
      </Card>
    </div>
  );
};

export default Journal;

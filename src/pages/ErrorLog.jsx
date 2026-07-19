import React, { useState, useEffect } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import styles from './ErrorLog.module.css';

const ErrorLog = () => {
  const [logs, setLogs] = useState([]);
  const [formData, setFormData] = useState({ mistake: '', correction: '' });

  useEffect(() => {
    const saved = localStorage.getItem('4books_error_log');
    if (saved) {
      setLogs(JSON.parse(saved));
    }
  }, []);

  const saveLogs = (newLogs) => {
    setLogs(newLogs);
    localStorage.setItem('4books_error_log', JSON.stringify(newLogs));
  };

  const handleAdd = (e) => {
    e.preventDefault();
    if (!formData.mistake.trim() || !formData.correction.trim()) return;

    const newLog = {
      id: Date.now(),
      date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
      mistake: formData.mistake,
      correction: formData.correction
    };
    
    saveLogs([newLog, ...logs]);
    setFormData({ mistake: '', correction: '' });
  };

  const handleDelete = (id) => {
    const newLogs = logs.filter(log => log.id !== id);
    saveLogs(newLogs);
  };

  return (
    <div className={`${styles.container} animate-slide-up`}>
      <div className={styles.header}>
        <h1 className={styles.title}>Error Log</h1>
        <p className={styles.subtitle}>Catat kesalahan grammar atau vocab, lalu tulis pembetulannya supaya nggak diulang.</p>
      </div>

      <form className={styles.formCard} onSubmit={handleAdd}>
        <textarea
          name="mistake"
          value={formData.mistake}
          onChange={(e) => setFormData({ ...formData, mistake: e.target.value })}
          placeholder="Tulis kesalahanmu di sini (contoh: I doesn't know)"
          className={styles.textareaField}
          required
        />
        <textarea
          name="correction"
          value={formData.correction}
          onChange={(e) => setFormData({ ...formData, correction: e.target.value })}
          placeholder="Tulis pembetulan dan alasannya (contoh: I don't know, karena I pakai don't)"
          className={styles.textareaField}
          required
        />
        <button type="submit" className={styles.addButton}>
          <Plus size={18} style={{ display: 'inline', verticalAlign: 'text-bottom' }} /> Catat Kesalahan
        </button>
      </form>

      <div className={styles.logList}>
        {logs.map((log) => (
          <div key={log.id} className={`${styles.logItem} hover-scale`}>
            <div className={styles.date}>{log.date}</div>
            
            <div className={styles.logSection}>
              <span className={styles.logLabel}>Mistake</span>
              <div className={styles.mistakeText}>{log.mistake}</div>
            </div>
            
            <div className={styles.logSection}>
              <span className={styles.logLabel}>Correction</span>
              <div className={styles.correctionText}>{log.correction}</div>
            </div>

            <button className={styles.deleteBtn} onClick={() => handleDelete(log.id)}>
              <Trash2 size={18} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ErrorLog;

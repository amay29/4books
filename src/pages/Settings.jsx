import React, { useRef } from 'react';
import { Download, Upload, AlertTriangle } from 'lucide-react';
import styles from './Settings.module.css';

const STORAGE_KEYS = [
  '4books_vocab', 
  '4books_ielts_sessions', 
  '4books_error_log'
];

// Dynamically get journal keys since they are date-based
const getAllKeys = () => {
  const keys = [...STORAGE_KEYS];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith('4books_journal_')) {
      keys.push(key);
    }
  }
  return keys;
};

const Settings = () => {
  const fileInputRef = useRef(null);

  const handleExport = () => {
    const allKeys = getAllKeys();
    const exportData = {};
    
    allKeys.forEach(key => {
      const data = localStorage.getItem(key);
      if (data) {
        try {
          exportData[key] = JSON.parse(data);
        } catch {
          exportData[key] = data; // strings like journal entries
        }
      }
    });

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `4books_backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const importData = JSON.parse(event.target.result);
        
        if (window.confirm('Are you sure you want to import data? This will overwrite your current data.')) {
          Object.keys(importData).forEach(key => {
            if (key.startsWith('4books_')) {
              const value = typeof importData[key] === 'string' 
                ? importData[key] 
                : JSON.stringify(importData[key]);
              localStorage.setItem(key, value);
            }
          });
          alert('Data imported successfully! The page will now reload.');
          window.location.reload();
        }
      } catch (err) {
        alert('Invalid backup file. Please ensure it is a valid JSON file exported from 4Books.');
        console.error(err);
      }
    };
    reader.readAsText(file);
    e.target.value = null; // reset input
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleClearAll = () => {
    if (window.confirm('WARNING: Are you absolutely sure you want to delete ALL 4Books data? This action cannot be undone!')) {
      const allKeys = getAllKeys();
      allKeys.forEach(key => localStorage.removeItem(key));
      alert('All data has been cleared. The page will now reload.');
      window.location.reload();
    }
  };

  return (
    <div className={`${styles.container} animate-slide-up`}>
      <div className={styles.header}>
        <h1 className={styles.title}>Settings & Data</h1>
        <p className={styles.subtitle}>Manage your application data and backups.</p>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Backup & Restore</h2>
        <p className={styles.subtitle} style={{marginBottom: '1rem'}}>
          Since your data is stored locally in this browser, it's highly recommended to export a backup regularly.
        </p>
        
        <div className={styles.buttonGroup}>
          <button className={styles.actionButton} onClick={handleExport}>
            <Download size={18} /> Export Data (JSON)
          </button>
          
          <button className={styles.actionButton} onClick={triggerFileInput}>
            <Upload size={18} /> Import Data
          </button>
          <input 
            type="file" 
            accept=".json" 
            ref={fileInputRef} 
            onChange={handleImport} 
            className={styles.hiddenInput} 
          />
        </div>
      </div>
      
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Danger Zone</h2>
        <div className={styles.buttonGroup}>
          <button className={`${styles.actionButton} ${styles.danger}`} onClick={handleClearAll}>
            <AlertTriangle size={18} /> Delete All Local Data
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;

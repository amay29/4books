import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, Check } from 'lucide-react';
import styles from './ErrorLog.module.css';

const ErrorLog = () => {
  const [logs, setLogs] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingId, setEditingId] = useState(null);
  
  const [formData, setFormData] = useState({ mistake: '', correction: '' });
  const [editFormData, setEditFormData] = useState({});

  useEffect(() => {
    try {
      const saved = localStorage.getItem('4books_error_log');
      if (saved) {
        setLogs(JSON.parse(saved));
      }
    } catch (e) {
      console.error("Failed to parse error log data", e);
      setLogs([]);
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
      id: Date.now() + Math.random().toString(36).substring(2, 9),
      date: new Date().toISOString(),
      mistake: formData.mistake,
      correction: formData.correction
    };
    
    saveLogs([newLog, ...logs]);
    setFormData({ mistake: '', correction: '' });
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this error log?")) {
      const newLogs = logs.filter(log => log.id !== id);
      saveLogs(newLogs);
    }
  };
  
  const startEditing = (log) => {
    setEditingId(log.id);
    setEditFormData({ ...log });
  };
  
  const saveEditing = () => {
    if (!editFormData.mistake.trim() || !editFormData.correction.trim()) return;
    
    const newLogs = logs.map(log => 
      log.id === editingId ? { ...editFormData } : log
    );
    saveLogs(newLogs);
    setEditingId(null);
  };
  
  const handleEditChange = (e) => {
    setEditFormData({ ...editFormData, [e.target.name]: e.target.value });
  };

  const filteredLogs = logs.filter(log => 
    log.mistake.toLowerCase().includes(searchQuery.toLowerCase()) || 
    log.correction.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDate = (isoString) => {
    return new Date(isoString).toLocaleDateString('en-US', { 
      month: 'short', day: 'numeric', year: 'numeric' 
    });
  };

  return (
    <div className={`${styles.container} animate-slide-up`}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Error Log</h1>
          <p className={styles.subtitle}>Record grammar or vocab mistakes and their corrections so you won't repeat them.</p>
        </div>
        <div className={styles.headerActions}>
          <input 
            type="text" 
            placeholder="Search mistakes..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles.searchBar}
          />
        </div>
      </div>

      <form className={styles.formCard} onSubmit={handleAdd}>
        <textarea
          name="mistake"
          value={formData.mistake}
          onChange={(e) => setFormData({ ...formData, mistake: e.target.value })}
          placeholder="Write your mistake here (e.g. I doesn't know)"
          className={styles.textareaField}
          required
        />
        <textarea
          name="correction"
          value={formData.correction}
          onChange={(e) => setFormData({ ...formData, correction: e.target.value })}
          placeholder="Write the correction and reason (e.g. I don't know, because 'I' uses 'don't')"
          className={styles.textareaField}
          required
        />
        <button type="submit" className={styles.addButton}>
          <Plus size={18} /> Record Mistake
        </button>
      </form>

      <div className={styles.logList}>
        {filteredLogs.length === 0 && (
          <div className={styles.emptyState}>No errors logged yet.</div>
        )}
        
        {filteredLogs.map((log) => (
          <div key={log.id} className={`${styles.logItem} hover-scale`}>
            <div className={styles.date}>{log.date ? formatDate(log.date) : ''}</div>
            
            <div className={styles.logSection}>
              <span className={styles.logLabel}>Mistake</span>
              {editingId === log.id ? (
                <textarea 
                  name="mistake" 
                  value={editFormData.mistake} 
                  onChange={handleEditChange}
                  className={styles.editTextarea}
                />
              ) : (
                <div className={styles.mistakeText}>{log.mistake}</div>
              )}
            </div>
            
            <div className={styles.logSection}>
              <span className={styles.logLabel}>Correction</span>
              {editingId === log.id ? (
                <textarea 
                  name="correction" 
                  value={editFormData.correction} 
                  onChange={handleEditChange}
                  className={styles.editTextarea}
                />
              ) : (
                <div className={styles.correctionText}>{log.correction}</div>
              )}
            </div>

            <div className={styles.cardActions}>
              {editingId === log.id ? (
                <button className={styles.actionBtn} onClick={saveEditing} title="Save changes">
                  <Check size={18} color="#10b981" />
                </button>
              ) : (
                <button className={styles.actionBtn} onClick={() => startEditing(log)} title="Edit">
                  <Edit2 size={16} />
                </button>
              )}
              <button className={`${styles.actionBtn} ${styles.deleteHover}`} onClick={() => handleDelete(log.id)} title="Delete">
                <Trash2 size={18} />
              </button>
            </div>
            
            {editingId === log.id && (
              <button className={styles.saveEditBtn} onClick={saveEditing}>Save Changes</button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ErrorLog;

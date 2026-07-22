import React, { useState, useEffect } from 'react';
import { Plus, X, Search, Edit2, Check } from 'lucide-react';
import styles from './Vocab.module.css';

const Vocab = () => {
  const [vocabs, setVocabs] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingId, setEditingId] = useState(null);
  
  const [formData, setFormData] = useState(() => {
    try {
      const draft = localStorage.getItem('4books_vocab_draft');
      return draft ? JSON.parse(draft) : {
        word: '',
        ipa: '',
        definition: '',
        synonym: '',
        sentence: ''
      };
    } catch {
      return {
        word: '',
        ipa: '',
        definition: '',
        synonym: '',
        sentence: ''
      };
    }
  });
  
  const [editFormData, setEditFormData] = useState({});

  useEffect(() => {
    localStorage.setItem('4books_vocab_draft', JSON.stringify(formData));
  }, [formData]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('4books_vocab');
      if (saved) {
        setVocabs(JSON.parse(saved));
      }
    } catch (e) {
      console.error("Failed to parse vocab data", e);
      setVocabs([]);
    }
  }, []);

  const saveVocabs = (newVocabs) => {
    setVocabs(newVocabs);
    localStorage.setItem('4books_vocab', JSON.stringify(newVocabs));
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  
  const handleEditChange = (e) => {
    setEditFormData({ ...editFormData, [e.target.name]: e.target.value });
  };

  const handleAdd = (e) => {
    e.preventDefault();
    if (!formData.word.trim() || !formData.definition.trim()) return;

    const newVocab = {
      ...formData,
      id: Date.now() + Math.random().toString(36).substring(2, 9)
    };
    
    saveVocabs([newVocab, ...vocabs]);
    setFormData({ word: '', ipa: '', definition: '', synonym: '', sentence: '' });
    localStorage.removeItem('4books_vocab_draft');
  };

  const handleDelete = (id, word) => {
    if (window.confirm(`Are you sure you want to delete "${word}"?`)) {
      const newVocabs = vocabs.filter(v => v.id !== id);
      saveVocabs(newVocabs);
    }
  };
  
  const startEditing = (vocab) => {
    setEditingId(vocab.id);
    setEditFormData({ ...vocab });
  };
  
  const saveEditing = () => {
    if (!editFormData.word.trim() || !editFormData.definition.trim()) return;
    
    const newVocabs = vocabs.map(v => 
      v.id === editingId ? { ...editFormData } : v
    );
    saveVocabs(newVocabs);
    setEditingId(null);
  };

  const filteredVocabs = vocabs.filter(v => 
    v.word.toLowerCase().includes(searchQuery.toLowerCase()) || 
    v.definition.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={`${styles.container} animate-slide-up`}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Vocabulary Ledger</h1>
          <p className={styles.subtitle}>Record new words, pronunciation, and usage.</p>
        </div>
        <div className={styles.headerActions}>
          <input 
            type="text" 
            placeholder="Search vocab..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles.searchBar}
          />
        </div>
      </div>

      <form className={styles.formCard} onSubmit={handleAdd}>
        <div className={styles.inputGroupRow}>
          <input 
            type="text" 
            name="word" 
            value={formData.word} 
            onChange={handleInputChange} 
            placeholder="Word (e.g. Ubiquitous)" 
            className={styles.inputField} 
            required
          />
          <input 
            type="text" 
            name="ipa" 
            value={formData.ipa} 
            onChange={handleInputChange} 
            placeholder="IPA / Pronunciation (e.g. /juːˈbɪk.wɪ.təs/)" 
            className={styles.inputField} 
          />
        </div>
        <input 
          type="text" 
          name="definition" 
          value={formData.definition} 
          onChange={handleInputChange} 
          placeholder="Definition" 
          className={styles.inputField} 
          required
        />
        <input 
          type="text" 
          name="synonym" 
          value={formData.synonym} 
          onChange={handleInputChange} 
          placeholder="Synonyms" 
          className={styles.inputField} 
        />
        <input 
          type="text" 
          name="sentence" 
          value={formData.sentence} 
          onChange={handleInputChange} 
          placeholder="Example Sentence" 
          className={styles.inputField} 
        />
        <button type="submit" className={styles.addButton}>
          <Plus size={18} /> Add Word
        </button>
      </form>

      <div className={styles.vocabGrid}>
        {filteredVocabs.length === 0 && (
          <div className={styles.emptyState}>No vocabulary found.</div>
        )}
        
        {filteredVocabs.map((vocab) => (
          <div key={vocab.id} className={`${styles.vocabItem} hover-scale`}>
            <div className={styles.cardActions}>
              {editingId === vocab.id ? (
                <button className={styles.actionBtn} onClick={saveEditing} title="Save changes">
                  <Check size={18} color="#10b981" />
                </button>
              ) : (
                <button className={styles.actionBtn} onClick={() => startEditing(vocab)} title="Edit">
                  <Edit2 size={16} />
                </button>
              )}
              <button className={`${styles.actionBtn} ${styles.deleteHover}`} onClick={() => handleDelete(vocab.id, vocab.word)} title="Delete">
                <X size={18} />
              </button>
            </div>
            
            {editingId === vocab.id ? (
              // Edit Mode
              <>
                <input name="word" value={editFormData.word} onChange={handleEditChange} className={styles.editInput} placeholder="Word" />
                <input name="ipa" value={editFormData.ipa} onChange={handleEditChange} className={styles.editInput} placeholder="IPA" />
                <input name="definition" value={editFormData.definition} onChange={handleEditChange} className={styles.editInput} placeholder="Definition" />
                <input name="synonym" value={editFormData.synonym} onChange={handleEditChange} className={styles.editInput} placeholder="Synonyms" />
                <input name="sentence" value={editFormData.sentence} onChange={handleEditChange} className={styles.editInput} placeholder="Sentence" />
              </>
            ) : (
              // View Mode
              <>
                <div className={styles.wordHeader}>
                  <span className={styles.word}>{vocab.word}</span>
                  {vocab.ipa && <span className={styles.ipa}>{vocab.ipa}</span>}
                </div>
                <div className={styles.definition}>{vocab.definition}</div>
                {vocab.synonym && <div className={styles.synonym}>Syn: {vocab.synonym}</div>}
                {vocab.sentence && <div className={styles.sentence}>"{vocab.sentence}"</div>}
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Vocab;

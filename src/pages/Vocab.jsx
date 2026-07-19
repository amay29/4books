import React, { useState, useEffect } from 'react';
import { Plus, X } from 'lucide-react';
import styles from './Vocab.module.css';

const Vocab = () => {
  const [vocabs, setVocabs] = useState([]);
  const [formData, setFormData] = useState({
    word: '',
    ipa: '',
    definition: '',
    synonym: '',
    sentence: ''
  });

  useEffect(() => {
    const saved = localStorage.getItem('4books_vocab');
    if (saved) {
      setVocabs(JSON.parse(saved));
    }
  }, []);

  const saveVocabs = (newVocabs) => {
    setVocabs(newVocabs);
    localStorage.setItem('4books_vocab', JSON.stringify(newVocabs));
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAdd = (e) => {
    e.preventDefault();
    if (!formData.word.trim()) return;

    const newVocab = {
      ...formData,
      id: Date.now()
    };
    
    saveVocabs([newVocab, ...vocabs]);
    setFormData({ word: '', ipa: '', definition: '', synonym: '', sentence: '' });
  };

  const handleDelete = (id) => {
    const newVocabs = vocabs.filter(v => v.id !== id);
    saveVocabs(newVocabs);
  };

  return (
    <div className={`${styles.container} animate-slide-up`}>
      <div className={styles.header}>
        <h1 className={styles.title}>Vocabulary Ledger</h1>
        <p className={styles.subtitle}>Catat kosakata baru, pelafalan, dan aplikasinya.</p>
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
          placeholder="My Sentence" 
          className={styles.inputField} 
        />
        <button type="submit" className={styles.addButton}>
          <Plus size={18} style={{ display: 'inline', verticalAlign: 'text-bottom' }} /> Tambah Kosakata
        </button>
      </form>

      <div className={styles.vocabGrid}>
        {vocabs.map((vocab) => (
          <div key={vocab.id} className={`${styles.vocabItem} hover-scale`}>
            <button className={styles.deleteBtn} onClick={() => handleDelete(vocab.id)}>
              <X size={18} />
            </button>
            <div className={styles.wordHeader}>
              <span className={styles.word}>{vocab.word}</span>
              {vocab.ipa && <span className={styles.ipa}>{vocab.ipa}</span>}
            </div>
            <div className={styles.definition}>{vocab.definition}</div>
            {vocab.synonym && <div className={styles.synonym}>Syn: {vocab.synonym}</div>}
            {vocab.sentence && <div className={styles.sentence}>"{vocab.sentence}"</div>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Vocab;

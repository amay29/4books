import React from 'react';
import { BookOpen, Book, BookType, AlertCircle } from 'lucide-react';
import styles from './Sidebar.module.css';

const Sidebar = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'journal', label: 'Buku 1: Journal', icon: BookOpen },
    { id: 'vocab', label: 'Buku 2: Vocab', icon: BookType },
    { id: 'ielts', label: 'Buku 3: IELTS', icon: Book },
    { id: 'error', label: 'Buku 4: Error Log', icon: AlertCircle },
  ];

  return (
    <aside className={styles.sidebar}>
      <div className={styles.logoContainer}>
        <div className={styles.logo}>
          <BookOpen className={styles.icon} color="var(--color-primary-dark)" />
          4Books
        </div>
      </div>
      <nav className={styles.nav}>
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <div
              key={tab.id}
              className={`${styles.navItem} ${activeTab === tab.id ? styles.active : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <Icon className={styles.icon} />
              <span>{tab.label}</span>
            </div>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;

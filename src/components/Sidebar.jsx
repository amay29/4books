import React from 'react';
import { BookOpen, Book, BookType, AlertCircle, Settings } from 'lucide-react';
import styles from './Sidebar.module.css';

const Sidebar = ({ activeTab, setActiveTab, isOpen, closeSidebar }) => {
  const tabs = [
    { id: 'journal', label: 'Book 1: Journal', icon: BookOpen },
    { id: 'vocab', label: 'Book 2: Vocab', icon: BookType },
    { id: 'ielts', label: 'Book 3: IELTS', icon: Book },
    { id: 'error', label: 'Book 4: Error Log', icon: AlertCircle },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const handleTabClick = (id) => {
    setActiveTab(id);
    closeSidebar();
  };

  return (
    <>
      <div 
        className={`${styles.overlay} ${isOpen ? styles.open : ''}`} 
        onClick={closeSidebar}
        aria-hidden="true"
      />
      <aside className={`${styles.sidebar} ${isOpen ? styles.open : ''}`}>
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
              <button
                key={tab.id}
                className={`${styles.navItem} ${activeTab === tab.id ? styles.active : ''}`}
                onClick={() => handleTabClick(tab.id)}
                aria-label={tab.label}
              >
                <Icon className={styles.icon} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;

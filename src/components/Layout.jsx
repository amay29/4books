import React, { useState } from 'react';
import Sidebar from './Sidebar';
import { Menu, BookOpen } from 'lucide-react';
import styles from './Layout.module.css';

const Layout = ({ children, activeTab, setActiveTab }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className={styles.layout}>
      {/* Mobile Header */}
      <header className={styles.mobileHeader}>
        <div className={styles.mobileLogo}>
          <BookOpen size={24} color="var(--color-primary-dark)" />
          4Books
        </div>
        <button 
          className={styles.menuButton} 
          onClick={() => setSidebarOpen(true)}
          aria-label="Open menu"
        >
          <Menu size={24} />
        </button>
      </header>

      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        isOpen={sidebarOpen} 
        closeSidebar={() => setSidebarOpen(false)}
      />
      
      <main className={`${styles.mainContent} animate-fade-in`}>
        <div className={styles.contentWrapper}>
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;

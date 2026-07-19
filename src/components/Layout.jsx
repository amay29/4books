import React, { useState } from 'react';
import Sidebar from './Sidebar';
import styles from './Layout.module.css';

const Layout = ({ children, activeTab, setActiveTab }) => {
  return (
    <div className={styles.layout}>
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className={`${styles.mainContent} animate-fade-in`}>
        {children}
      </main>
    </div>
  );
};

export default Layout;

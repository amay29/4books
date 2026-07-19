import React, { useState } from 'react';
import Layout from './components/Layout';
import Journal from './pages/Journal';
import Vocab from './pages/Vocab';
import Ielts from './pages/IeltsPractice';
import ErrorLog from './pages/ErrorLog';

function App() {
  const [activeTab, setActiveTab] = useState('journal');

  const renderContent = () => {
    switch (activeTab) {
      case 'journal':
        return <Journal />;
      case 'vocab':
        return <Vocab />;
      case 'ielts':
        return <Ielts />;
      case 'error':
        return <ErrorLog />;
      default:
        return <Journal />;
    }
  };

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
      {renderContent()}
    </Layout>
  );
}

export default App;

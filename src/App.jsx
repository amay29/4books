import React, { useState } from 'react';
import Layout from './components/Layout';
import Journal from './pages/Journal';
// import Vocab from './pages/Vocab';
// import Ielts from './pages/IeltsPractice';
// import ErrorLog from './pages/ErrorLog';

function App() {
  const [activeTab, setActiveTab] = useState('journal');

  const renderContent = () => {
    switch (activeTab) {
      case 'journal':
        return <Journal />;
      case 'vocab':
        return <div>Buku 2: Vocab (Coming Soon)</div>;
      case 'ielts':
        return <div>Buku 3: IELTS (Coming Soon)</div>;
      case 'error':
        return <div>Buku 4: Error Log (Coming Soon)</div>;
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

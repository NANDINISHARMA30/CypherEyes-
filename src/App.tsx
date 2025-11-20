import { useState, useEffect } from 'react';
import NavigationBar from './components/NavigationBar';
import Footer from './components/Footer';
import DashboardPage from './pages/DashboardPage';
import AnomaliesPage from './pages/AnomaliesPage';
import UserBehaviourPage from './pages/UserBehaviourPage';
import LiveTrafficPage from './pages/LiveTrafficPage';
import SettingsPage from './pages/SettingsPage';
import { generateMockAnomalies, generateMockUsers, generateMockFlowData } from './utils/mockData';

function App() {
  const [currentPage, setCurrentPage] = useState('Dashboard');
  const [anomalies] = useState(generateMockAnomalies());
  const [users] = useState(generateMockUsers());
  const [flows] = useState(generateMockFlowData());

  useEffect(() => {
    const titleElement = document.querySelector('title');
    if (titleElement) {
      const defaultTitle = titleElement.getAttribute('data-default');
      titleElement.textContent = defaultTitle ? `${currentPage} - ${defaultTitle}` : currentPage;
    }
  }, [currentPage]);

  const renderPage = () => {
    switch (currentPage) {
      case 'Dashboard':
        return <DashboardPage />;
      case 'Anomalies':
        return <AnomaliesPage anomalies={anomalies} />;
      case 'User Behaviour':
        return <UserBehaviourPage users={users} />;
      case 'Live Traffic':
        return <LiveTrafficPage flows={flows} />;
      case 'Settings':
        return <SettingsPage />;
      default:
        return <DashboardPage />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <NavigationBar currentPage={currentPage} onNavigate={setCurrentPage} />
      <main className="flex-1 p-6">
        <div className="max-w-[1400px] mx-auto">
          {renderPage()}
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default App;

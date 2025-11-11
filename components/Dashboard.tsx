import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Chatbot from './Chatbot';
import { AnalyticsView } from '../types';
import { useTheme } from '../contexts/ThemeContext';

import DashboardHome from './DashboardHome';
import SalesAnalytics from './SalesAnalytics';
import CustomerAnalytics from './CustomerAnalytics';
import MarketAnalytics from './MarketAnalytics';
import FinancialAnalytics from './FinancialAnalytics';
import OperationsAnalytics from './OperationsAnalytics';

const ThemeToggle: React.FC = () => {
    const { theme, toggleTheme } = useTheme();
    return (
        <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-dark-700" aria-label="Toggle theme">
            {theme === 'dark' ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
            ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>
            )}
        </button>
    )
}

const Dashboard: React.FC = () => {
  const [activeView, setActiveView] = useState<AnalyticsView>('home');

  const renderContent = () => {
    switch (activeView) {
      case 'home':
        return <DashboardHome />;
      case 'sales':
        return <SalesAnalytics />;
      case 'customers':
          return <CustomerAnalytics />;
      case 'market':
          return <MarketAnalytics />;
      case 'financial':
          return <FinancialAnalytics />;
      case 'operations':
          return <OperationsAnalytics />;
      default:
        return <DashboardHome />;
    }
  };

  return (
    <div className="flex h-screen bg-light dark:bg-dark-800 text-gray-800 dark:text-gray-200">
      <Sidebar activeView={activeView} setActiveView={setActiveView} />
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="flex items-center justify-between h-16 px-6 bg-white dark:bg-dark-900 border-b border-gray-200 dark:border-dark-700">
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white capitalize">{activeView} Overview</h1>
          <div className="flex items-center space-x-4">
             <ThemeToggle />
             <button className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-dark-700">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500 dark:text-gray-400"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21.7a1.94 1.94 0 0 0 3.4 0"/></svg>
             </button>
             <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center font-bold text-white">
                <img src="https://picsum.photos/100/100" alt="User Avatar" className="w-full h-full rounded-full object-cover" />
             </div>
          </div>
        </header>
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
            {renderContent()}
        </div>
      </main>
      <Chatbot />
    </div>
  );
};

export default Dashboard;

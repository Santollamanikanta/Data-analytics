import React from 'react';
import { NAV_ITEMS } from '../constants';
import { AnalyticsView } from '../types';

interface SidebarProps {
  activeView: AnalyticsView;
  setActiveView: (view: AnalyticsView) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeView, setActiveView }) => {
  return (
    <aside className="w-16 md:w-64 bg-white dark:bg-dark-900 border-r border-gray-200 dark:border-dark-700 flex flex-col">
      <div className="flex items-center justify-center md:justify-start md:px-6 h-16 border-b border-gray-200 dark:border-dark-700">
        <svg className="h-8 w-auto text-primary" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-12h2v4h-2zm0 6h2v2h-2z"/></svg>
        <span className="hidden md:block ml-3 text-xl font-bold text-gray-900 dark:text-white">Adaptive AI</span>
      </div>
      <nav className="flex-1 px-2 md:px-4 py-4 space-y-2">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveView(item.id)}
            className={`flex items-center justify-center md:justify-start w-full p-3 text-sm font-medium rounded-lg transition-colors duration-200 ${
              activeView === item.id
                ? 'bg-primary text-white'
                : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-dark-700 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            {item.icon}
            <span className="hidden md:block ml-4">{item.label}</span>
          </button>
        ))}
      </nav>
      <div className="px-2 md:px-4 py-4 border-t border-gray-200 dark:border-dark-700">
         <button className="flex items-center justify-center md:justify-start w-full p-3 text-sm font-medium rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-dark-700 hover:text-gray-900 dark:hover:text-white">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.3 21.7a1.94 1.94 0 0 0-3.4 0"/><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
            <span className="hidden md:block ml-4">Support</span>
         </button>
      </div>
    </aside>
  );
};

export default Sidebar;

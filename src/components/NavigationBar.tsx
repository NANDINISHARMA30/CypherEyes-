import { Shield, User, Bell } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

interface NavigationBarProps {
  currentPage?: string;
  onOpenXAITickets?: () => void;
}

export default function NavigationBar({ currentPage, onOpenXAITickets }: NavigationBarProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const tabs = [
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Live Traffic', path: '/live-traffic' },
    { name: 'Anomalies', path: '/anomalies' },
    { name: 'User Behaviour', path: '/user-behaviour' }
  ];

  const getCurrentTab = () => {
    const currentTab = tabs.find(tab => tab.path === location.pathname);
    return currentTab ? currentTab.name : currentPage || 'Dashboard';
  };

  return (
    <nav className="bg-slate-900 h-[70px] shadow-md flex items-center justify-between px-8">
      <div className="flex items-center space-x-2">
        <Shield className="w-8 h-8 text-sky-400" />
        <h1 className="text-white text-xl font-bold">CypherEyes</h1>
      </div>

      <div className="flex space-x-8">
        {tabs.map((tab) => (
          <button
            key={tab.name}
            onClick={() => navigate(tab.path)}
            className={`text-white font-semibold transition-all duration-200 hover:text-sky-400 border-b-2 ${
              getCurrentTab() === tab.name
                ? 'border-sky-400 text-sky-400'
                : 'border-transparent'
            }`}
          >
            {tab.name}
          </button>
        ))}
      </div>

      <div className="flex items-center space-x-3">
        {onOpenXAITickets && (
          <button
            onClick={onOpenXAITickets}
            className="relative w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center cursor-pointer hover:bg-blue-700 transition-colors"
            title="XAI Security Tickets"
          >
            <Bell className="w-5 h-5 text-white" />
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold">3</span>
            </div>
          </button>
        )}
        <div className="w-10 h-10 rounded-full bg-sky-400 flex items-center justify-center cursor-pointer hover:bg-sky-500 transition-colors">
          <User className="w-6 h-6 text-white" />
        </div>
      </div>
    </nav>
  );
}

import { Shield, User } from 'lucide-react';

interface NavigationBarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export default function NavigationBar({ currentPage, onNavigate }: NavigationBarProps) {
  const tabs = ['Dashboard', 'Live Traffic', 'Anomalies', 'User Behaviour', 'Settings'];

  return (
    <nav className="bg-slate-900 h-[70px] shadow-md flex items-center justify-between px-8">
      <div className="flex items-center space-x-2">
        <Shield className="w-8 h-8 text-sky-400" />
        <h1 className="text-white text-xl font-bold">IDS Monitor</h1>
      </div>

      <div className="flex space-x-8">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => onNavigate(tab)}
            className={`text-white font-semibold transition-all duration-200 hover:text-sky-400 border-b-2 ${
              currentPage === tab
                ? 'border-sky-400 text-sky-400'
                : 'border-transparent'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 rounded-full bg-sky-400 flex items-center justify-center cursor-pointer hover:bg-sky-500 transition-colors">
          <User className="w-6 h-6 text-white" />
        </div>
      </div>
    </nav>
  );
}

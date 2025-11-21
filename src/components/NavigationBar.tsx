import { Shield, User, Bell, Settings } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';

interface NavigationBarProps {
  currentPage?: string;
  onOpenXAITickets?: () => void;
  onToggleNotifications?: () => void;
}

export default function NavigationBar({ currentPage, onOpenXAITickets, onToggleNotifications }: NavigationBarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [showSettingsMenu, setShowSettingsMenu] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const notificationsEnabled = localStorage.getItem('xai-notifications-enabled') === 'true';
  const settingsRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (settingsRef.current && !settingsRef.current.contains(event.target as Node)) {
        setShowSettingsMenu(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
    };

    if (showSettingsMenu || showProfileMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showSettingsMenu, showProfileMenu]);

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
        
        {/* Settings Menu */}
        <div className="relative" ref={settingsRef}>
          <button
            onClick={() => setShowSettingsMenu(!showSettingsMenu)}
            className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center cursor-pointer hover:bg-gray-700 transition-colors"
            title="Settings"
          >
            <Settings className="w-5 h-5 text-white" />
          </button>
          
          {showSettingsMenu && (
            <div className="absolute right-0 top-12 bg-white rounded-lg shadow-lg border z-50 w-64 py-2">
              <div className="px-4 py-2 border-b">
                <span className="text-sm font-medium text-gray-700">Notification Settings</span>
              </div>
              <button
                onClick={() => {
                  if (onToggleNotifications) onToggleNotifications();
                  setShowSettingsMenu(false);
                }}
                className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center justify-between"
              >
                <span>Popup Notifications</span>
                <span className={`text-xs px-2 py-1 rounded ${
                  notificationsEnabled 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {notificationsEnabled ? 'ON' : 'OFF'}
                </span>
              </button>
              <div className="px-4 py-2 text-xs text-gray-500">
                Toggle popup notifications for security alerts
              </div>
            </div>
          )}
        </div>
        
        {/* Profile Menu */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="w-10 h-10 rounded-full bg-sky-400 flex items-center justify-center cursor-pointer hover:bg-sky-500 transition-colors"
            title="Profile"
          >
            <User className="w-6 h-6 text-white" />
          </button>
          
          {showProfileMenu && (
            <div className="absolute right-0 top-12 bg-white rounded-lg shadow-lg border z-50 w-80 py-4">
              {/* Company Header */}
              <div className="px-6 pb-4 border-b border-gray-200">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center">
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">CypherTech Solutions</h3>
                    <p className="text-sm text-gray-600">Enterprise Security</p>
                  </div>
                </div>
              </div>
              
              {/* User Info */}
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                    <User className="w-5 h-5 text-gray-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">John Smith</p>
                    <p className="text-sm text-gray-600">Security Administrator</p>
                  </div>
                </div>
                <div className="text-sm text-gray-600 space-y-1">
                  <p>📧 john.smith@cyphertech.com</p>
                  <p>🏢 Department: IT Security</p>
                  <p>📍 Location: New York, NY</p>
                </div>
              </div>
              
              {/* Company Stats */}
              <div className="px-6 py-4 border-b border-gray-200">
                <h4 className="font-medium text-gray-900 mb-3">Security Overview</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="text-center p-2 bg-green-50 rounded">
                    <div className="font-semibold text-green-700">99.8%</div>
                    <div className="text-green-600">Uptime</div>
                  </div>
                  <div className="text-center p-2 bg-blue-50 rounded">
                    <div className="font-semibold text-blue-700">2,847</div>
                    <div className="text-blue-600">Devices</div>
                  </div>
                  <div className="text-center p-2 bg-yellow-50 rounded">
                    <div className="font-semibold text-yellow-700">12</div>
                    <div className="text-yellow-600">Active Alerts</div>
                  </div>
                  <div className="text-center p-2 bg-purple-50 rounded">
                    <div className="font-semibold text-purple-700">Enterprise</div>
                    <div className="text-purple-600">Plan</div>
                  </div>
                </div>
              </div>
              
              {/* Account Actions */}
              <div className="px-6 py-4">
                <div className="space-y-2">
                  <button className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 rounded flex items-center space-x-2">
                    <User className="w-4 h-4 text-gray-500" />
                    <span>Account Settings</span>
                  </button>
                  <button className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 rounded flex items-center space-x-2">
                    <Settings className="w-4 h-4 text-gray-500" />
                    <span>Company Preferences</span>
                  </button>
                  <button 
                    onClick={() => {
                      setShowProfileMenu(false);
                      navigate('/login');
                    }}
                    className="w-full text-left px-3 py-2 text-sm hover:bg-red-50 text-red-600 rounded flex items-center space-x-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

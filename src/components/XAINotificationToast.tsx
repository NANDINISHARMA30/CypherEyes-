import React, { useState, useEffect } from 'react';
import { Bell, X, AlertTriangle, Eye } from 'lucide-react';

interface XAINotification {
  id: string;
  title: string;
  description: string;
  severity: 'high' | 'medium' | 'low';
  timestamp: string;
  packetId: string;
}

interface XAINotificationToastProps {
  onOpenTicketManager: () => void;
}

const XAINotificationToast: React.FC<XAINotificationToastProps> = ({ onOpenTicketManager }) => {
  const [notifications, setNotifications] = useState<XAINotification[]>([]);
  const [currentNotification, setCurrentNotification] = useState<XAINotification | null>(null);
  const [isNotificationsEnabled, setIsNotificationsEnabled] = useState(true);
  const [lastNotificationTime, setLastNotificationTime] = useState<number>(0);

  // Demo notifications
  const demoNotifications: XAINotification[] = [
    {
      id: 'notif-001',
      title: 'SQL Injection Attack Detected',
      description: 'High-confidence attack from 192.168.1.100 targeting admin login',
      severity: 'high',
      timestamp: new Date().toISOString(),
      packetId: 'XAI-2024-001'
    },
    {
      id: 'notif-002',
      title: 'Potential Zero-Day Exploit',
      description: 'Unknown attack pattern detected from 203.45.67.89',
      severity: 'high',
      timestamp: new Date(Date.now() + 15000).toISOString(),
      packetId: 'XAI-2024-002'
    },
    {
      id: 'notif-003',
      title: 'Suspicious Data Transfer',
      description: 'Large encrypted data transfer during off-hours detected',
      severity: 'medium',
      timestamp: new Date(Date.now() + 30000).toISOString(),
      packetId: 'XAI-2024-003'
    }
  ];

  useEffect(() => {
    // Schedule demo notifications
    demoNotifications.forEach((notif, index) => {
      setTimeout(() => {
        setNotifications(prev => [...prev, notif]);
        setCurrentNotification(notif);
        
        // Auto-hide after 8 seconds
        setTimeout(() => {
          setCurrentNotification(null);
        }, 8000);
      }, index * 15000); // 15 seconds apart
    });

    // Simulate random new notifications
    const interval = setInterval(() => {
      if (Math.random() < 0.2) { // 20% chance every 30 seconds
        const randomNotif: XAINotification = {
          id: `notif-${Date.now()}`,
          title: ['Port Scan Detected', 'Brute Force Attempt', 'Malware Communication'][Math.floor(Math.random() * 3)],
          description: `Suspicious activity from ${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
          severity: Math.random() > 0.5 ? 'medium' : 'high',
          timestamp: new Date().toISOString(),
          packetId: `XAI-${Date.now()}`
        };
        
        setNotifications(prev => [...prev, randomNotif]);
        setCurrentNotification(randomNotif);
        
        setTimeout(() => {
          setCurrentNotification(null);
        }, 8000);
      }
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const handleDismiss = () => {
    setCurrentNotification(null);
  };

  const handleViewDetails = () => {
    onOpenTicketManager();
    setCurrentNotification(null);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'bg-red-500 border-red-600';
      case 'medium':
        return 'bg-orange-500 border-orange-600';
      case 'low':
        return 'bg-yellow-500 border-yellow-600';
      default:
        return 'bg-gray-500 border-gray-600';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'high':
      case 'medium':
        return <AlertTriangle className="w-5 h-5" />;
      default:
        return <Bell className="w-5 h-5" />;
    }
  };

  if (!currentNotification) return null;

  return (
    <div className="fixed top-4 right-4 z-50 animate-slide-in-right">
      <div className={`bg-white rounded-lg shadow-2xl border-l-4 ${getSeverityColor(currentNotification.severity)} max-w-sm`}>
        <div className="p-4">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-3">
              <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white ${getSeverityColor(currentNotification.severity)}`}>
                {getSeverityIcon(currentNotification.severity)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 mb-1">
                  {currentNotification.title}
                </p>
                <p className="text-sm text-gray-600 mb-2">
                  {currentNotification.description}
                </p>
                <p className="text-xs text-gray-500">
                  {new Date(currentNotification.timestamp).toLocaleTimeString()}
                </p>
              </div>
            </div>
            <button
              onClick={handleDismiss}
              className="flex-shrink-0 p-1 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          
          <div className="flex space-x-2 mt-4">
            <button
              onClick={handleViewDetails}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium py-2 px-3 rounded transition-colors flex items-center justify-center"
            >
              <Eye className="w-4 h-4 mr-1" />
              View Details
            </button>
            <button
              onClick={handleDismiss}
              className="px-3 py-2 text-xs font-medium text-gray-600 hover:text-gray-800 transition-colors"
            >
              Dismiss
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default XAINotificationToast;
import React, { useState } from 'react';
import NavigationBar from './NavigationBar';
import Footer from './Footer';
import XAINotificationToast from './XAINotificationToast';
import XAITicketManager from './XAITicketManager';

interface LayoutProps {
  children: React.ReactNode;
  currentPage?: string;
}

export default function Layout({ children, currentPage = 'Dashboard' }: LayoutProps) {
  const [showTicketManager, setShowTicketManager] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(
    localStorage.getItem('xai-notifications-enabled') === 'true' // Only true if explicitly enabled
  );

  const toggleNotifications = () => {
    const newState = !notificationsEnabled;
    setNotificationsEnabled(newState);
    localStorage.setItem('xai-notifications-enabled', newState.toString());
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <NavigationBar 
        currentPage={currentPage} 
        onOpenXAITickets={() => setShowTicketManager(true)}
        onToggleNotifications={toggleNotifications}
      />
      <main className="flex-1 p-6">
        <div className="max-w-[1400px] mx-auto">
          {children}
        </div>
      </main>
      <Footer />
      
      {/* XAI Notification System */}
      {notificationsEnabled && (
        <XAINotificationToast onOpenTicketManager={() => setShowTicketManager(true)} />
      )}
      <XAITicketManager 
        isOpen={showTicketManager} 
        onClose={() => setShowTicketManager(false)} 
      />
    </div>
  );
}
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

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <NavigationBar 
        currentPage={currentPage} 
        onOpenXAITickets={() => setShowTicketManager(true)}
      />
      <main className="flex-1 p-6">
        <div className="max-w-[1400px] mx-auto">
          {children}
        </div>
      </main>
      <Footer />
      
      {/* XAI Notification System */}
      <XAINotificationToast onOpenTicketManager={() => setShowTicketManager(true)} />
      <XAITicketManager 
        isOpen={showTicketManager} 
        onClose={() => setShowTicketManager(false)} 
      />
    </div>
  );
}
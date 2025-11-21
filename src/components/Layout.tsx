import React from 'react';
import NavigationBar from './NavigationBar';
import Footer from './Footer';

interface LayoutProps {
  children: React.ReactNode;
  currentPage?: string;
}

export default function Layout({ children, currentPage = 'Dashboard' }: LayoutProps) {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <NavigationBar currentPage={currentPage} />
      <main className="flex-1 p-6">
        <div className="max-w-[1400px] mx-auto">
          {children}
        </div>
      </main>
      <Footer />
    </div>
  );
}
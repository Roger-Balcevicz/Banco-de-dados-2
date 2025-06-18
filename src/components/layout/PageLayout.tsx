
import React from 'react';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';

interface PageLayoutProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

export function PageLayout({ title, children, className = '' }: PageLayoutProps) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = React.useState(false);

  const handleSidebarToggle = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  return (
    <div className={`min-h-screen bg-gray-50 ${className}`}>
      <Sidebar 
        isCollapsed={isSidebarCollapsed} 
        onToggle={handleSidebarToggle} 
      />
      <Navbar />
      {/* Conteúdo principal com ajuste responsivo */}
      <div className={`transition-all duration-300 pt-16 ${
        isSidebarCollapsed 
          ? 'ml-0 md:ml-16' 
          : 'ml-0 md:ml-64'
      }`}>
        <div className="p-4 md:p-6">
          <div className="mb-6">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{title}</h1>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}

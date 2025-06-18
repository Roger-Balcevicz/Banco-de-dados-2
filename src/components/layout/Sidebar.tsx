
import React from 'react';
import { 
  Package, Utensils, Users, TrendingUp, BarChart3, Settings, 
  ChevronRight, ChevronLeft, Home, AlertTriangle, Truck, Receipt, Menu
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Link, useLocation } from 'react-router-dom';

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
  className?: string;
}

interface NavItem {
  title: string;
  icon: React.ElementType;
  href: string;
  badge?: number;
}

export function Sidebar({ isCollapsed, onToggle, className }: SidebarProps) {
  const location = useLocation();
  const [isMobileOpen, setIsMobileOpen] = React.useState(false);
  
  const navItems = [
    {
      title: 'Dashboard',
      icon: Home,
      href: '/',
    },
    {
      title: 'Estoque',
      icon: Package,
      href: '/stocks',
      badge: 3
    },
    {
      title: 'Cardápio',
      icon: Utensils,
      href: '/analysis',
    },
    {
      title: 'Fornecedores',
      icon: Users,
      href: '/markets',
    },
    {
      title: 'Ordens de Compra',
      icon: Truck,
      href: '/purchase-orders',
      badge: 2
    },
    {
      title: 'Financeiro',
      icon: Receipt,
      href: '/portfolio',
    },
    {
      title: 'Configurações',
      icon: Settings,
      href: '/settings',
    }
  ];

  const handleNavClick = () => {
    // Fecha o menu mobile após navegar
    setIsMobileOpen(false);
  };

  return (
    <>
      {/* Botão mobile para abrir sidebar */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="fixed top-4 left-4 z-50 md:hidden h-8 w-8 bg-white/90 backdrop-blur-sm hover:bg-white text-orange-600"
      >
        <Menu className="h-4 w-4" />
      </Button>

      {/* Overlay mobile */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden" 
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "bg-gradient-to-b from-orange-800 via-red-900 to-yellow-800 text-white fixed top-0 left-0 h-screen z-50 transition-all duration-300 ease-in-out flex flex-col border-r border-orange-700/50 shadow-xl",
        // Mobile: só aparece quando isMobileOpen for true
        isMobileOpen ? "translate-x-0" : "-translate-x-full",
        // Desktop: sempre visível, apenas muda largura
        "md:translate-x-0",
        isCollapsed ? "md:w-16" : "md:w-64",
        // Mobile sempre largura fixa
        "w-64",
        className
      )}>
        <div className="flex h-16 items-center justify-center border-b border-orange-700/50 bg-black/20 relative">
          <h2 className={cn(
            "font-semibold tracking-tight transition-opacity duration-200 text-orange-100",
            isCollapsed ? "md:opacity-0" : "md:opacity-100"
          )}>
            Prato Cheio ERP
          </h2>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggle}
            className="absolute right-2 text-orange-200 h-8 w-8 hover:bg-white/20 transition-all duration-200 hidden md:flex"
          >
            {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>
        
        <ScrollArea className="flex-1 py-4">
          <nav className="grid gap-1 px-2">
            {navItems.map((item, index) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={index}
                  to={item.href}
                  onClick={handleNavClick}
                  className={cn(
                    "flex items-center gap-3 rounded-md px-3 py-2 transition-all duration-200 hover:bg-white/20 hover:scale-105 hover:shadow-lg group",
                    isActive ? "bg-white/30 text-white shadow-lg scale-105" : "text-orange-100 hover:text-white",
                    isCollapsed && "md:justify-center md:px-0"
                  )}
                >
                  <div className="relative">
                    <item.icon className="h-5 w-5 shrink-0 transition-transform group-hover:scale-110" />
                    {item.badge && !isCollapsed && (
                      <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-xs text-white flex items-center justify-center animate-pulse">
                        {item.badge}
                      </span>
                    )}
                  </div>
                  <span className={cn(
                    "text-sm font-medium transition-all duration-200",
                    isCollapsed ? "md:opacity-0 md:w-0" : "md:opacity-100"
                  )}>
                    {item.title}
                  </span>
                  {item.badge && isCollapsed && (
                    <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500 animate-pulse hidden md:block" />
                  )}
                </Link>
              );
            })}
          </nav>
        </ScrollArea>
        
        <div className="p-4 border-t border-orange-700/50 bg-black/20">
          <div className={cn(
            "transition-opacity duration-200 rounded-md bg-gradient-to-r from-orange-600/30 to-red-600/30 p-3 text-xs text-orange-100 backdrop-blur-sm border border-orange-500/30",
            isCollapsed ? "md:opacity-0" : "md:opacity-100"
          )}>
            <div className="flex items-center gap-2 mb-2">
              <div className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
              <p className="font-medium text-white">Status da Cozinha</p>
            </div>
            <p className="text-orange-200">Funcionando</p>
            <p className="text-[10px] text-orange-300">Expediente: 06:00 - 23:00</p>
          </div>
        </div>
      </aside>
    </>
  );
}

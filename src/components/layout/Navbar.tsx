
import React from 'react';
import { Search, Bell, User, ChefHat } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface NavbarProps {
  className?: string;
}

export function Navbar({ className }: NavbarProps) {
  return (
    <header className={cn("bg-gradient-to-r from-orange-600 via-red-600 to-yellow-600 fixed top-0 left-0 right-0 z-40 border-b shadow-lg", className)}>
      <div className="flex items-center justify-between h-16 px-4 ml-0 md:ml-16 lg:ml-64 transition-all duration-300">
        <div className="flex items-center gap-2 lg:gap-4">
          <div className="flex items-center gap-2 md:gap-3">
            <div className="p-1.5 md:p-2 bg-white/20 rounded-lg backdrop-blur-sm animate-float">
              <ChefHat className="h-5 w-5 md:h-6 md:w-6 text-white" />
            </div>
            <div>
              <h1 className="text-base md:text-lg lg:text-xl font-bold tracking-tight text-white drop-shadow-sm">
                Prato Cheio
              </h1>
              <p className="text-xs text-orange-100 hidden sm:block">Sistema de Gestão</p>
            </div>
          </div>
          
          <div className="relative hidden lg:flex items-center h-9 rounded-md px-3 text-white/80 focus-within:text-white bg-white/20 backdrop-blur-sm border border-white/30">
            <Search className="h-4 w-4 mr-2" />
            <Input 
              type="search" 
              placeholder="Buscar ingredientes, fornecedores..." 
              className="h-9 w-[200px] xl:w-[320px] bg-transparent border-none px-0 py-0 shadow-none focus-visible:ring-0 placeholder:text-white/60 text-white"
            />
          </div>
        </div>
        
        <div className="flex items-center gap-2 md:gap-4">
          <Button 
            variant="ghost" 
            size="icon" 
            className="relative h-8 w-8 md:h-9 md:w-9 text-white hover:bg-white/20 transition-all duration-200"
          >
            <Bell className="h-4 w-4 md:h-5 md:w-5" />
            <span className="absolute top-0.5 right-0.5 md:top-1 md:right-1 h-2 w-2 rounded-full bg-yellow-400 animate-pulse shadow-sm" />
          </Button>
          
          <Avatar className="h-8 w-8 md:h-9 md:w-9 transition-transform duration-200 hover:scale-105 ring-2 ring-white/30">
            <AvatarFallback className="bg-white/20 text-white backdrop-blur-sm">
              <User className="h-4 w-4 md:h-5 md:w-5" />
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
}

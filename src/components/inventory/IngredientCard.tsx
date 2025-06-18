
import React from 'react';
import { Package, AlertTriangle, Calendar, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Ingredient } from '@/utils/restaurantApi';
import { Sparkline } from '@/components/stocks/Sparkline';

interface IngredientCardProps {
  ingredient: Ingredient;
  stockHistory: Array<{ date: string; value: number }>;
  onClick: () => void;
  className?: string;
}

export function IngredientCard({ ingredient, stockHistory, onClick, className }: IngredientCardProps) {
  const isLowStock = ingredient.currentStock <= ingredient.minStock;
  const isExpiringSoon = new Date(ingredient.expiryDate) <= new Date(Date.now() + 3 * 24 * 60 * 60 * 1000);
  
  const stockPercentage = (ingredient.currentStock / ingredient.maxStock) * 100;
  
  const getStockColor = () => {
    if (isLowStock) return 'text-red-600';
    if (stockPercentage < 50) return 'text-yellow-600';
    return 'text-green-600';
  };
  
  const getStockBgColor = () => {
    if (isLowStock) return 'bg-red-100 border-red-200';
    if (stockPercentage < 50) return 'bg-yellow-100 border-yellow-200';
    return 'bg-green-100 border-green-200';
  };

  // Convert stockHistory to the format expected by Sparkline (number array)
  const sparklineData = stockHistory.map(item => item.value);

  return (
    <div 
      onClick={onClick}
      className={cn(
        "p-4 rounded-lg border cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105 group bg-white/80 backdrop-blur-sm",
        getStockBgColor(),
        isLowStock && "animate-pulse-gentle",
        className
      )}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          {ingredient.image ? (
            <img 
              src={ingredient.image} 
              alt={ingredient.name}
              className="w-10 h-10 rounded-lg object-cover border border-white/50 shadow-sm group-hover:scale-110 transition-transform duration-200"
            />
          ) : (
            <div className="w-10 h-10 rounded-lg bg-orange-200 flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
              <Package className="h-5 w-5 text-orange-600" />
            </div>
          )}
          <div>
            <h3 className="font-semibold text-gray-800 group-hover:text-gray-900 transition-colors">
              {ingredient.name}
            </h3>
            <p className="text-xs text-gray-600">{ingredient.category}</p>
          </div>
        </div>
        
        {(isLowStock || isExpiringSoon) && (
          <AlertTriangle className="h-4 w-4 text-red-500 animate-bounce" />
        )}
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Estoque:</span>
          <span className={cn("font-semibold", getStockColor())}>
            {ingredient.currentStock} {ingredient.unit}
          </span>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
          <div 
            className={cn(
              "h-2 rounded-full transition-all duration-500 ease-out",
              isLowStock ? "bg-red-500" : stockPercentage < 50 ? "bg-yellow-500" : "bg-green-500"
            )}
            style={{ width: `${Math.min(stockPercentage, 100)}%` }}
          />
        </div>
        
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            <span>Vence: {new Date(ingredient.expiryDate).toLocaleDateString('pt-BR')}</span>
          </div>
        </div>
        
        <div className="flex items-center gap-1 text-xs text-gray-500">
          <MapPin className="h-3 w-3" />
          <span>{ingredient.location}</span>
        </div>
        
        <div className="mt-2 h-8">
          <Sparkline 
            data={sparklineData} 
            className="opacity-60 group-hover:opacity-100 transition-opacity duration-200"
          />
        </div>
      </div>
    </div>
  );
}

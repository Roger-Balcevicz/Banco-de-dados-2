
import React from 'react';
import { Users, Star, Clock, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Supplier } from '@/utils/restaurantApi';

interface SupplierOverviewProps {
  suppliers: Supplier[];
  className?: string;
}

export function SupplierOverview({ suppliers, className }: SupplierOverviewProps) {
  const activeSuppliers = suppliers.filter(s => s.status === 'active');
  const avgRating = suppliers.reduce((sum, s) => sum + s.rating, 0) / suppliers.length;
  const avgReliability = suppliers.reduce((sum, s) => sum + s.reliability, 0) / suppliers.length;

  return (
    <div className={cn("p-4 rounded-lg border bg-white/90 backdrop-blur-sm shadow-lg hover:shadow-xl transition-shadow duration-300", className)}>
      <div className="flex items-center gap-2 mb-4">
        <div className="p-2 bg-blue-100 rounded-lg">
          <Users className="h-5 w-5 text-blue-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-800">Fornecedores</h3>
      </div>
      
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center justify-center gap-1 mb-1">
              <CheckCircle className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-700">Ativos</span>
            </div>
            <p className="text-xl font-bold text-blue-800">{activeSuppliers.length}</p>
          </div>
          
          <div className="text-center p-3 bg-yellow-50 rounded-lg border border-yellow-200">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Star className="h-4 w-4 text-yellow-600" />
              <span className="text-sm font-medium text-yellow-700">Avaliação</span>
            </div>
            <p className="text-xl font-bold text-yellow-800">{avgRating.toFixed(1)}</p>
          </div>
        </div>
        
        <div className="space-y-3">
          {suppliers.slice(0, 3).map((supplier) => (
            <div key={supplier.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200 group">
              <div className="flex-1">
                <h4 className="font-medium text-gray-800 group-hover:text-gray-900">{supplier.name}</h4>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex items-center gap-1">
                    <Star className="h-3 w-3 text-yellow-500 fill-current" />
                    <span className="text-xs text-gray-600">{supplier.rating}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3 text-gray-500" />
                    <span className="text-xs text-gray-600">{supplier.deliveryTime}</span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1 mt-2">
                  {supplier.specialties.slice(0, 2).map((specialty) => (
                    <span key={specialty} className="px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded-full">
                      {specialty}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="text-right">
                <div className={cn(
                  "w-2 h-2 rounded-full ml-auto mb-1",
                  supplier.status === 'active' ? "bg-green-500 animate-pulse" : "bg-gray-400"
                )} />
                <div className="text-xs text-gray-600">
                  {supplier.reliability}% confiável
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="pt-2 border-t border-gray-200">
          <div className="text-center">
            <p className="text-sm text-gray-600">Confiabilidade Média</p>
            <p className="text-lg font-semibold text-green-600">{avgReliability.toFixed(1)}%</p>
          </div>
        </div>
      </div>
    </div>
  );
}

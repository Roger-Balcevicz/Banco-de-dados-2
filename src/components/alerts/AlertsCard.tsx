
import React from 'react';
import { AlertTriangle, Info, XCircle, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Alert } from '@/utils/restaurantApi';

interface AlertsCardProps {
  alerts: Alert[];
  className?: string;
}

export function AlertsCard({ alerts, className }: AlertsCardProps) {
  const getAlertIcon = (type: Alert['type']) => {
    switch (type) {
      case 'low_stock': return AlertTriangle;
      case 'expiring': return Clock;
      case 'delivery_delay': return Info;
      case 'quality_issue': return XCircle;
      default: return Info;
    }
  };
  
  const getAlertColor = (severity: Alert['severity']) => {
    switch (severity) {
      case 'error': return 'border-l-red-500 bg-red-50';
      case 'warning': return 'border-l-yellow-500 bg-yellow-50';
      case 'info': return 'border-l-blue-500 bg-blue-50';
      default: return 'border-l-gray-500 bg-gray-50';
    }
  };
  
  const getIconColor = (severity: Alert['severity']) => {
    switch (severity) {
      case 'error': return 'text-red-600';
      case 'warning': return 'text-yellow-600';
      case 'info': return 'text-blue-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className={cn("p-4 rounded-lg border bg-white/90 backdrop-blur-sm shadow-lg hover:shadow-xl transition-shadow duration-300", className)}>
      <div className="flex items-center gap-2 mb-4">
        <div className="p-2 bg-red-100 rounded-lg">
          <AlertTriangle className="h-5 w-5 text-red-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-800">Alertas do Sistema</h3>
        {alerts.filter(alert => alert.actionRequired).length > 0 && (
          <span className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full font-medium animate-pulse">
            {alerts.filter(alert => alert.actionRequired).length} ação necessária
          </span>
        )}
      </div>
      
      <div className="space-y-3 max-h-80 overflow-y-auto">
        {alerts.map((alert) => {
          const AlertIcon = getAlertIcon(alert.type);
          
          return (
            <div 
              key={alert.id} 
              className={cn(
                "p-3 rounded-lg border-l-4 transition-all duration-200 hover:scale-102 group",
                getAlertColor(alert.severity),
                alert.actionRequired && "animate-pulse-gentle"
              )}
            >
              <div className="flex items-start gap-3">
                <div className={cn("p-1 rounded-full bg-white shadow-sm group-hover:scale-110 transition-transform duration-200", getIconColor(alert.severity))}>
                  <AlertIcon className="h-4 w-4" />
                </div>
                
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-1">
                    <h4 className="font-medium text-gray-800 group-hover:text-gray-900">{alert.title}</h4>
                    {alert.actionRequired && (
                      <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded-full font-medium">
                        Ação necessária
                      </span>
                    )}
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-2">{alert.message}</p>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">
                      {new Date(alert.timestamp).toLocaleString('pt-BR')}
                    </span>
                    
                    {alert.ingredient && (
                      <span className="px-2 py-1 bg-white border border-gray-200 text-xs rounded-full text-gray-700">
                        {alert.ingredient}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              
              {alert.actionRequired && (
                <div className="mt-3 pt-2 border-t border-gray-200">
                  <button className="text-sm text-orange-600 hover:text-orange-700 font-medium transition-colors duration-200 hover:underline">
                    Resolver agora
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
      
      {alerts.length === 0 && (
        <div className="text-center py-8">
          <div className="p-3 bg-green-100 rounded-full w-16 h-16 mx-auto mb-3 flex items-center justify-center">
            <AlertTriangle className="h-8 w-8 text-green-600" />
          </div>
          <p className="text-gray-600">Nenhum alerta no momento</p>
          <p className="text-sm text-gray-500">Tudo funcionando perfeitamente!</p>
        </div>
      )}
    </div>
  );
}

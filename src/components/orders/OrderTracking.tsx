
import React from 'react';
import { Truck, Clock, CheckCircle, Package, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Order } from '@/utils/restaurantApi';

interface OrderTrackingProps {
  orders: Order[];
  className?: string;
}

export function OrderTracking({ orders, className }: OrderTrackingProps) {
  const getStatusIcon = (status: Order['status']) => {
    switch (status) {
      case 'pending': return Clock;
      case 'confirmed': return CheckCircle;
      case 'shipped': return Truck;
      case 'delivered': return Package;
      case 'cancelled': return AlertCircle;
      default: return Clock;
    }
  };
  
  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'confirmed': return 'text-blue-600 bg-blue-100';
      case 'shipped': return 'text-purple-600 bg-purple-100';
      case 'delivered': return 'text-green-600 bg-green-100';
      case 'cancelled': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };
  
  const getPriorityColor = (priority: Order['priority']) => {
    switch (priority) {
      case 'low': return 'border-l-gray-400';
      case 'medium': return 'border-l-yellow-400';
      case 'high': return 'border-l-orange-400';
      case 'urgent': return 'border-l-red-400 animate-pulse-gentle';
      default: return 'border-l-gray-400';
    }
  };

  return (
    <div className={cn("p-4 rounded-lg border bg-white/90 backdrop-blur-sm shadow-lg hover:shadow-xl transition-shadow duration-300", className)}>
      <div className="flex items-center gap-2 mb-4">
        <div className="p-2 bg-purple-100 rounded-lg">
          <Truck className="h-5 w-5 text-purple-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-800">Pedidos Recentes</h3>
      </div>
      
      <div className="space-y-3">
        {orders.map((order) => {
          const StatusIcon = getStatusIcon(order.status);
          
          return (
            <div 
              key={order.id} 
              className={cn(
                "p-3 bg-gray-50 rounded-lg border-l-4 hover:bg-gray-100 transition-colors duration-200 group",
                getPriorityColor(order.priority)
              )}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className={cn("p-1 rounded-full", getStatusColor(order.status))}>
                    <StatusIcon className="h-3 w-3" />
                  </div>
                  <h4 className="font-medium text-gray-800 group-hover:text-gray-900">{order.id}</h4>
                </div>
                <span className={cn(
                  "px-2 py-1 text-xs rounded-full font-medium",
                  order.priority === 'urgent' ? 'bg-red-100 text-red-700' :
                  order.priority === 'high' ? 'bg-orange-100 text-orange-700' :
                  order.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-gray-100 text-gray-700'
                )}>
                  {order.priority}
                </span>
              </div>
              
              <div className="space-y-1 mb-2">
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Fornecedor:</span> {order.supplier}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Entrega:</span> {new Date(order.expectedDelivery).toLocaleDateString('pt-BR')}
                </p>
                <p className="text-sm text-green-600 font-semibold">
                  R$ {order.totalValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
              </div>
              
              <div className="space-y-1">
                {order.items.slice(0, 2).map((item, index) => (
                  <div key={index} className="text-xs text-gray-500 bg-white rounded px-2 py-1">
                    {item.quantity} {item.unit} de {item.ingredient}
                  </div>
                ))}
                {order.items.length > 2 && (
                  <div className="text-xs text-gray-400 italic">
                    +{order.items.length - 2} item(s) mais...
                  </div>
                )}
              </div>
              
              <div className="mt-2 w-full bg-gray-200 rounded-full h-1">
                <div 
                  className={cn(
                    "h-1 rounded-full transition-all duration-500",
                    order.status === 'pending' ? 'bg-yellow-500 w-1/4' :
                    order.status === 'confirmed' ? 'bg-blue-500 w-2/4' :
                    order.status === 'shipped' ? 'bg-purple-500 w-3/4' :
                    order.status === 'delivered' ? 'bg-green-500 w-full' :
                    'bg-red-500 w-0'
                  )}
                />
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="mt-4 pt-3 border-t border-gray-200 text-center">
        <button className="text-sm text-orange-600 hover:text-orange-700 font-medium transition-colors duration-200 hover:underline">
          Ver todos os pedidos
        </button>
      </div>
    </div>
  );
}

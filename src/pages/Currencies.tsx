
import React, { useState } from 'react';
import { PageLayout } from '@/components/layout/PageLayout';
import { useInventoryData, mockOrders } from '@/utils/restaurantApi';
import { OrderTracking } from '@/components/orders/OrderTracking';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Truck, Package, Clock, CheckCircle, XCircle, AlertTriangle, Calendar, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const Currencies = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  
  const orders = useInventoryData(mockOrders);
  
  // Filtrar pedidos
  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.supplier.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });
  
  // Estatísticas dos pedidos
  const totalOrders = orders.length;
  const pendingOrders = orders.filter(o => o.status === 'pending' || o.status === 'confirmed').length;
  const shippedOrders = orders.filter(o => o.status === 'shipped').length;
  const deliveredOrders = orders.filter(o => o.status === 'delivered').length;
  const totalValue = orders.reduce((sum, o) => sum + o.totalValue, 0);
  
  const statusOptions = [
    { value: 'all', label: 'Todos', icon: Package },
    { value: 'pending', label: 'Pendente', icon: Clock },
    { value: 'confirmed', label: 'Confirmado', icon: CheckCircle },
    { value: 'shipped', label: 'Enviado', icon: Truck },
    { value: 'delivered', label: 'Entregue', icon: CheckCircle },
  ];
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'confirmed': return <CheckCircle className="h-4 w-4 text-blue-500" />;
      case 'shipped': return <Truck className="h-4 w-4 text-purple-500" />;
      case 'delivered': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'cancelled': return <XCircle className="h-4 w-4 text-red-500" />;
      default: return <Package className="h-4 w-4 text-gray-500" />;
    }
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'confirmed': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'shipped': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'delivered': return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <PageLayout title="Pedidos e Entregas">
      <div className="space-y-6">
        {/* Estatísticas dos Pedidos */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-blue-700 flex items-center gap-2">
                <Package className="h-4 w-4" />
                Total Pedidos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-800">{totalOrders}</div>
              <p className="text-xs text-blue-600">pedidos ativos</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-yellow-700 flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Pendentes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-800">{pendingOrders}</div>
              <p className="text-xs text-yellow-600">aguardando</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-purple-700 flex items-center gap-2">
                <Truck className="h-4 w-4" />
                Em Trânsito
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-800">{shippedOrders}</div>
              <p className="text-xs text-purple-600">a caminho</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-green-700 flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                Entregues
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-800">{deliveredOrders}</div>
              <p className="text-xs text-green-600">concluídos</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-orange-700 flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Valor Total
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-800">
                R$ {totalValue.toLocaleString('pt-BR')}
              </div>
              <p className="text-xs text-orange-600">em pedidos</p>
            </CardContent>
          </Card>
        </div>
        
        {/* Filtros e Busca */}
        <div className="flex flex-col sm:flex-row gap-4 bg-white p-4 rounded-lg border shadow-sm">
          <div className="flex-1">
            <Input
              placeholder="Buscar por ID do pedido ou fornecedor..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {statusOptions.map((status) => (
              <Button
                key={status.value}
                variant={statusFilter === status.value ? "default" : "outline"}
                size="sm"
                onClick={() => setStatusFilter(status.value)}
                className="flex items-center gap-2"
              >
                <status.icon className="h-3 w-3" />
                {status.label}
              </Button>
            ))}
          </div>
        </div>
        
        {/* Conteúdo Principal */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Lista de Pedidos */}
          <div className="lg:col-span-1">
            <OrderTracking orders={filteredOrders} />
          </div>
          
          {/* Detalhes dos Pedidos */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <Package className="h-5 w-5 text-orange-600" />
                  </div>
                  Lista Detalhada de Pedidos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredOrders.map((order) => (
                    <div key={order.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-semibold text-gray-800">{order.id}</h4>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(order.status)}`}>
                              {getStatusIcon(order.status)}
                              <span className="ml-1 capitalize">{order.status}</span>
                            </span>
                          </div>
                          <p className="text-sm text-gray-600">{order.supplier}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-lg">R$ {order.totalValue.toLocaleString('pt-BR')}</p>
                          <p className="text-xs text-gray-500">
                            {order.priority === 'urgent' && <AlertTriangle className="inline h-3 w-3 text-red-500 mr-1" />}
                            Prioridade: {order.priority}
                          </p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Calendar className="h-4 w-4" />
                          <span>Pedido: {new Date(order.orderDate).toLocaleDateString('pt-BR')}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Truck className="h-4 w-4" />
                          <span>Entrega: {new Date(order.expectedDelivery).toLocaleDateString('pt-BR')}</span>
                        </div>
                      </div>
                      
                      <div>
                        <h5 className="font-medium text-gray-700 mb-2">Itens do Pedido:</h5>
                        <div className="grid grid-cols-1 gap-1">
                          {order.items.map((item, index) => (
                            <div key={index} className="flex justify-between text-sm">
                              <span>{item.ingredient}</span>
                              <span className="text-gray-600">{item.quantity} {item.unit}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default Currencies;

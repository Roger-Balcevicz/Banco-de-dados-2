
import React, { useState } from 'react';
import { PageLayout } from '@/components/layout/PageLayout';
import { mockAlerts } from '@/utils/restaurantApi';
import { AlertsCard } from '@/components/alerts/AlertsCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, Shield, CheckCircle, Info, Bell, Clock, Filter, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const Global = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [severityFilter, setSeverityFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  
  // Simular mais alertas para demonstração
  const allAlerts = [
    ...mockAlerts,
    {
      id: '4',
      type: 'quality_issue' as const,
      title: 'Problema de Qualidade: Tomate',
      message: 'Lote do tomate apresenta sinais de deterioração precoce',
      severity: 'warning' as const,
      timestamp: '2024-06-16T07:45:00Z',
      ingredient: 'Tomate',
      actionRequired: true
    },
    {
      id: '5',
      type: 'low_stock' as const,
      title: 'Estoque Crítico: Óleo de Soja',
      message: 'Óleo de Soja está em nível crítico (3L restantes)',
      severity: 'error' as const,
      timestamp: '2024-06-16T06:30:00Z',
      ingredient: 'Óleo de Soja',
      actionRequired: true
    },
    {
      id: '6',
      type: 'delivery_delay' as const,
      title: 'Entrega Confirmada',
      message: 'Pedido ORD-003 foi entregue com sucesso',
      severity: 'info' as const,
      timestamp: '2024-06-16T05:15:00Z',
      actionRequired: false
    }
  ];
  
  // Filtrar alertas
  const filteredAlerts = allAlerts.filter(alert => {
    const matchesSearch = alert.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         alert.message.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSeverity = severityFilter === 'all' || alert.severity === severityFilter;
    const matchesType = typeFilter === 'all' || alert.type === typeFilter;
    return matchesSearch && matchesSeverity && matchesType;
  });
  
  // Estatísticas dos alertas
  const totalAlerts = allAlerts.length;
  const errorAlerts = allAlerts.filter(a => a.severity === 'error').length;
  const warningAlerts = allAlerts.filter(a => a.severity === 'warning').length;
  const infoAlerts = allAlerts.filter(a => a.severity === 'info').length;
  const actionRequired = allAlerts.filter(a => a.actionRequired).length;
  
  const severityOptions = [
    { value: 'all', label: 'Todas', icon: Bell },
    { value: 'error', label: 'Críticos', icon: AlertTriangle },
    { value: 'warning', label: 'Avisos', icon: Shield },
    { value: 'info', label: 'Informações', icon: Info },
  ];
  
  const typeOptions = [
    { value: 'all', label: 'Todos Tipos' },
    { value: 'low_stock', label: 'Estoque Baixo' },
    { value: 'expiring', label: 'Vencimento' },
    { value: 'delivery_delay', label: 'Entrega' },
    { value: 'quality_issue', label: 'Qualidade' },
  ];
  
  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'error': return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'warning': return <Shield className="h-4 w-4 text-yellow-500" />;
      case 'info': return <Info className="h-4 w-4 text-blue-500" />;
      default: return <Bell className="h-4 w-4 text-gray-500" />;
    }
  };
  
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'error': return 'bg-red-100 text-red-800 border-red-200';
      case 'warning': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'info': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <PageLayout title="Central de Alertas e Notificações">
      <div className="space-y-6">
        {/* Estatísticas dos Alertas */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Card className="bg-gradient-to-br from-gray-50 to-gray-100 border-gray-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <Bell className="h-4 w-4" />
                Total Alertas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-800">{totalAlerts}</div>
              <p className="text-xs text-gray-600">notificações ativas</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-red-700 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" />
                Críticos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-800">{errorAlerts}</div>
              <p className="text-xs text-red-600">requer ação imediata</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-yellow-700 flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Avisos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-800">{warningAlerts}</div>
              <p className="text-xs text-yellow-600">monitoramento</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-blue-700 flex items-center gap-2">
                <Info className="h-4 w-4" />
                Informações
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-800">{infoAlerts}</div>
              <p className="text-xs text-blue-600">atualizações</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-orange-700 flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                Ação Necessária
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-800">{actionRequired}</div>
              <p className="text-xs text-orange-600">pendentes</p>
            </CardContent>
          </Card>
        </div>
        
        {/* Filtros e Busca */}
        <div className="space-y-4 bg-white p-4 rounded-lg border shadow-sm">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Buscar alertas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex gap-2 flex-wrap">
              <span className="text-sm font-medium text-gray-700 flex items-center">
                <Filter className="h-4 w-4 mr-1" />
                Severidade:
              </span>
              {severityOptions.map((severity) => (
                <Button
                  key={severity.value}
                  variant={severityFilter === severity.value ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSeverityFilter(severity.value)}
                  className="flex items-center gap-2"
                >
                  <severity.icon className="h-3 w-3" />
                  {severity.label}
                </Button>
              ))}
            </div>
          </div>
          
          <div className="flex gap-2 flex-wrap">
            <span className="text-sm font-medium text-gray-700">Tipo:</span>
            {typeOptions.map((type) => (
              <Button
                key={type.value}
                variant={typeFilter === type.value ? "default" : "outline"}
                size="sm"
                onClick={() => setTypeFilter(type.value)}
              >
                {type.label}
              </Button>
            ))}
          </div>
        </div>
        
        {/* Conteúdo Principal */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Lista de Alertas */}
          <div className="lg:col-span-1">
            <AlertsCard alerts={filteredAlerts} />
          </div>
          
          {/* Detalhes dos Alertas */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <Bell className="h-5 w-5 text-orange-600" />
                  </div>
                  Lista Detalhada de Alertas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredAlerts.map((alert) => (
                    <div key={alert.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-semibold text-gray-800">{alert.title}</h4>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getSeverityColor(alert.severity)}`}>
                              {getSeverityIcon(alert.severity)}
                              <span className="ml-1 capitalize">{alert.severity}</span>
                            </span>
                            {alert.actionRequired && (
                              <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">
                                Ação Requerida
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{alert.message}</p>
                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              <span>{new Date(alert.timestamp).toLocaleString('pt-BR')}</span>
                            </div>
                            {alert.ingredient && (
                              <div className="flex items-center gap-1">
                                <span>Ingrediente: {alert.ingredient}</span>
                              </div>
                            )}
                            <div className="flex items-center gap-1">
                              <span>Tipo: {alert.type.replace('_', ' ')}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {alert.actionRequired && (
                        <div className="pt-3 border-t">
                          <div className="flex gap-2">
                            <Button size="sm" className="bg-orange-600 hover:bg-orange-700">
                              Resolver
                            </Button>
                            <Button size="sm" variant="outline">
                              Adiar
                            </Button>
                            <Button size="sm" variant="outline">
                              Marcar como Lido
                            </Button>
                          </div>
                        </div>
                      )}
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

export default Global;


import React, { useState, useMemo } from 'react';
import { PageLayout } from '@/components/layout/PageLayout';
import { useOrdensCompra } from '@/hooks/useSupabaseData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ShoppingCart, Plus, ChevronUp, ChevronDown, Filter, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CreateOrderDialog } from '@/components/purchase-orders/CreateOrderDialog';
import { ViewOrderItemsDialog } from '@/components/purchase-orders/ViewOrderItemsDialog';
import { EditOrderItemsDialog } from '@/components/purchase-orders/EditOrderItemsDialog';

const PurchaseOrders = () => {
  const { ordens, loading: loadingOrdens, refetch } = useOrdensCompra();
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [statusFilter, setStatusFilter] = useState<number>(0);
  const [dateFrom, setDateFrom] = useState<string>('');
  const [dateTo, setDateTo] = useState<string>('');

  // Filtrar e ordenar ordens
  const filteredAndSortedOrdens = useMemo(() => {
    let filtered = [...ordens];

    // Filtro por status
    if (statusFilter !== 0) {
      filtered = filtered.filter(ordem => ordem.status_id === statusFilter);
    }

    // Filtro por período
    if (dateFrom) {
      filtered = filtered.filter(ordem => 
        new Date(ordem.data_ordem) >= new Date(dateFrom)
      );
    }
    if (dateTo) {
      filtered = filtered.filter(ordem => 
        new Date(ordem.data_ordem) <= new Date(dateTo)
      );
    }

    // Ordenação por código
    return filtered.sort((a, b) => {
      if (sortOrder === 'desc') {
        return b.codordem - a.codordem;
      } else {
        return a.codordem - b.codordem;
      }
    });
  }, [ordens, sortOrder, statusFilter, dateFrom, dateTo]);

  const toggleSortOrder = () => {
    setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
  };

  if (loadingOrdens) {
    return (
      <PageLayout title="Ordens de Compra">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-orange-600 border-t-transparent mx-auto mb-4">
              <div className="h-8 w-8 bg-orange-600 rounded-full mx-auto mt-2 relative">
                <div className="absolute inset-1 bg-white rounded-full"></div>
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-1 h-2 bg-orange-600 rounded-t"></div>
              </div>
            </div>
            <p className="text-gray-600 animate-pulse">Carregando ordens de compra...</p>
          </div>
        </div>
      </PageLayout>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pendente':
        return 'bg-yellow-100 text-yellow-800';
      case 'aprovado':
        return 'bg-blue-100 text-blue-800';
      case 'recebido':
        return 'bg-green-100 text-green-800';
      case 'cancelado':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <PageLayout title="Ordens de Compra">
      <div className="space-y-6">
        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-blue-700 flex items-center gap-2">
                <ShoppingCart className="h-4 w-4" />
                Total de Ordens
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-800">{ordens.length}</div>
              <p className="text-xs text-blue-600">registradas</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-yellow-700 flex items-center gap-2">
                <ShoppingCart className="h-4 w-4" />
                Pendentes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-800">
                {ordens.filter(o => o.status === 'pendente').length}
              </div>
              <p className="text-xs text-yellow-600">aguardando</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-green-700 flex items-center gap-2">
                <ShoppingCart className="h-4 w-4" />
                Recebidas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-800">
                {ordens.filter(o => o.status === 'recebido').length}
              </div>
              <p className="text-xs text-green-600">finalizadas</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-red-700 flex items-center gap-2">
                <ShoppingCart className="h-4 w-4" />
                Canceladas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-800">
                {ordens.filter(o => o.status === 'cancelado').length}
              </div>
              <p className="text-xs text-red-600">canceladas</p>
            </CardContent>
          </Card>
        </div>

        {/* Filtros */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-orange-600" />
              Filtros
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Status</label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Todos os status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={0}>Todos</SelectItem>
                    <SelectItem value={1}>Pendente</SelectItem>
                    <SelectItem value={2}>Recebido</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Data Inicial</label>
                <Input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Data Final</label>
                <Input
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">&nbsp;</label>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setStatusFilter(0);
                    setDateFrom('');
                    setDateTo('');
                  }}
                  className="w-full"
                >
                  Limpar Filtros
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Controles */}
        <div className="flex justify-between items-center bg-white p-4 rounded-lg border shadow-sm">
          <h2 className="text-lg font-semibold">Lista de Ordens ({filteredAndSortedOrdens.length})</h2>
          <CreateOrderDialog onOrderCreated={refetch} />
        </div>

        {/* Tabela de Ordens */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5 text-orange-600" />
              Ordens de Compra
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead 
                    className="cursor-pointer hover:bg-gray-50 select-none"
                    onClick={toggleSortOrder}
                  >
                    <div className="flex items-center gap-2">
                      Código
                      {sortOrder === 'desc' ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronUp className="h-4 w-4" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Fornecedor</TableHead>
                  <TableHead>Setor</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAndSortedOrdens.map((ordem) => (
                  <TableRow key={ordem.codordem}>
                    <TableCell className="font-medium">
                      #{ordem.codordem}
                    </TableCell>
                    <TableCell>
                      {new Date(ordem.data_ordem).toLocaleDateString('pt-BR')}
                    </TableCell>
                    <TableCell>
                      {ordem.fornecedor?.nome || 'N/A'}
                    </TableCell>
                    <TableCell>
                      {ordem.setor?.nome || 'N/A'}
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(ordem.status || 'pendente')}>
                        {ordem.status || 'pendente'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <ViewOrderItemsDialog 
                          codordem={ordem.codordem}
                        />
                        <EditOrderItemsDialog 
                          codordem={ordem.codordem}
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            
            {filteredAndSortedOrdens.length === 0 && (
              <div className="text-center py-8">
                <ShoppingCart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Nenhuma ordem de compra encontrada com os filtros aplicados</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
};

export default PurchaseOrders;

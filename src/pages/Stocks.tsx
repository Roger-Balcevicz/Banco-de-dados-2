
import React from 'react';
import { PageLayout } from '@/components/layout/PageLayout';
import { useIngredientes } from '@/hooks/useSupabaseData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, AlertTriangle, TrendingUp, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CreateIngredientDialog } from '@/components/stocks/CreateIngredientDialog';
import { Loading } from '@/components/ui/loading';

const Stocks = () => {
  const { ingredientes, loading, refetch } = useIngredientes();

  if (loading) {
    return (
      <PageLayout title="Controle de Estoque">
        <div className="flex items-center justify-center h-64">
          <Loading message="Carregando estoque..." />
        </div>
      </PageLayout>
    );
  }

  // Cálculos para as estatísticas
  const totalItems = ingredientes.length;
  const lowStockItems = ingredientes.filter(item => item.estoque_atual < item.estoque_minimo).length;
  const outOfStockItems = ingredientes.filter(item => item.estoque_atual === 0).length;
  // Estimativa simples de valor total sem preco_unitario
  const totalValue = ingredientes.reduce((sum, item) => sum + (item.estoque_atual * 5), 0); // Valor estimado de R$ 5 por unidade

  const handleIngredientCreated = () => {
    refetch();
  };

  return (
    <PageLayout title="Controle de Estoque">
      <div className="space-y-6">
        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-blue-700 flex items-center gap-2">
                <Package className="h-4 w-4" />
                Total de Itens
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-800">{totalItems}</div>
              <p className="text-xs text-blue-600">ingredientes cadastrados</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-red-700 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" />
                Estoque Baixo
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-800">{lowStockItems}</div>
              <p className="text-xs text-red-600">precisam reposição</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-yellow-700 flex items-center gap-2">
                <Package className="h-4 w-4" />
                Sem Estoque
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-800">{outOfStockItems}</div>
              <p className="text-xs text-yellow-600">itens zerados</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-green-700 flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Valor Estimado
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-800">
                R$ {totalValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </div>
              <p className="text-xs text-green-600">em estoque</p>
            </CardContent>
          </Card>
        </div>

        {/* Controles */}
        <div className="flex justify-between items-center bg-white p-4 rounded-lg border shadow-sm">
          <h2 className="text-lg font-semibold">Ingredientes em Estoque</h2>
          <CreateIngredientDialog onIngredientCreated={handleIngredientCreated} />
        </div>

        {/* Lista de Ingredientes */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {ingredientes.map((ingrediente) => (
            <Card key={ingrediente.codingrediente} className="p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold">{ingrediente.nome}</h3>
                {ingrediente.estoque_atual < ingrediente.estoque_minimo && (
                  <AlertTriangle className="h-4 w-4 text-red-500" />
                )}
              </div>
              <p className="text-sm text-gray-600 mb-2">{ingrediente.descricao}</p>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>Estoque Atual:</span>
                  <span className={ingrediente.estoque_atual < ingrediente.estoque_minimo ? 'text-red-600 font-semibold' : 'text-green-600'}>
                    {ingrediente.estoque_atual} {ingrediente.unidade_medida}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Estoque Mínimo:</span>
                  <span>{ingrediente.estoque_minimo} {ingrediente.unidade_medida}</span>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {ingredientes.length === 0 && (
          <div className="text-center py-12">
            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">Nenhum ingrediente cadastrado</p>
          </div>
        )}
      </div>
    </PageLayout>
  );
};

export default Stocks;

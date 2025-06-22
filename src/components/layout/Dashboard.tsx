import React from 'react';
import { useEstatisticas, useIngredientes, useFornecedores, useOrdensCompra, useMovimentacaoEstoque } from '@/hooks/useSupabaseData';
import { StatsCard } from '@/components/ui/StatsCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ChefHat, Package, AlertTriangle, Activity, Users, FileText } from 'lucide-react';

export function Dashboard() {
  const { stats, loading: statsLoading } = useEstatisticas();
  const { ingredientes, loading: ingredientesLoading } = useIngredientes();
  const { fornecedores, loading: fornecedoresLoading } = useFornecedores();
  const { ordens, loading: ordensLoading } = useOrdensCompra();
  const { movimentacoes, loading: movimentacoesLoading } = useMovimentacaoEstoque();

  if (statsLoading || ingredientesLoading || fornecedoresLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando dados do sistema...</p>
        </div>
      </div>
    );
  }

  const ingredientesEstoqueBaixo = ingredientes.filter(ing => 
    (ing.estoque_atual || 0) <= (ing.estoque_minimo || 0)
  );

  const movimentacoesRecentes = movimentacoes.slice(0, 5);

  return (
    <div className="container max-w-full p-4 lg:p-6 animate-fade-in">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-orange-100 rounded-lg animate-float">
          <ChefHat className="h-8 w-8 text-orange-600" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Prato Cheio - ERP</h1>
          <p className="text-gray-600">Sistema de Gestão de Estoque e Suprimentos</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 animate-slide-up" style={{ '--delay': '100ms' } as React.CSSProperties}>
        <StatsCard 
          title="Total de Ingredientes" 
          value={stats?.totalIngredientes?.toString() || '0'}
          description="itens cadastrados"
          icon={<Package className="h-5 w-5" />}
          className="bg-green-50 border-green-200 hover:bg-green-100 transition-colors duration-300"
        />
        <StatsCard 
          title="Fornecedores Ativos" 
          value={stats?.totalFornecedores?.toString() || '0'}
          description="parceiros cadastrados"
          icon={<Users className="h-5 w-5" />}
          className="bg-blue-50 border-blue-200 hover:bg-blue-100 transition-colors duration-300"
        />
        <StatsCard 
          title="Estoque Baixo" 
          value={stats?.ingredientesEstoqueBaixo?.toString() || '0'}
          trend={stats?.ingredientesEstoqueBaixo > 0 ? -1 : 0}
          trendLabel="itens críticos"
          icon={<AlertTriangle className="h-5 w-5" />}
          className="bg-red-50 border-red-200 hover:bg-red-100 transition-colors duration-300"
        />
        <StatsCard 
          title="Ordens de Compra" 
          value={stats?.totalOrdens?.toString() || '0'}
          description="pedidos registrados"
          icon={<FileText className="h-5 w-5" />}
          className="bg-purple-50 border-purple-200 hover:bg-purple-100 transition-colors duration-300"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              Estoque Baixo
            </CardTitle>
          </CardHeader>
          <CardContent>
            {ingredientesEstoqueBaixo.length === 0 ? (
              <p className="text-center text-gray-500 py-4">
                Todos os ingredientes estão com estoque adequado
              </p>
            ) : (
              <div className="space-y-3">
                {ingredientesEstoqueBaixo.slice(0, 5).map((ingrediente) => (
                  <div key={ingrediente.codingrediente} className="flex justify-between items-center p-2 bg-red-50 rounded-lg border border-red-200">
                    <div>
                      <p className="font-medium text-red-800">{ingrediente.nome}</p>
                      <p className="text-xs text-red-600">
                        Atual: {ingrediente.estoque_atual} {ingrediente.unidade_medida}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-red-600">
                        Mín: {ingrediente.estoque_minimo}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-orange-600" />
              Movimentações Recentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            {movimentacoesRecentes.length === 0 ? (
              <p className="text-center text-gray-500 py-4">
                Nenhuma movimentação recente
              </p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Data</TableHead>
                    <TableHead>Ingrediente</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead className="text-right">Quantidade</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {movimentacoesRecentes.map((mov) => (
                    <TableRow key={mov.codmovimentacao}>
                      <TableCell className="text-sm">
                        {new Date(mov.data_movimentacao).toLocaleDateString('pt-BR')}
                      </TableCell>
                      <TableCell className="font-medium">
                        {mov.ingrediente?.nome || 'N/A'}
                      </TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          mov.tipo_movimentacao === 'entrada' ? 'bg-green-100 text-green-800' :
                          mov.tipo_movimentacao === 'saida' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {mov.tipo_movimentacao || 'N/A'}
                        </span>
                      </TableCell>
                      <TableCell className={`text-right font-medium ${
                        mov.quantidade > 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {mov.quantidade > 0 ? '+' : ''}{mov.quantidade}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-600" />
              Fornecedores
            </CardTitle>
          </CardHeader>
          <CardContent>
            {fornecedores.length === 0 ? (
              <p className="text-center text-gray-500 py-4">
                Nenhum fornecedor cadastrado
              </p>
            ) : (
              <div className="space-y-2">
                {fornecedores.slice(0, 5).map((fornecedor) => (
                  <div key={fornecedor.codfornecedor} className="flex justify-between items-center p-2 bg-blue-50 rounded-lg border border-blue-200">
                    <div>
                      <p className="font-medium text-blue-800">{fornecedor.nome}</p>
                      <p className="text-xs text-blue-600">{fornecedor.contato || 'Sem contato'}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-purple-600" />
              Ordens de Compra
            </CardTitle>
          </CardHeader>
          <CardContent>
            {ordens.length === 0 ? (
              <p className="text-center text-gray-500 py-4">
                Nenhuma ordem de compra registrada
              </p>
            ) : (
              <div className="space-y-2">
                {[...ordens]
                  .sort((a, b) => b.codordem - a.codordem)
                  .slice(0, 5)
                  .map((ordem) => (
                    <div key={ordem.codordem} className="flex justify-between items-center p-2 bg-purple-50 rounded-lg border border-purple-200">
                      <div>
                        <p className="font-medium text-purple-800">
                          Ordem #{ordem.codordem}
                        </p>
                        <p className="text-xs text-purple-600">
                          {ordem.fornecedor?.nome || 'Fornecedor N/A'}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-purple-600">
                          {new Date(ordem.data_ordem).toLocaleDateString('pt-BR')}
                        </p>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          ordem.status === 'pendente' ? 'bg-yellow-100 text-yellow-800' :
                          ordem.status === 'confirmado' ? 'bg-blue-100 text-blue-800' :
                          ordem.status === 'entregue' ? 'bg-green-100 text-green-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {ordem.status || 'N/A'}
                        </span>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

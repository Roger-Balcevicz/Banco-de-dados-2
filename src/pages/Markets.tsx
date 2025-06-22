import React, { useState } from 'react';
import { PageLayout } from '@/components/layout/PageLayout';
import { useFornecedores } from '@/hooks/useSupabaseData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Package, TrendingUp, Award, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CreateOrderFromSupplierDialog } from '@/components/suppliers/CreateOrderFromSupplierDialog';
import { ViewSupplierHistoryDialog } from '@/components/suppliers/ViewSupplierHistoryDialog';
import { EditSupplierDialog } from '@/components/suppliers/EditSupplierDialog';

const Markets = () => {
  const { fornecedores, loading: loadingFornecedores, refetch } = useFornecedores();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFornecedor, setSelectedFornecedor] = useState(null);

  const filteredFornecedores = fornecedores.filter(fornecedor =>
    fornecedor.nome.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loadingFornecedores) {
    return (
      <PageLayout title="Fornecedores">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Carregando fornecedores...</p>
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout title="Fornecedores">
      <div className="space-y-6">
        {/* Estatísticas dos Fornecedores */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Total de Fornecedores */}
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-blue-700 flex items-center gap-2">
                <Users className="h-4 w-4" />
                Total de Fornecedores
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-800">{fornecedores.length}</div>
              <p className="text-xs text-blue-600">cadastrados no sistema</p>
            </CardContent>
          </Card>

          {/* Fornecedores Ativos */}
          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-green-700 flex items-center gap-2">
                <Package className="h-4 w-4" />
                Fornecedores Ativos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-800">{fornecedores.length}</div>
              <p className="text-xs text-green-600">disponíveis</p>
            </CardContent>
          </Card>

          {/* Com Contato */}
          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-orange-700 flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Com Contato
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-800">
                {fornecedores.filter(f => f.contato).length}
              </div>
              <p className="text-xs text-orange-600">fornecedores</p>
            </CardContent>
          </Card>

          {/* Sem Contato */}
          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-purple-700 flex items-center gap-2">
                <Award className="h-4 w-4" />
                Sem Contato
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-800">
                {fornecedores.filter(f => !f.contato).length}
              </div>
              <p className="text-xs text-purple-600">precisam atualizar</p>
            </CardContent>
          </Card>
        </div>

        {/* Campo de Busca */}
        <div className="bg-white p-4 rounded-lg border shadow-sm">
          <Input
            placeholder="Buscar fornecedores por nome..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>

        {/* Lista de Fornecedores */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5 text-orange-600" />
              Lista de Fornecedores
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...filteredFornecedores]
                .sort((a, b) => a.codfornecedor - b.codfornecedor)
                .map((fornecedor) => (
                  <div
                    key={fornecedor.codfornecedor}
                    className="p-4 border rounded-lg hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => setSelectedFornecedor(fornecedor)}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-gray-800">{fornecedor.nome}</h3>
                      <span className="text-xs text-gray-500">#{fornecedor.codfornecedor}</span>
                    </div>

                    {fornecedor.contato && (
                      <p className="text-sm text-gray-600 mb-2">
                        <Phone className="h-3 w-3 inline mr-1" />
                        {fornecedor.contato}
                      </p>
                    )}

                    <div className="flex justify-between items-center">
                      <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                        Ativo
                      </span>
                      <Button size="sm" variant="outline">
                        Ver Detalhes
                      </Button>
                    </div>
                  </div>
                ))}
            </div>

            {filteredFornecedores.length === 0 && (
              <div className="text-center py-8">
                <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Nenhum fornecedor encontrado</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Detalhes do Fornecedor Selecionado */}
        {selectedFornecedor && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Users className="h-5 w-5 text-orange-600" />
                </div>
                Detalhes do Fornecedor
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-xl font-bold text-gray-800">{selectedFornecedor.nome}</h3>
                  <p className="text-gray-600">Código: {selectedFornecedor.codfornecedor}</p>
                </div>
                <div className="text-right">
                  <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                    Ativo
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  {selectedFornecedor.contato ? (
                    <div className="flex items-center gap-2 text-gray-700">
                      <Phone className="h-4 w-4 text-orange-500" />
                      <span>{selectedFornecedor.contato}</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-gray-500">
                      <Phone className="h-4 w-4" />
                      <span>Contato não informado</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-4 border-t">
                <div className="flex gap-3">
                  <CreateOrderFromSupplierDialog
                    fornecedor={selectedFornecedor}
                    onOrderCreated={refetch}
                  />
                  <ViewSupplierHistoryDialog fornecedor={selectedFornecedor} />
                  <EditSupplierDialog
                    fornecedor={selectedFornecedor}
                    onSupplierUpdated={refetch}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </PageLayout>
  );
};

export default Markets;

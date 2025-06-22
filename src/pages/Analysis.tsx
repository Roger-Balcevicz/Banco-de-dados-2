import React, { useState, useMemo } from 'react';
import { PageLayout } from '@/components/layout/PageLayout';
import { useReceitas } from '@/hooks/useSupabaseData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ChefHat, ChevronUp, ChevronDown } from 'lucide-react';
import { ViewRecipeIngredientsDialog } from '@/components/recipes/ViewRecipeIngredientsDialog';
import { EditRecipeDialog } from '@/components/recipes/EditRecipeDialog';

const Analysis = () => {
  const { receitas, loading: loadingReceitas, refetch } = useReceitas();
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [sortField, setSortField] = useState<'codreceita' | 'nome'>('codreceita');

  const toggleSort = (field: 'codreceita' | 'nome') => {
    if (sortField === field) {
      setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const sortedReceitas = useMemo(() => {
    return [...receitas].sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
      } else {
        return aValue < bValue ? 1 : aValue > bValue ? -1 : 0;
      }
    });
  }, [receitas, sortField, sortOrder]);

  const renderSortIcon = (field: 'codreceita' | 'nome') => {
    const isActive = sortField === field;
    const Icon = sortOrder === 'asc' ? ChevronUp : ChevronDown;

    return (
      <span
        className={`inline-flex ml-1 transition-opacity duration-200 ${
          isActive ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
      >
        <Icon className="h-4 w-4" />
      </span>
    );
  };

  if (loadingReceitas) {
    return (
      <PageLayout title="Cardápio">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Carregando receitas...</p>
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout title="Cardápio">
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ChefHat className="h-5 w-5 text-orange-600" />
              Receitas do Cardápio
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead
                    className="cursor-pointer hover:bg-gray-50 select-none"
                    onClick={() => toggleSort('codreceita')}
                  >
                    <div className="flex items-center">
                      Código
                      {renderSortIcon('codreceita')}
                    </div>
                  </TableHead>
                  <TableHead
                    className="cursor-pointer hover:bg-gray-50 select-none"
                    onClick={() => toggleSort('nome')}
                  >
                    <div className="flex items-center">
                      Nome
                      {renderSortIcon('nome')}
                    </div>
                  </TableHead>
                  <TableHead>Descrição</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedReceitas.map((receita) => (
                  <TableRow key={receita.codreceita}>
                    <TableCell className="font-medium">
                      {receita.codreceita}
                    </TableCell>
                    <TableCell className="font-semibold">
                      {receita.nome}
                    </TableCell>
                    <TableCell className="text-gray-600">
                      {receita.descricao || 'Sem descrição'}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <ViewRecipeIngredientsDialog 
                          codreceita={receita.codreceita}
                          nomeReceita={receita.nome}
                        />
                        <EditRecipeDialog 
                          receita={receita}
                          onRecipeUpdated={refetch}
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {receitas.length === 0 && (
              <div className="text-center py-8">
                <ChefHat className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Nenhuma receita cadastrada</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
};

export default Analysis;


import React from 'react';
import { PageLayout } from '@/components/layout/PageLayout';
import { useEstatisticas, useMovimentacaoEstoque, useIngredientes } from '@/hooks/useSupabaseData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { FileText, Package, TrendingUp, AlertTriangle, Activity, DollarSign, Calendar, Truck, Download, FileType, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

const Portfolio = () => {
  const { stats, loading: statsLoading } = useEstatisticas();
  const { movimentacoes, loading: movLoading } = useMovimentacaoEstoque();
  const { ingredientes, loading: ingLoading } = useIngredientes();
  const { toast } = useToast();

  if (statsLoading || movLoading || ingLoading) {
    return (
      <PageLayout title="Relatórios e Análises">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Carregando dados...</p>
          </div>
        </div>
      </PageLayout>
    );
  }

  // Preparar dados para gráficos
  const movimentacoesPorTipo = movimentacoes.reduce((acc, mov) => {
    const tipo = mov.tipo_movimentacao || 'outros';
    acc[tipo] = (acc[tipo] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const dadosGraficoTipo = Object.entries(movimentacoesPorTipo).map(([tipo, quantidade]) => ({
    tipo,
    quantidade
  }));

  // Movimentações por data (últimos 30 dias) com detalhes
  const movimentacoesPorData = movimentacoes
    .slice(0, 30)
    .map(mov => ({
      data: new Date(mov.data_movimentacao).toLocaleDateString('pt-BR'),
      quantidade: Math.abs(mov.quantidade),
      ingrediente: mov.ingrediente?.nome || 'N/A',
      tipo: mov.tipo_movimentacao || 'N/A',
      origem: mov.origem || 'N/A'
    }))
    .slice(0, 15)
    .reverse();

  // Ingredientes por categoria de estoque
  const categoriaEstoque = ingredientes.reduce((acc, ing) => {
    const atual = ing.estoque_atual || 0;
    const minimo = ing.estoque_minimo || 0;
    
    if (atual <= minimo) {
      acc.critico = (acc.critico || 0) + 1;
    } else if (atual <= minimo * 1.5) {
      acc.baixo = (acc.baixo || 0) + 1;
    } else {
      acc.normal = (acc.normal || 0) + 1;
    }
    
    return acc;
  }, {} as Record<string, number>);

  const dadosPieChart = [
    { name: 'Crítico', value: categoriaEstoque.critico || 0, color: '#dc2626' },
    { name: 'Baixo', value: categoriaEstoque.baixo || 0, color: '#ea580c' },
    { name: 'Normal', value: categoriaEstoque.normal || 0, color: '#16a34a' }
  ];

  // Funcionalidades das ações rápidas
  const exportarRelatorio = () => {
    const csvContent = [
      ['Ingrediente', 'Estoque Atual', 'Estoque Mínimo', 'Status'].join(','),
      ...ingredientes.map(ing => {
        const atual = ing.estoque_atual || 0;
        const minimo = ing.estoque_minimo || 0;
        const status = atual <= minimo ? 'Crítico' : atual <= minimo * 1.5 ? 'Baixo' : 'Normal';
        return [ing.nome, atual, minimo, status].join(',');
      })
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `relatorio_estoque_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Sucesso",
      description: "Relatório exportado em CSV!"
    });
  };

  const gerarPDF = () => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Relatório de Estoque</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 20px; }
              table { width: 100%; border-collapse: collapse; margin-top: 20px; }
              th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
              th { background-color: #f2f2f2; }
              .header { text-align: center; margin-bottom: 30px; }
              .stats { display: flex; justify-content: space-around; margin-bottom: 20px; }
              .stat-card { text-align: center; padding: 10px; border: 1px solid #ddd; }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>Relatório de Estoque</h1>
              <p>Gerado em: ${new Date().toLocaleDateString('pt-BR')}</p>
            </div>
            
            <div class="stats">
              <div class="stat-card">
                <h3>${stats?.totalIngredientes || 0}</h3>
                <p>Total Ingredientes</p>
              </div>
              <div class="stat-card">
                <h3>${stats?.ingredientesEstoqueBaixo || 0}</h3>
                <p>Estoque Baixo</p>
              </div>
              <div class="stat-card">
                <h3>${stats?.totalFornecedores || 0}</h3>
                <p>Fornecedores</p>
              </div>
            </div>

            <table>
              <thead>
                <tr>
                  <th>Ingrediente</th>
                  <th>Estoque Atual</th>
                  <th>Estoque Mínimo</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                ${ingredientes.map(ing => {
                  const atual = ing.estoque_atual || 0;
                  const minimo = ing.estoque_minimo || 0;
                  const status = atual <= minimo ? 'Crítico' : atual <= minimo * 1.5 ? 'Baixo' : 'Normal';
                  return `
                    <tr>
                      <td>${ing.nome}</td>
                      <td>${atual.toFixed(1)}</td>
                      <td>${minimo.toFixed(1)}</td>
                      <td>${status}</td>
                    </tr>
                  `;
                }).join('')}
              </tbody>
            </table>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }

    toast({
      title: "Sucesso",
      description: "PDF sendo gerado!"
    });
  };

  const configurarAlertas = () => {
    toast({
      title: "Em desenvolvimento",
      description: "Funcionalidade de configuração de alertas será implementada em breve!",
      variant: "destructive"
    });
  };

  // Tooltip customizado para o gráfico de movimentações
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border rounded shadow-lg">
          <p className="font-medium">{`Data: ${label}`}</p>
          <p className="text-orange-600">{`Quantidade: ${data.quantidade}`}</p>
          <p className="text-gray-600">{`Ingrediente: ${data.ingrediente}`}</p>
          <p className="text-gray-600">{`Tipo: ${data.tipo}`}</p>
          <p className="text-gray-600">{`Origem: ${data.origem}`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <PageLayout title="Relatórios e Análises">
      <div className="space-y-6">
        {/* KPIs Principais */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-blue-700 flex items-center gap-2">
                <Package className="h-4 w-4" />
                Total Ingredientes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-800">{stats?.totalIngredientes || 0}</div>
              <p className="text-xs text-blue-600">itens cadastrados</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-green-700 flex items-center gap-2">
                <Truck className="h-4 w-4" />
                Fornecedores
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-800">{stats?.totalFornecedores || 0}</div>
              <p className="text-xs text-green-600">parceiros ativos</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-yellow-700 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" />
                Estoque Baixo
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-800">{stats?.ingredientesEstoqueBaixo || 0}</div>
              <p className="text-xs text-yellow-600">itens críticos</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-purple-700 flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Ordens de Compra
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-800">{stats?.totalOrdens || 0}</div>
              <p className="text-xs text-purple-600">pedidos registrados</p>
            </CardContent>
          </Card>
        </div>

        {/* Gráficos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Movimentações por Tipo */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-orange-600" />
                Movimentações por Tipo
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={dadosGraficoTipo}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="tipo" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="quantidade" fill="#fb923c" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Status do Estoque */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5 text-orange-600" />
                Status do Estoque
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={dadosPieChart}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={120}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {dadosPieChart.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex justify-center gap-4 mt-4">
                {dadosPieChart.map((entry, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: entry.color }}
                    />
                    <span className="text-sm">{entry.name}: {entry.value}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Movimentações ao Longo do Tempo */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-orange-600" />
              Movimentações dos Últimos Dias
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={movimentacoesPorData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="data" />
                  <YAxis />
                  <Tooltip content={<CustomTooltip />} />
                  <Line 
                    type="monotone" 
                    dataKey="quantidade" 
                    stroke="#fb923c" 
                    strokeWidth={2}
                    dot={{ fill: '#fb923c' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Tabela de Movimentações Recentes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-orange-600" />
              Movimentações Recentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data</TableHead>
                  <TableHead>Ingrediente</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Quantidade</TableHead>
                  <TableHead>Origem</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {movimentacoes.slice(0, 10).map((mov) => (
                  <TableRow key={mov.codmovimentacao}>
                    <TableCell>
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
                    <TableCell className={mov.quantidade > 0 ? 'text-green-600' : 'text-red-600'}>
                      {mov.quantidade > 0 ? '+' : ''}{mov.quantidade}
                    </TableCell>
                    <TableCell className="text-gray-600">
                      {mov.origem || 'N/A'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Ações Rápidas */}
        <Card>
          <CardHeader>
            <CardTitle>Ações Rápidas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              <Button 
                className="bg-orange-600 hover:bg-orange-700"
                onClick={exportarRelatorio}
              >
                <Download className="h-4 w-4 mr-2" />
                Exportar Relatório
              </Button>
              <Button 
                variant="outline"
                onClick={gerarPDF}
              >
                <FileType className="h-4 w-4 mr-2" />
                Gerar PDF
              </Button>
              <Button 
                variant="outline"
                onClick={configurarAlertas}
              >
                <Settings className="h-4 w-4 mr-2" />
                Configurar Alertas
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
};

export default Portfolio;

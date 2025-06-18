
import React, { useState } from 'react';
import { PageLayout } from '@/components/layout/PageLayout';
import { mockIngredients, mockSuppliers, mockOrders, generateStockHistory } from '@/utils/restaurantApi';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, AreaChart, Area } from 'recharts';
import { TrendingUp, TrendingDown, Target, Zap, Clock, Activity, BarChart3, Calculator } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Performance = () => {
  const [timeRange, setTimeRange] = useState('30d');
  
  // Dados de performance do estoque
  const stockPerformance = mockIngredients.map(ingredient => {
    const turnoverRate = (ingredient.currentStock / ingredient.maxStock) * 100;
    const efficiency = Math.min(100, turnoverRate + Math.random() * 20);
    
    return {
      name: ingredient.name,
      turnover: turnoverRate,
      efficiency: efficiency,
      waste: Math.random() * 10,
      cost: ingredient.currentStock * ingredient.unitPrice,
      category: ingredient.category
    };
  });
  
  // Dados de eficiência semanal
  const weeklyEfficiency = Array.from({ length: 12 }, (_, i) => ({
    week: `Sem ${i + 1}`,
    efficiency: 75 + Math.random() * 20,
    waste: 5 + Math.random() * 10,
    turnover: 60 + Math.random() * 30,
    cost: 15000 + Math.random() * 5000
  }));
  
  // Dados de produtividade da cozinha
  const kitchenProductivity = [
    { hour: '6h', orders: 5, efficiency: 85 },
    { hour: '7h', orders: 12, efficiency: 90 },
    { hour: '8h', orders: 25, efficiency: 95 },
    { hour: '9h', orders: 20, efficiency: 88 },
    { hour: '10h', orders: 15, efficiency: 82 },
    { hour: '11h', orders: 30, efficiency: 92 },
    { hour: '12h', orders: 45, efficiency: 98 },
    { hour: '13h', orders: 50, efficiency: 95 },
    { hour: '14h', orders: 35, efficiency: 90 },
    { hour: '15h', orders: 25, efficiency: 85 },
    { hour: '16h', orders: 20, efficiency: 80 },
    { hour: '17h', orders: 15, efficiency: 78 },
    { hour: '18h', orders: 40, efficiency: 94 },
    { hour: '19h', orders: 55, efficiency: 97 },
    { hour: '20h', orders: 48, efficiency: 96 },
    { hour: '21h', orders: 30, efficiency: 88 },
    { hour: '22h', orders: 18, efficiency: 82 },
  ];
  
  // KPIs calculados
  const avgTurnover = stockPerformance.reduce((sum, item) => sum + item.turnover, 0) / stockPerformance.length;
  const avgEfficiency = stockPerformance.reduce((sum, item) => sum + item.efficiency, 0) / stockPerformance.length;
  const totalWaste = stockPerformance.reduce((sum, item) => sum + item.waste * item.cost, 0);
  const avgDeliveryTime = mockSuppliers.reduce((sum, supplier) => {
    const hours = parseInt(supplier.deliveryTime);
    return sum + (isNaN(hours) ? 24 : hours);
  }, 0) / mockSuppliers.length;
  
  const timeRanges = [
    { label: '7 dias', value: '7d' },
    { label: '30 dias', value: '30d' },
    { label: '90 dias', value: '90d' }
  ];

  return (
    <PageLayout title="Performance e Métricas">
      <div className="space-y-6">
        {/* KPIs Principais */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-green-700 flex items-center gap-2">
                <Target className="h-4 w-4" />
                Eficiência Média
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-800">{avgEfficiency.toFixed(1)}%</div>
              <p className="text-xs text-green-600 flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                +3.2% vs período anterior
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-blue-700 flex items-center gap-2">
                <Activity className="h-4 w-4" />
                Giro do Estoque
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-800">{avgTurnover.toFixed(1)}%</div>
              <p className="text-xs text-blue-600">ocupação média</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-red-700 flex items-center gap-2">
                <TrendingDown className="h-4 w-4" />
                Desperdício
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-800">
                R$ {totalWaste.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}
              </div>
              <p className="text-xs text-red-600">valor desperdiçado</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-purple-700 flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Tempo de Entrega
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-800">{avgDeliveryTime.toFixed(0)}h</div>
              <p className="text-xs text-purple-600">média dos fornecedores</p>
            </CardContent>
          </Card>
        </div>
        
        {/* Controle de Período */}
        <div className="flex justify-between items-center bg-white p-4 rounded-lg border shadow-sm">
          <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-orange-600" />
            Análise de Performance
          </h2>
          <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
            {timeRanges.map((range) => (
              <Button
                key={range.value}
                onClick={() => setTimeRange(range.value)}
                variant={timeRange === range.value ? "default" : "ghost"}
                size="sm"
              >
                {range.label}
              </Button>
            ))}
          </div>
        </div>
        
        {/* Gráficos de Performance */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Eficiência Semanal */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-orange-600" />
                Eficiência Operacional
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={weeklyEfficiency}>
                    <defs>
                      <linearGradient id="efficiencyGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#16a34a" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#16a34a" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="wasteGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#dc2626" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#dc2626" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="week" />
                    <YAxis />
                    <Tooltip formatter={(value, name) => [
                      `${Number(value).toFixed(1)}${String(name).includes('cost') ? '' : '%'}`,
                      name === 'efficiency' ? 'Eficiência' : 
                      name === 'waste' ? 'Desperdício' :
                      name === 'turnover' ? 'Giro' : 'Custo'
                    ]} />
                    <Area
                      type="monotone"
                      dataKey="efficiency"
                      stroke="#16a34a"
                      fill="url(#efficiencyGradient)"
                      strokeWidth={2}
                    />
                    <Area
                      type="monotone"
                      dataKey="waste"
                      stroke="#dc2626"
                      fill="url(#wasteGradient)"
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          {/* Performance por Ingrediente */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-orange-600" />
                Performance por Ingrediente
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={stockPerformance.slice(0, 8)} layout="horizontal">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" domain={[0, 100]} />
                    <YAxis dataKey="name" type="category" width={80} />
                    <Tooltip formatter={(value) => [`${Number(value).toFixed(1)}%`, '']} />
                    <Bar dataKey="efficiency" fill="#16a34a" name="Eficiência" />
                    <Bar dataKey="turnover" fill="#2563eb" name="Giro" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Produtividade da Cozinha */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-orange-600" />
              Produtividade da Cozinha por Horário
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={kitchenProductivity}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="hour" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Bar yAxisId="left" dataKey="orders" fill="#fb923c" name="Pedidos" />
                  <Line 
                    yAxisId="right" 
                    type="monotone" 
                    dataKey="efficiency" 
                    stroke="#16a34a" 
                    strokeWidth={3}
                    name="Eficiência %"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        {/* Análise Detalhada por Categoria */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="h-5 w-5 text-orange-600" />
              Análise Detalhada por Categoria
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4">Categoria</th>
                    <th className="text-right py-3 px-4">Itens</th>
                    <th className="text-right py-3 px-4">Eficiência Média</th>
                    <th className="text-right py-3 px-4">Giro (%)</th>
                    <th className="text-right py-3 px-4">Desperdício</th>
                    <th className="text-right py-3 px-4">Valor Total</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(
                    stockPerformance.reduce((acc, item) => {
                      if (!acc[item.category]) {
                        acc[item.category] = {
                          count: 0,
                          efficiency: 0,
                          turnover: 0,
                          waste: 0,
                          cost: 0
                        };
                      }
                      acc[item.category].count++;
                      acc[item.category].efficiency += item.efficiency;
                      acc[item.category].turnover += item.turnover;
                      acc[item.category].waste += item.waste;
                      acc[item.category].cost += item.cost;
                      return acc;
                    }, {} as any)
                  ).map(([category, data]: [string, any]) => (
                    <tr key={category} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4 font-medium">{category}</td>
                      <td className="text-right py-3 px-4">{data.count}</td>
                      <td className="text-right py-3 px-4">
                        <span className={`font-semibold ${
                          (data.efficiency / data.count) >= 85 ? 'text-green-600' : 
                          (data.efficiency / data.count) >= 70 ? 'text-yellow-600' : 'text-red-600'
                        }`}>
                          {(data.efficiency / data.count).toFixed(1)}%
                        </span>
                      </td>
                      <td className="text-right py-3 px-4">{(data.turnover / data.count).toFixed(1)}%</td>
                      <td className="text-right py-3 px-4">
                        <span className="text-red-600">
                          {(data.waste / data.count).toFixed(1)}%
                        </span>
                      </td>
                      <td className="text-right py-3 px-4 font-semibold">
                        R$ {data.cost.toLocaleString('pt-BR')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
};

export default Performance;

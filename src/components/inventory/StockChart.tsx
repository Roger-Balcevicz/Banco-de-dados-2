
import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { Calendar, TrendingUp, Package, BarChart3 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { generateStockHistory } from '@/utils/restaurantApi';

interface StockChartProps {
  ingredient: string;
  unit: string;
  currentStock: number;
  volatility?: number;
  className?: string;
}

export function StockChart({ ingredient, unit, currentStock, volatility = 2, className }: StockChartProps) {
  const [timeRange, setTimeRange] = useState('30d');
  
  // Gerar dados com base no período selecionado
  const getDaysFromRange = (range: string) => {
    switch (range) {
      case '7d': return 7;
      case '30d': return 30;
      case '90d': return 90;
      default: return 30;
    }
  };
  
  const data = generateStockHistory(getDaysFromRange(timeRange), currentStock, volatility);
  
  const timeRanges = [
    { label: '7 dias', value: '7d' },
    { label: '30 dias', value: '30d' },
    { label: '90 dias', value: '90d' }
  ];
  
  const formatTooltip = (value: any, name: string) => {
    if (name === 'value') return [`${value} ${unit}`, 'Estoque'];
    if (name === 'consumption') return [`${value.toFixed(1)} ${unit}`, 'Consumo'];
    if (name === 'received') return [`${value.toFixed(1)} ${unit}`, 'Recebido'];
    return [value, name];
  };

  return (
    <div className={cn("p-6 rounded-lg border bg-white/90 backdrop-blur-sm shadow-lg hover:shadow-xl transition-shadow duration-300", className)}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-orange-100 rounded-lg">
            <BarChart3 className="h-5 w-5 text-orange-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800">Histórico de Estoque</h3>
            <p className="text-sm text-gray-600">{ingredient}</p>
          </div>
        </div>
        
        <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
          {timeRanges.map((range) => (
            <button
              key={range.value}
              onClick={() => setTimeRange(range.value)}
              className={cn(
                "px-3 py-1 rounded-md text-sm font-medium transition-all duration-200",
                timeRange === range.value 
                  ? "bg-orange-500 text-white shadow-sm scale-105" 
                  : "text-gray-600 hover:text-gray-800 hover:bg-gray-200"
              )}
            >
              {range.label}
            </button>
          ))}
        </div>
      </div>
      
      <div className="h-80 mb-4">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <defs>
              <linearGradient id="stockGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#fb923c" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#fb923c" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="consumptionGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.2}/>
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="receivedGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#22c55e" stopOpacity={0.2}/>
                <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis 
              dataKey="date" 
              stroke="#6b7280"
              fontSize={12}
              tickFormatter={(value) => new Date(value).toLocaleDateString('pt-BR', { month: 'short', day: 'numeric' })}
            />
            <YAxis 
              stroke="#6b7280"
              fontSize={12}
              tickFormatter={(value) => `${value}${unit}`}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                backdropFilter: 'blur(10px)'
              }}
              formatter={formatTooltip}
              labelFormatter={(label) => new Date(label).toLocaleDateString('pt-BR')}
            />
            
            <Area
              type="monotone"
              dataKey="received"
              stackId="1"
              stroke="#22c55e"
              fill="url(#receivedGradient)"
              strokeWidth={2}
            />
            <Area
              type="monotone"
              dataKey="consumption"
              stackId="2"
              stroke="#ef4444"
              fill="url(#consumptionGradient)"
              strokeWidth={2}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#fb923c"
              strokeWidth={3}
              dot={{ fill: '#fb923c', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, fill: '#ea580c' }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      
      <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-100">
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-1">
            <div className="w-3 h-3 rounded-full bg-orange-500"></div>
            <span className="text-sm font-medium text-gray-600">Estoque Atual</span>
          </div>
          <p className="text-lg font-semibold text-gray-800">{currentStock} {unit}</p>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-1">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <span className="text-sm font-medium text-gray-600">Consumo Médio</span>
          </div>
          <p className="text-lg font-semibold text-gray-800">
            {(data.reduce((sum, d) => sum + d.consumption, 0) / data.length).toFixed(1)} {unit}/dia
          </p>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-1">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span className="text-sm font-medium text-gray-600">Recebimento</span>
          </div>
          <p className="text-lg font-semibold text-gray-800">
            {(data.reduce((sum, d) => sum + d.received, 0) / data.length).toFixed(1)} {unit}/dia
          </p>
        </div>
      </div>
    </div>
  );
}


import { useState, useEffect } from 'react';

// Tipos para o sistema do restaurante
export interface Ingredient {
  id: string;
  name: string;
  category: string;
  currentStock: number;
  minStock: number;
  maxStock: number;
  unit: string;
  unitPrice: number;
  expiryDate: string;
  supplier: string;
  location: string;
  lastUpdated: string;
  image?: string;
}

export interface Supplier {
  id: string;
  name: string;
  contact: string;
  email: string;
  phone: string;
  rating: number;
  reliability: number;
  deliveryTime: string;
  specialties: string[];
  status: 'active' | 'inactive';
}

export interface Order {
  id: string;
  supplier: string;
  items: { ingredient: string; quantity: number; unit: string }[];
  orderDate: string;
  expectedDelivery: string;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  totalValue: number;
  priority: 'low' | 'medium' | 'high' | 'urgent';
}

export interface Alert {
  id: string;
  type: 'low_stock' | 'expiring' | 'delivery_delay' | 'quality_issue';
  title: string;
  message: string;
  severity: 'info' | 'warning' | 'error';
  timestamp: string;
  ingredient?: string;
  actionRequired: boolean;
}

// Dados mock para ingredientes
export const mockIngredients: Ingredient[] = [
  {
    id: '1',
    name: 'Tomate',
    category: 'Vegetais',
    currentStock: 25,
    minStock: 15,
    maxStock: 50,
    unit: 'kg',
    unitPrice: 4.50,
    expiryDate: '2024-06-20',
    supplier: 'Hortifruti São João',
    location: 'Geladeira A1',
    lastUpdated: '2024-06-16T10:30:00Z',
    image: 'https://images.unsplash.com/photo-1546470427-e25b1ce02421?w=400'
  },
  {
    id: '2',
    name: 'Peito de Frango',
    category: 'Carnes',
    currentStock: 12,
    minStock: 10,
    maxStock: 30,
    unit: 'kg',
    unitPrice: 18.90,
    expiryDate: '2024-06-18',
    supplier: 'Açougue Central',
    location: 'Freezer B2',
    lastUpdated: '2024-06-16T09:15:00Z',
    image: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=400'
  },
  {
    id: '3',
    name: 'Arroz Branco',
    category: 'Grãos',
    currentStock: 100,
    minStock: 20,
    maxStock: 150,
    unit: 'kg',
    unitPrice: 3.20,
    expiryDate: '2024-12-31',
    supplier: 'Distribuidora Grãos & Cia',
    location: 'Estoque Seco C1',
    lastUpdated: '2024-06-16T08:45:00Z',
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400'
  },
  {
    id: '4',
    name: 'Cebola',
    category: 'Vegetais',
    currentStock: 8,
    minStock: 12,
    maxStock: 40,
    unit: 'kg',
    unitPrice: 2.80,
    expiryDate: '2024-06-25',
    supplier: 'Hortifruti São João',
    location: 'Estoque Seco A2',
    lastUpdated: '2024-06-16T11:20:00Z',
    image: 'https://images.unsplash.com/photo-1580201092675-a0a6a6cafbb3?w=400'
  },
  {
    id: '5',
    name: 'Óleo de Soja',
    category: 'Óleos',
    currentStock: 15,
    minStock: 8,
    maxStock: 25,
    unit: 'L',
    unitPrice: 6.50,
    expiryDate: '2024-10-15',
    supplier: 'Distribuidora Alimentícia',
    location: 'Estoque Seco D1',
    lastUpdated: '2024-06-16T07:30:00Z',
    image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400'
  }
];

// Dados mock para fornecedores
export const mockSuppliers: Supplier[] = [
  {
    id: '1',
    name: 'Hortifruti São João',
    contact: 'João Silva',
    email: 'joao@hortifrutisaojoao.com',
    phone: '(11) 99999-1234',
    rating: 4.8,
    reliability: 95,
    deliveryTime: '24h',
    specialties: ['Vegetais', 'Frutas', 'Orgânicos'],
    status: 'active'
  },
  {
    id: '2',
    name: 'Açougue Central',
    contact: 'Maria Santos',
    email: 'maria@acouguecentral.com',
    phone: '(11) 99999-5678',
    rating: 4.6,
    reliability: 88,
    deliveryTime: '48h',
    specialties: ['Carnes Bovinas', 'Suínos', 'Aves'],
    status: 'active'
  },
  {
    id: '3',
    name: 'Distribuidora Grãos & Cia',
    contact: 'Pedro Costa',
    email: 'pedro@graosecia.com',
    phone: '(11) 99999-9012',
    rating: 4.9,
    reliability: 98,
    deliveryTime: '72h',
    specialties: ['Grãos', 'Cereais', 'Leguminosas'],
    status: 'active'
  }
];

// Dados mock para pedidos
export const mockOrders: Order[] = [
  {
    id: 'ORD-001',
    supplier: 'Hortifruti São João',
    items: [
      { ingredient: 'Tomate', quantity: 30, unit: 'kg' },
      { ingredient: 'Cebola', quantity: 20, unit: 'kg' }
    ],
    orderDate: '2024-06-16',
    expectedDelivery: '2024-06-17',
    status: 'confirmed',
    totalValue: 191,
    priority: 'high'
  },
  {
    id: 'ORD-002',
    supplier: 'Açougue Central',
    items: [
      { ingredient: 'Peito de Frango', quantity: 25, unit: 'kg' }
    ],
    orderDate: '2024-06-15',
    expectedDelivery: '2024-06-17',
    status: 'shipped',
    totalValue: 472.50,
    priority: 'urgent'
  }
];

// Dados mock para alertas
export const mockAlerts: Alert[] = [
  {
    id: '1',
    type: 'low_stock',
    title: 'Estoque Baixo: Cebola',
    message: 'Cebola está abaixo do estoque mínimo (8kg de 12kg)',
    severity: 'warning',
    timestamp: '2024-06-16T11:20:00Z',
    ingredient: 'Cebola',
    actionRequired: true
  },
  {
    id: '2',
    type: 'expiring',
    title: 'Vencimento Próximo: Peito de Frango',
    message: 'Peito de Frango vence em 2 dias (18/06/2024)',
    severity: 'error',
    timestamp: '2024-06-16T09:15:00Z',
    ingredient: 'Peito de Frango',
    actionRequired: true
  },
  {
    id: '3',
    type: 'delivery_delay',
    title: 'Atraso na Entrega',
    message: 'Pedido ORD-001 pode ter atraso de 1 dia',
    severity: 'info',
    timestamp: '2024-06-16T08:30:00Z',
    actionRequired: false
  }
];

// Função para gerar histórico de estoque
export function generateStockHistory(days: number, currentValue: number, volatility: number = 2) {
  const history = [];
  let value = currentValue;
  
  for (let i = days; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    
    // Simular flutuações de estoque
    const change = (Math.random() - 0.5) * volatility;
    value = Math.max(0, value + change);
    
    history.push({
      date: date.toISOString().split('T')[0],
      value: Math.round(value * 10) / 10,
      consumption: Math.random() * 5,
      received: Math.random() * 8
    });
  }
  
  return history;
}

// Hook para dados de estoque em tempo real
export function useStockData(initialData: Ingredient[]) {
  const [data, setData] = useState(initialData);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setData(prevData => 
        prevData.map(ingredient => ({
          ...ingredient,
          currentStock: Math.max(0, ingredient.currentStock + (Math.random() - 0.7) * 2),
          lastUpdated: new Date().toISOString()
        }))
      );
    }, 5000); // Atualiza a cada 5 segundos
    
    return () => clearInterval(interval);
  }, []);
  
  return data;
}

// Hook para dados de fornecedores
export function useSupplierData(initialData: Supplier[]) {
  const [data, setData] = useState(initialData);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setData(prevData => 
        prevData.map(supplier => ({
          ...supplier,
          reliability: Math.min(100, Math.max(80, supplier.reliability + (Math.random() - 0.5) * 2))
        }))
      );
    }, 10000); // Atualiza a cada 10 segundos
    
    return () => clearInterval(interval);
  }, []);
  
  return data;
}

// Hook para dados de pedidos/inventário
export function useInventoryData(initialData: Order[]) {
  const [data, setData] = useState(initialData);
  
  useEffect(() => {
    // Simular atualizações de status dos pedidos
    const interval = setInterval(() => {
      setData(prevData => 
        prevData.map(order => {
          if (order.status === 'pending' && Math.random() > 0.7) {
            return { ...order, status: 'confirmed' as const };
          }
          if (order.status === 'confirmed' && Math.random() > 0.8) {
            return { ...order, status: 'shipped' as const };
          }
          if (order.status === 'shipped' && Math.random() > 0.9) {
            return { ...order, status: 'delivered' as const };
          }
          return order;
        })
      );
    }, 15000); // Atualiza a cada 15 segundos
    
    return () => clearInterval(interval);
  }, []);
  
  return data;
}

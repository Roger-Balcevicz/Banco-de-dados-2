
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
  id_status: number;
  totalValue: number;
  priority: 'low' | 'medium' | 'high' | 'urgent';
}

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
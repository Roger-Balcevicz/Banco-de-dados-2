
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent } from '@/components/ui/card';
import { Eye } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface OrderItem {
  coditem: number;
  codingrediente: number;
  quantidade: number;
  preco_unitario: number;
  ingrediente: {
    nome: string;
    unidade_medida: string;
  };
}

interface ViewOrderItemsDialogProps {
  codordem: number;
}

export function ViewOrderItemsDialog({ codordem }: ViewOrderItemsDialogProps) {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('item_ordem_compra')
        .select(`
          *,
          ingrediente (
            nome,
            unidade_medida
          )
        `)
        .eq('codordem', codordem);

      if (error) throw error;
      setItems(data || []);
    } catch (error) {
      console.error('Erro ao buscar itens:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      fetchItems();
    }
  }, [open, codordem]);

  const total = items.reduce((sum, item) => sum + (item.quantidade * item.preco_unitario), 0);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline">
          <Eye className="h-4 w-4 mr-1" />
          Ver Itens
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Itens da Ordem #{codordem}</DialogTitle>
        </DialogHeader>
        
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
          </div>
        ) : (
          <div className="space-y-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ingrediente</TableHead>
                  <TableHead>Quantidade</TableHead>
                  <TableHead>Unidade</TableHead>
                  <TableHead>Preço Unit.</TableHead>
                  <TableHead>Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item) => (
                  <TableRow key={item.coditem}>
                    <TableCell className="font-medium">
                      {item.ingrediente?.nome || 'N/A'}
                    </TableCell>
                    <TableCell>{item.quantidade}</TableCell>
                    <TableCell>{item.ingrediente?.unidade_medida || 'UN'}</TableCell>
                    <TableCell>R$ {item.preco_unitario.toFixed(2)}</TableCell>
                    <TableCell>R$ {(item.quantidade * item.preco_unitario).toFixed(2)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            
            {items.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                Nenhum item encontrado para esta ordem
              </div>
            )}

            {items.length > 0 && (
              <Card>
                <CardContent className="pt-6">
                  <div className="flex justify-between items-center text-lg font-semibold">
                    <span>Total da Ordem:</span>
                    <span>R$ {total.toFixed(2)}</span>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

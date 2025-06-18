
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { History } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface ViewSupplierHistoryDialogProps {
  fornecedor: any;
}

export function ViewSupplierHistoryDialog({ fornecedor }: ViewSupplierHistoryDialogProps) {
  const [open, setOpen] = useState(false);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const loadHistory = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('ordem_compra')
        .select(`
          *,
          item_ordem_compra (
            quantidade,
            preco_unitario,
            ingrediente (nome)
          )
        `)
        .eq('codfornecedor', fornecedor.codfornecedor)
        .order('data_ordem', { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (error) {
      console.error('Erro ao carregar histórico:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      loadHistory();
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <History className="h-4 w-4 mr-1" />
          Ver Histórico
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Histórico de Compras - {fornecedor.nome}</DialogTitle>
        </DialogHeader>
        
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.length === 0 ? (
              <p className="text-center text-gray-500 py-8">Nenhuma ordem encontrada</p>
            ) : (
              orders.map((order) => (
                <div key={order.codordem} className="border rounded-lg p-4">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="font-semibold">Ordem #{order.codordem}</h3>
                    <div className="flex gap-4 text-sm text-gray-600">
                      <span>Data: {new Date(order.data_ordem).toLocaleDateString('pt-BR')}</span>
                      <span className={`px-2 py-1 rounded text-xs ${
                        order.status === 'recebido' ? 'bg-green-100 text-green-800' :
                        order.status === 'pendente' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                  
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Ingrediente</TableHead>
                        <TableHead className="text-right">Quantidade</TableHead>
                        <TableHead className="text-right">Preço Unit.</TableHead>
                        <TableHead className="text-right">Total</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {order.item_ordem_compra.map((item: any, index: number) => (
                        <TableRow key={index}>
                          <TableCell>{item.ingrediente?.nome || 'N/A'}</TableCell>
                          <TableCell className="text-right">{item.quantidade}</TableCell>
                          <TableCell className="text-right">R$ {(item.preco_unitario || 0).toFixed(2)}</TableCell>
                          <TableCell className="text-right">
                            R$ {(item.quantidade * (item.preco_unitario || 0)).toFixed(2)}
                          </TableCell>
                        </TableRow>
                      ))}
                      <TableRow className="font-semibold">
                        <TableCell colSpan={3}>Total da Ordem</TableCell>
                        <TableCell className="text-right">
                          R$ {order.item_ordem_compra.reduce((total: number, item: any) => 
                            total + (item.quantidade * (item.preco_unitario || 0)), 0
                          ).toFixed(2)}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              ))
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

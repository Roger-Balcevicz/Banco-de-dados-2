
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ShoppingCart, Plus, Minus } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useToast } from '@/hooks/use-toast';
import { useIngredientes, useSetores } from '@/hooks/useSupabaseData';
import { supabase } from '@/integrations/supabase/client';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface CreateOrderFromSupplierDialogProps {
  fornecedor: any;
  onOrderCreated: () => void;
}

export function CreateOrderFromSupplierDialog({ fornecedor, onOrderCreated }: CreateOrderFromSupplierDialogProps) {
  const [open, setOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [items, setItems] = useState([{ codingrediente: '', quantidade: 1, preco_unitario: 0 }]);
  const { ingredientes } = useIngredientes();
  const { setores } = useSetores();
  const { toast } = useToast();
  
  const { register, handleSubmit, setValue, watch } = useForm({
    defaultValues: {
      codsetor: '',
      data_ordem: new Date().toISOString().split('T')[0]
    }
  });

  const addItem = () => {
    setItems([...items, { codingrediente: '', quantidade: 1, preco_unitario: 0 }]);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const updateItem = (index: number, field: string, value: any) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setItems(newItems);
  };

  const onSubmit = async (data: any) => {
    if (items.some(item => !item.codingrediente || item.quantidade <= 0)) {
      toast({
        title: "Erro",
        description: "Todos os itens devem ter ingrediente e quantidade válidos",
        variant: "destructive"
      });
      return;
    }

    setIsCreating(true);
    try {
      const { data: ordemData, error: ordemError } = await supabase
        .from('ordem_compra')
        .insert({
          data_ordem: data.data_ordem,
          codfornecedor: fornecedor.codfornecedor,
          codsetor: data.codsetor ? parseInt(data.codsetor) : null,
          status: 'pendente'
        })
        .select()
        .single();

      if (ordemError) throw ordemError;

      for (const item of items) {
        const { error: itemError } = await supabase
          .from('item_ordem_compra')
          .insert({
            codordem: ordemData.codordem,
            codingrediente: parseInt(item.codingrediente),
            quantidade: item.quantidade,
            preco_unitario: item.preco_unitario
          });

        if (itemError) throw itemError;
      }

      toast({
        title: "Sucesso",
        description: "Ordem de compra criada com sucesso!"
      });

      setOpen(false);
      setItems([{ codingrediente: '', quantidade: 1, preco_unitario: 0 }]);
      onOrderCreated();
    } catch (error) {
      console.error('Erro ao criar ordem:', error);
      toast({
        title: "Erro",
        description: "Erro ao criar ordem de compra",
        variant: "destructive"
      });
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-orange-600 hover:bg-orange-700">
          <ShoppingCart className="h-4 w-4 mr-1" />
          Fazer Pedido
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Nova Ordem de Compra - {fornecedor.nome}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Data da Ordem</label>
              <Input 
                type="date"
                {...register('data_ordem', { required: true })}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Setor</label>
              <Select onValueChange={(value) => setValue('codsetor', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o setor..." />
                </SelectTrigger>
                <SelectContent>
                  {setores.map((setor) => (
                    <SelectItem key={setor.codsetor} value={setor.codsetor.toString()}>
                      {setor.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Itens da Ordem</h3>
              <Button type="button" onClick={addItem} size="sm" variant="outline">
                <Plus className="h-4 w-4 mr-1" />
                Adicionar Item
              </Button>
            </div>
            
            <div className="space-y-3 max-h-60 overflow-y-auto">
              {items.map((item, index) => (
                <div key={index} className="grid grid-cols-5 gap-2 p-3 border rounded">
                  <div>
                    <label className="block text-xs font-medium mb-1">Ingrediente</label>
                    <Select 
                      value={item.codingrediente} 
                      onValueChange={(value) => updateItem(index, 'codingrediente', value)}
                    >
                      <SelectTrigger className="h-8">
                        <SelectValue placeholder="Selecione..." />
                      </SelectTrigger>
                      <SelectContent>
                        {ingredientes.map((ing) => (
                          <SelectItem key={ing.codingrediente} value={ing.codingrediente.toString()}>
                            {ing.nome}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="block text-xs font-medium mb-1">Quantidade</label>
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      value={item.quantidade}
                      onChange={(e) => updateItem(index, 'quantidade', parseFloat(e.target.value) || 0)}
                      className="h-8"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-xs font-medium mb-1">Preço Unit.</label>
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      value={item.preco_unitario}
                      onChange={(e) => updateItem(index, 'preco_unitario', parseFloat(e.target.value) || 0)}
                      className="h-8"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-xs font-medium mb-1">Total</label>
                    <div className="h-8 flex items-center text-sm font-medium">
                      R$ {(item.quantidade * item.preco_unitario).toFixed(2)}
                    </div>
                  </div>
                  
                  <div className="flex items-end">
                    <Button
                      type="button"
                      onClick={() => removeItem(index)}
                      size="sm"
                      variant="outline"
                      disabled={items.length === 1}
                      className="h-8"
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-between items-center pt-4 border-t">
            <div className="text-lg font-semibold">
              Total: R$ {items.reduce((total, item) => total + (item.quantidade * item.preco_unitario), 0).toFixed(2)}
            </div>
            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isCreating}>
                {isCreating ? 'Criando...' : 'Criar Ordem'}
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

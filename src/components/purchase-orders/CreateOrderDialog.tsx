
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Trash2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useFornecedores, useIngredientes, useSetores } from '@/hooks/useSupabaseData';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface OrderItem {
  codingrediente: number;
  quantidade: number;
  preco_unitario: number;
}

interface CreateOrderDialogProps {
  onOrderCreated: () => void;
}

export function CreateOrderDialog({ onOrderCreated }: CreateOrderDialogProps) {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<OrderItem[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  
  const { fornecedores } = useFornecedores();
  const { ingredientes } = useIngredientes();
  const { setores } = useSetores();
  const { toast } = useToast();
  
  const { register, handleSubmit, watch, setValue, reset } = useForm({
    defaultValues: {
      codfornecedor: '',
      codsetor: '',
      data_ordem: new Date().toISOString().split('T')[0]
    }
  });

  const addItem = () => {
    setItems(prev => [...prev, { codingrediente: 0, quantidade: 1, preco_unitario: 0 }]);
  };

  const removeItem = (index: number) => {
    setItems(prev => prev.filter((_, i) => i !== index));
  };

  const updateItem = (index: number, field: keyof OrderItem, value: number) => {
    setItems(prev => prev.map((item, i) => 
      i === index ? { ...item, [field]: value } : item
    ));
  };

  const onSubmit = async (data: any) => {
    if (!data.codfornecedor) {
      toast({
        title: "Erro",
        description: "Selecione um fornecedor",
        variant: "destructive"
      });
      return;
    }

    if (items.length === 0) {
      toast({
        title: "Erro", 
        description: "Adicione pelo menos um item à ordem",
        variant: "destructive"
      });
      return;
    }

    setIsCreating(true);
    try {
      // Criar ordem de compra
      const { data: ordem, error: ordemError } = await supabase
        .from('ordem_compra')
        .insert({
          data_ordem: data.data_ordem,
          codfornecedor: parseInt(data.codfornecedor),
          codsetor: data.codsetor ? parseInt(data.codsetor) : null,
          status: 'pendente'
        })
        .select()
        .single();

      if (ordemError) throw ordemError;

      // Criar itens da ordem
      const itemsToInsert = items.map(item => ({
        codordem: ordem.codordem,
        codingrediente: item.codingrediente,
        quantidade: item.quantidade,
        preco_unitario: item.preco_unitario
      }));

      const { error: itemsError } = await supabase
        .from('item_ordem_compra')
        .insert(itemsToInsert);

      if (itemsError) throw itemsError;

      toast({
        title: "Sucesso",
        description: "Ordem de compra criada com sucesso!"
      });

      setOpen(false);
      reset();
      setItems([]);
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
          <Plus className="h-4 w-4 mr-2" />
          Nova Ordem de Compra
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Criar Nova Ordem de Compra</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Data da Ordem</label>
              <Input 
                type="date" 
                {...register('data_ordem', { required: true })}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Fornecedor</label>
              <Select onValueChange={(value) => setValue('codfornecedor', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um fornecedor" />
                </SelectTrigger>
                <SelectContent>
                  {fornecedores.map((fornecedor) => (
                    <SelectItem key={fornecedor.codfornecedor} value={fornecedor.codfornecedor.toString()}>
                      {fornecedor.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Setor</label>
              <Select onValueChange={(value) => setValue('codsetor', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um setor (opcional)" />
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

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Itens da Ordem
                <Button type="button" onClick={addItem} size="sm" variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar Item
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {items.length === 0 ? (
                <p className="text-gray-500 text-center py-4">Nenhum item adicionado</p>
              ) : (
                <div className="space-y-4">
                  {items.map((item, index) => (
                    <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 border rounded-lg">
                      <div>
                        <label className="block text-sm font-medium mb-1">Ingrediente</label>
                        <Select 
                          value={item.codingrediente.toString()}
                          onValueChange={(value) => updateItem(index, 'codingrediente', parseInt(value))}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione" />
                          </SelectTrigger>
                          <SelectContent>
                            {ingredientes.map((ingrediente) => (
                              <SelectItem key={ingrediente.codingrediente} value={ingrediente.codingrediente.toString()}>
                                {ingrediente.nome}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-1">Quantidade</label>
                        <Input 
                          type="number"
                          min="0"
                          step="0.01"
                          value={item.quantidade}
                          onChange={(e) => updateItem(index, 'quantidade', parseFloat(e.target.value) || 0)}
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-1">Preço Unitário</label>
                        <Input 
                          type="number"
                          min="0"
                          step="0.01"
                          value={item.preco_unitario}
                          onChange={(e) => updateItem(index, 'preco_unitario', parseFloat(e.target.value) || 0)}
                        />
                      </div>
                      
                      <div className="flex items-end">
                        <Button 
                          type="button"
                          onClick={() => removeItem(index)}
                          variant="destructive"
                          size="sm"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isCreating}>
              {isCreating ? 'Criando...' : 'Criar Ordem'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

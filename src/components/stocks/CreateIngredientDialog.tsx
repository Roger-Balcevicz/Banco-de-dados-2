
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface CreateIngredientDialogProps {
  onIngredientCreated: () => void;
}

export function CreateIngredientDialog({ onIngredientCreated }: CreateIngredientDialogProps) {
  const [open, setOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const { toast } = useToast();
  
  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    defaultValues: {
      nome: '',
      descricao: '',
      unidade_medida: '',
      estoque_minimo: 10,
      estoque_atual: 0
    }
  });

  const onSubmit = async (data: any) => {
    setIsCreating(true);
    try {
      const { error } = await supabase
        .from('ingrediente')
        .insert(data);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Ingrediente criado com sucesso!"
      });

      setOpen(false);
      reset();
      onIngredientCreated();
    } catch (error) {
      console.error('Erro ao criar ingrediente:', error);
      toast({
        title: "Erro",
        description: "Erro ao criar ingrediente",
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
          Novo Ingrediente
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Criar Novo Ingrediente</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Nome</label>
            <Input 
              {...register('nome', { required: 'Nome é obrigatório' })}
            />
            {errors.nome && <p className="text-red-500 text-sm mt-1">{String(errors.nome.message)}</p>}
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Descrição</label>
            <Input {...register('descricao')} />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Unidade de Medida</label>
            <Input {...register('unidade_medida')} placeholder="kg, litros, unidades..." />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Estoque Mínimo</label>
            <Input 
              type="number"
              step="0.01"
              {...register('estoque_minimo', { valueAsNumber: true })}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Estoque Inicial</label>
            <Input 
              type="number"
              step="0.01"
              {...register('estoque_atual', { valueAsNumber: true })}
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isCreating}>
              {isCreating ? 'Criando...' : 'Criar'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

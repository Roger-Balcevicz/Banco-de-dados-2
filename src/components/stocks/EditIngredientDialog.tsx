
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Edit } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface EditIngredientDialogProps {
  ingrediente: any;
  onIngredientUpdated: () => void;
}

export function EditIngredientDialog({ ingrediente, onIngredientUpdated }: EditIngredientDialogProps) {
  const [open, setOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const { toast } = useToast();
  
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      nome: ingrediente.nome,
      descricao: ingrediente.descricao || '',
      unidade_medida: ingrediente.unidade_medida || '',
      estoque_minimo: ingrediente.estoque_minimo || 0
    }
  });

  const onSubmit = async (data: any) => {
    setIsUpdating(true);
    try {
      const { error } = await supabase
        .from('ingrediente')
        .update(data)
        .eq('codingrediente', ingrediente.codingrediente);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Ingrediente atualizado com sucesso!"
      });

      setOpen(false);
      onIngredientUpdated();
    } catch (error) {
      console.error('Erro ao atualizar ingrediente:', error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar ingrediente",
        variant: "destructive"
      });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline">
          <Edit className="h-4 w-4 mr-1" />
          Editar
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar Ingrediente</DialogTitle>
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
            <Input {...register('unidade_medida')} />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Estoque Mínimo</label>
            <Input 
              type="number"
              step="0.01"
              {...register('estoque_minimo', { valueAsNumber: true })}
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isUpdating}>
              {isUpdating ? 'Atualizando...' : 'Atualizar'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

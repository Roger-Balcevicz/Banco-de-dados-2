
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Edit } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface EditRecipeDialogProps {
  receita: any;
  onRecipeUpdated: () => void;
}

export function EditRecipeDialog({ receita, onRecipeUpdated }: EditRecipeDialogProps) {
  const [open, setOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const { toast } = useToast();
  
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      nome: receita.nome,
      descricao: receita.descricao || ''
    }
  });

  const onSubmit = async (data: any) => {
    setIsUpdating(true);
    try {
      const { error } = await supabase
        .from('receita')
        .update(data)
        .eq('codreceita', receita.codreceita);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Receita atualizada com sucesso!"
      });

      setOpen(false);
      onRecipeUpdated();
    } catch (error) {
      console.error('Erro ao atualizar receita:', error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar receita",
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
          <DialogTitle>Editar Receita</DialogTitle>
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
            <Textarea 
              {...register('descricao')}
              rows={4}
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

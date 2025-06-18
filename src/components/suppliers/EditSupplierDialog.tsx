
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Edit } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface EditSupplierDialogProps {
  fornecedor: any;
  onSupplierUpdated: () => void;
}

export function EditSupplierDialog({ fornecedor, onSupplierUpdated }: EditSupplierDialogProps) {
  const [open, setOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const { toast } = useToast();
  
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      nome: fornecedor.nome,
      contato: fornecedor.contato || ''
    }
  });

  const onSubmit = async (data: any) => {
    setIsUpdating(true);
    try {
      const { error } = await supabase
        .from('fornecedor')
        .update(data)
        .eq('codfornecedor', fornecedor.codfornecedor);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Fornecedor atualizado com sucesso!"
      });

      setOpen(false);
      onSupplierUpdated();
    } catch (error) {
      console.error('Erro ao atualizar fornecedor:', error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar fornecedor",
        variant: "destructive"
      });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Edit className="h-4 w-4 mr-1" />
          Editar Informações
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar Fornecedor</DialogTitle>
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
            <label className="block text-sm font-medium mb-1">Contato</label>
            <Input {...register('contato')} placeholder="Telefone, email..." />
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

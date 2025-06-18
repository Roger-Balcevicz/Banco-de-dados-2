
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Move } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useSetores } from '@/hooks/useSupabaseData';

interface MoveStockDialogProps {
  ingrediente: any;
  onMovementAdded: () => void;
}

export function MoveStockDialog({ ingrediente, onMovementAdded }: MoveStockDialogProps) {
  const [open, setOpen] = useState(false);
  const [isMoving, setIsMoving] = useState(false);
  const { setores } = useSetores();
  const { toast } = useToast();
  
  const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm({
    defaultValues: {
      tipo_movimentacao: 'entrada',
      quantidade: 0,
      codsetor: '',
      origem: ''
    }
  });

  const onSubmit = async (data: any) => {
    setIsMoving(true);
    try {
      const { error } = await supabase
        .from('movimentacao_estoque')
        .insert({
          codingrediente: ingrediente.codingrediente,
          codsetor: data.codsetor ? parseInt(data.codsetor) : null,
          data_movimentacao: new Date().toISOString().split('T')[0],
          tipo_movimentacao: data.tipo_movimentacao,
          quantidade: data.tipo_movimentacao === 'saida' ? -Math.abs(data.quantidade) : Math.abs(data.quantidade),
          origem: data.origem
        });

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Movimentação registrada com sucesso!"
      });

      setOpen(false);
      reset();
      onMovementAdded();
    } catch (error) {
      console.error('Erro ao registrar movimentação:', error);
      toast({
        title: "Erro",
        description: "Erro ao registrar movimentação",
        variant: "destructive"
      });
    } finally {
      setIsMoving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline">
          <Move className="h-4 w-4 mr-1" />
          Movimentar
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Movimentar Estoque - {ingrediente.nome}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Tipo de Movimentação</label>
            <Select onValueChange={(value) => setValue('tipo_movimentacao', value)} defaultValue="entrada">
              <SelectTrigger>
                <SelectValue placeholder="Selecione o tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="entrada">Entrada</SelectItem>
                <SelectItem value="saida">Saída</SelectItem>
                <SelectItem value="ajuste">Ajuste</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Quantidade</label>
            <Input 
              type="number"
              step="0.01"
              {...register('quantidade', { 
                required: 'Quantidade é obrigatória',
                valueAsNumber: true,
                min: { value: 0.01, message: 'Quantidade deve ser maior que zero' }
              })}
            />
            {errors.quantidade && <p className="text-red-500 text-sm mt-1">{errors.quantidade.message}</p>}
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Setor</label>
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
          
          <div>
            <label className="block text-sm font-medium mb-1">Origem/Observação</label>
            <Input 
              {...register('origem')}
              placeholder="Ex: Compra, Produção, Ajuste..."
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isMoving}>
              {isMoving ? 'Registrando...' : 'Registrar'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

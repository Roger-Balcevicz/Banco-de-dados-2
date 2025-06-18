
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Eye } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface RecipeIngredient {
  cod: number;
  codingrediente: number;
  quantidade_necessaria: number;
  ingrediente: {
    nome: string;
    unidade_medida: string;
  };
}

interface ViewRecipeIngredientsDialogProps {
  codreceita: number;
  nomeReceita: string;
}

export function ViewRecipeIngredientsDialog({ codreceita, nomeReceita }: ViewRecipeIngredientsDialogProps) {
  const [open, setOpen] = useState(false);
  const [ingredients, setIngredients] = useState<RecipeIngredient[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchIngredients = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('ingrediente_receita')
        .select(`
          *,
          ingrediente (
            nome,
            unidade_medida
          )
        `)
        .eq('codreceita', codreceita);

      if (error) throw error;
      setIngredients(data || []);
    } catch (error) {
      console.error('Erro ao buscar ingredientes da receita:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      fetchIngredients();
    }
  }, [open, codreceita]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline">
          <Eye className="h-4 w-4 mr-1" />
          Ver Ingredientes
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Ingredientes - {nomeReceita}</DialogTitle>
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
                  <TableHead>Quantidade Necessária</TableHead>
                  <TableHead>Unidade</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {ingredients.map((ingredient) => (
                  <TableRow key={ingredient.cod}>
                    <TableCell className="font-medium">
                      {ingredient.ingrediente?.nome || 'N/A'}
                    </TableCell>
                    <TableCell>{ingredient.quantidade_necessaria || 0}</TableCell>
                    <TableCell>{ingredient.ingrediente?.unidade_medida || 'UN'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            
            {ingredients.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                Nenhum ingrediente encontrado para esta receita
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

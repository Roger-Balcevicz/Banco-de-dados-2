
import { supabase } from '@/integrations/supabase/client';

// Tipos baseados nas tabelas do banco
export interface Fornecedor {
  codfornecedor: number;
  nome: string;
  contato?: string;
}

export interface Ingrediente {
  codingrediente: number;
  nome: string;
  descricao?: string;
  unidade_medida?: string;
  estoque_atual?: number;
  estoque_minimo?: number;
}

export interface Receita {
  codreceita: number;
  nome: string;
  descricao?: string;
}

export interface IngredienteReceita {
  cod: number;
  codreceita: number;
  codingrediente: number;
  quantidade_necessaria?: number;
}

export interface OrdemCompra {
  codordem: number;
  data_ordem: string;
  codfornecedor: number;
  codsetor?: number;
  status?: string;
}

export interface ItemOrdemCompra {
  coditem: number;
  codordem: number;
  codingrediente: number;
  quantidade: number;
  preco_unitario?: number;
}

export interface MovimentacaoEstoque {
  codmovimentacao: number;
  codingrediente: number;
  codsetor?: number;
  data_movimentacao: string;
  tipo_movimentacao?: string;
  quantidade: number;
  origem?: string;
}

export interface Setor {
  codsetor: number;
  nome: string;
}

// Funções para Fornecedores
export const getFornecedores = async () => {
  const { data, error } = await supabase
    .from('fornecedor')
    .select('*')
    .order('nome');
  
  if (error) {
    console.error('Erro ao buscar fornecedores:', error);
    return [];
  }
  
  return data || [];
};

export const getFornecedorById = async (id: number) => {
  const { data, error } = await supabase
    .from('fornecedor')
    .select('*')
    .eq('codfornecedor', id)
    .single();
  
  if (error) {
    console.error('Erro ao buscar fornecedor:', error);
    return null;
  }
  
  return data;
};

// Funções para Ingredientes
export const getIngredientes = async () => {
  const { data, error } = await supabase
    .from('ingrediente')
    .select('*')
    .order('nome');
  
  if (error) {
    console.error('Erro ao buscar ingredientes:', error);
    return [];
  }
  
  return data || [];
};

export const getIngredienteById = async (id: number) => {
  const { data, error } = await supabase
    .from('ingrediente')
    .select('*')
    .eq('codingrediente', id)
    .single();
  
  if (error) {
    console.error('Erro ao buscar ingrediente:', error);
    return null;
  }
  
  return data;
};

export const getIngredientesEstoqueBaixo = async () => {
  const { data, error } = await supabase
    .from('vw_avisos_estoque_baixo')
    .select('*');
  
  if (error) {
    console.error('Erro ao buscar ingredientes com estoque baixo:', error);
    return [];
  }
  
  return data || [];
};

// Funções para Receitas
export const getReceitas = async () => {
  const { data, error } = await supabase
    .from('receita')
    .select('*')
    .order('nome');
  
  if (error) {
    console.error('Erro ao buscar receitas:', error);
    return [];
  }
  
  return data || [];
};

export const getIngredientesReceita = async (codreceita: number) => {
  const { data, error } = await supabase
    .from('ingrediente_receita')
    .select(`
      *,
      ingrediente (*)
    `)
    .eq('codreceita', codreceita);
  
  if (error) {
    console.error('Erro ao buscar ingredientes da receita:', error);
    return [];
  }
  
  return data || [];
};

// Funções para Ordens de Compra
export const getOrdensCompra = async () => {
  const { data, error } = await supabase
    .from('ordem_compra')
    .select(`
      *,
      fornecedor (*),
      setor (*)
    `)
    .order('data_ordem', { ascending: false });
  
  if (error) {
    console.error('Erro ao buscar ordens de compra:', error);
    return [];
  }
  
  return data || [];
};

export const getItensOrdemCompra = async (codordem: number) => {
  const { data, error } = await supabase
    .from('item_ordem_compra')
    .select(`
      *,
      ingrediente (*)
    `)
    .eq('codordem', codordem);
  
  if (error) {
    console.error('Erro ao buscar itens da ordem de compra:', error);
    return [];
  }
  
  return data || [];
};

// Funções para Movimentação de Estoque
export const getMovimentacaoEstoque = async (limit = 50) => {
  const { data, error } = await supabase
    .from('movimentacao_estoque')
    .select(`
      *,
      ingrediente (*),
      setor (*)
    `)
    .order('data_movimentacao', { ascending: false })
    .limit(limit);
  
  if (error) {
    console.error('Erro ao buscar movimentações de estoque:', error);
    return [];
  }
  
  return data || [];
};

export const getMovimentacaoByIngrediente = async (codingrediente: number) => {
  const { data, error } = await supabase
    .from('movimentacao_estoque')
    .select('*')
    .eq('codingrediente', codingrediente)
    .order('data_movimentacao', { ascending: false })
    .limit(30);
  
  if (error) {
    console.error('Erro ao buscar movimentações do ingrediente:', error);
    return [];
  }
  
  return data || [];
};

// Funções para Setores
export const getSetores = async () => {
  const { data, error } = await supabase
    .from('setor')
    .select('*')
    .order('nome');
  
  if (error) {
    console.error('Erro ao buscar setores:', error);
    return [];
  }
  
  return data || [];
};

// Funções de inserção
export const inserirIngrediente = async (ingrediente: Omit<Ingrediente, 'codingrediente'>) => {
  const { data, error } = await supabase
    .from('ingrediente')
    .insert(ingrediente)
    .select()
    .single();
  
  if (error) {
    console.error('Erro ao inserir ingrediente:', error);
    throw error;
  }
  
  return data;
};

export const inserirFornecedor = async (fornecedor: Omit<Fornecedor, 'codfornecedor'>) => {
  const { data, error } = await supabase
    .from('fornecedor')
    .insert(fornecedor)
    .select()
    .single();
  
  if (error) {
    console.error('Erro ao inserir fornecedor:', error);
    throw error;
  }
  
  return data;
};

export const inserirOrdemCompra = async (ordem: Omit<OrdemCompra, 'codordem'>) => {
  const { data, error } = await supabase
    .from('ordem_compra')
    .insert(ordem)
    .select()
    .single();
  
  if (error) {
    console.error('Erro ao inserir ordem de compra:', error);
    throw error;
  }
  
  return data;
};

export const registrarMovimentacao = async (movimentacao: Omit<MovimentacaoEstoque, 'codmovimentacao'>) => {
  const { data, error } = await supabase
    .from('movimentacao_estoque')
    .insert(movimentacao)
    .select()
    .single();
  
  if (error) {
    console.error('Erro ao registrar movimentação:', error);
    throw error;
  }
  
  return data;
};

// Funções de estatísticas
export const getEstatisticasGerais = async () => {
  const [ingredientes, fornecedores, ordens, movimentacoes] = await Promise.all([
    getIngredientes(),
    getFornecedores(),
    getOrdensCompra(),
    getMovimentacaoEstoque(100)
  ]);
  
  const totalIngredientes = ingredientes.length;
  const totalFornecedores = fornecedores.length;
  const totalOrdens = ordens.length;
  const ingredientesEstoqueBaixo = ingredientes.filter(i => 
    (i.estoque_atual || 0) <= (i.estoque_minimo || 0)
  ).length;
  
  const valorTotalEstoque = ingredientes.reduce((total, ing) => 
    total + ((ing.estoque_atual || 0) * 5), 0 // Valor estimado
  );
  
  return {
    totalIngredientes,
    totalFornecedores,
    totalOrdens,
    ingredientesEstoqueBaixo,
    valorTotalEstoque,
    movimentacoesRecentes: movimentacoes.slice(0, 10)
  };
};

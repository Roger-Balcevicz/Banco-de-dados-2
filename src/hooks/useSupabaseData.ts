
import { useState, useEffect, useCallback } from 'react';
import { 
  getIngredientes, 
  getFornecedores, 
  getOrdensCompra, 
  getMovimentacaoEstoque,
  getEstatisticasGerais,
  getReceitas,
  getSetores,
  type Ingrediente,
  type Fornecedor,
  type OrdemCompra,
  type MovimentacaoEstoque,
  type Receita,
  type Setor
} from '@/utils/supabaseApi';

export const useIngredientes = () => {
  const [ingredientes, setIngredientes] = useState<Ingrediente[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchIngredientes = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getIngredientes();
      setIngredientes(data);
    } catch (err) {
      setError('Erro ao carregar ingredientes');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchIngredientes();
  }, [fetchIngredientes]);

  return { ingredientes, loading, error, refetch: fetchIngredientes };
};

export const useFornecedores = () => {
  const [fornecedores, setFornecedores] = useState<Fornecedor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFornecedores = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getFornecedores();
      setFornecedores(data);
    } catch (err) {
      setError('Erro ao carregar fornecedores');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFornecedores();
  }, [fetchFornecedores]);

  return { fornecedores, loading, error, refetch: fetchFornecedores };
};

export const useOrdensCompra = () => {
  const [ordens, setOrdens] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrdens = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getOrdensCompra();
      setOrdens(data);
    } catch (err) {
      setError('Erro ao carregar ordens de compra');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrdens();
  }, [fetchOrdens]);

  return { ordens, loading, error, refetch: fetchOrdens };
};

export const useMovimentacaoEstoque = () => {
  const [movimentacoes, setMovimentacoes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMovimentacoes = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getMovimentacaoEstoque();
      setMovimentacoes(data);
    } catch (err) {
      setError('Erro ao carregar movimentações');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMovimentacoes();
  }, [fetchMovimentacoes]);

  return { movimentacoes, loading, error, refetch: fetchMovimentacoes };
};

export const useEstatisticas = () => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getEstatisticasGerais();
      setStats(data);
    } catch (err) {
      setError('Erro ao carregar estatísticas');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return { stats, loading, error, refetch: fetchStats };
};

export const useReceitas = () => {
  const [receitas, setReceitas] = useState<Receita[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchReceitas = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getReceitas();
      setReceitas(data);
    } catch (err) {
      setError('Erro ao carregar receitas');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReceitas();
  }, [fetchReceitas]);

  return { receitas, loading, error, refetch: fetchReceitas };
};

export const useSetores = () => {
  const [setores, setSetores] = useState<Setor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSetores = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getSetores();
      setSetores(data);
    } catch (err) {
      setError('Erro ao carregar setores');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSetores();
  }, [fetchSetores]);

  return { setores, loading, error, refetch: fetchSetores };
};

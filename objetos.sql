-- ===============================
-- FUNCTIONS
-- ===============================

-- 1. Calcular custo da receita
CREATE OR REPLACE FUNCTION fn_calcular_custo_receita(cod_receita INT)
RETURNS NUMERIC AS $$
DECLARE total NUMERIC := 0;
BEGIN
  SELECT SUM(ir.quantidade_necessaria * COALESCE(i.preco_unitario, 0))
  INTO total
  FROM ingrediente_receita ir
  JOIN ingrediente i ON ir.codingrediente = i.codingrediente
  WHERE ir.codreceita = cod_receita;
  RETURN COALESCE(total, 0);
END;
$$ LANGUAGE plpgsql;

-- 2. Estoque atual de um ingrediente
CREATE OR REPLACE FUNCTION fn_quantidade_disponivel(id INT)
RETURNS NUMERIC AS $$
DECLARE total NUMERIC := 0;
BEGIN
  SELECT estoque_atual INTO total FROM ingrediente WHERE codingrediente = id;
  RETURN COALESCE(total, 0);
END;
$$ LANGUAGE plpgsql;

-- 3. Inserir ordem de compra
CREATE OR REPLACE FUNCTION fn_inserir_ordem_compra(
  p_data DATE,
  p_codfornecedor INT,
  p_codsetor INT,
  p_codstatus INT,
  p_ingredientes INT[],
  p_quantidades NUMERIC[],
  p_precos NUMERIC[]
)
RETURNS INT AS $$
DECLARE nova_ordem_id INT;
BEGIN
  INSERT INTO ordem_compra (data_ordem, codfornecedor, codsetor, codstatus)
  VALUES (p_data, p_codfornecedor, p_codsetor, p_codstatus)
  RETURNING codordem INTO nova_ordem_id;

  FOR i IN 1..array_length(p_ingredientes, 1) LOOP
    INSERT INTO item_ordem_compra (codordem, codingrediente, quantidade, preco_unitario)
    VALUES (nova_ordem_id, p_ingredientes[i], p_quantidades[i], p_precos[i]);
  END LOOP;

  RETURN nova_ordem_id;
END;
$$ LANGUAGE plpgsql;

-- 4. Registrar movimentação
CREATE OR REPLACE FUNCTION fn_registrar_movimentacao(
  p_codingrediente INT,
  p_codsetor INT,
  p_data DATE,
  p_tipo VARCHAR,
  p_quantidade NUMERIC,
  p_origem VARCHAR
)
RETURNS TEXT AS $$
BEGIN
  INSERT INTO movimentacao_estoque (codingrediente, codsetor, data_movimentacao, tipo_movimentacao, quantidade, origem)
  VALUES (p_codingrediente, p_codsetor, p_data, p_tipo, p_quantidade, p_origem);

  RETURN 'Movimentação registrada.';
END;
$$ LANGUAGE plpgsql;

-- 5. Ajustar estoque
CREATE OR REPLACE FUNCTION fn_ajustar_estoque(
  p_codingrediente INT,
  p_quantidade NUMERIC,
  p_observacao VARCHAR
)
RETURNS TEXT AS $$
BEGIN
  PERFORM fn_registrar_movimentacao(
    p_codingrediente, NULL, CURRENT_DATE, 'ajuste', p_quantidade, p_observacao
  );
  RETURN 'Estoque ajustado.';
END;
$$ LANGUAGE plpgsql;

--6. Previsão de reposição
CREATE OR REPLACE FUNCTION fn_previsao_reposicao(id INT)
RETURNS DATE AS $$
DECLARE
  consumo_medio NUMERIC;
  estoque NUMERIC;
  dias_restantes INT;
BEGIN
  SELECT AVG(ABS(quantidade)) INTO consumo_medio
  FROM movimentacao_estoque
  WHERE codingrediente = id AND tipo_movimentacao = 'saida';

  SELECT estoque_atual INTO estoque FROM ingrediente WHERE codingrediente = id;

  IF consumo_medio IS NULL OR consumo_medio = 0 THEN
    RETURN NULL;
  END IF;

  dias_restantes := estoque / consumo_medio;
  RETURN CURRENT_DATE + dias_restantes;
END;
$$ LANGUAGE plpgsql; 

-- ===============================
-- TRIGGERS
-- ===============================

-- Atualiza estoque atual na tabela ingrediente sempre que houver movimentação
CREATE OR REPLACE FUNCTION fn_atualiza_estoque()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE ingrediente
  SET estoque_atual = (
    SELECT COALESCE(SUM(quantidade), 0)
    FROM movimentacao_estoque
    WHERE codingrediente = NEW.codingrediente
  )
  WHERE codingrediente = NEW.codingrediente;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_recalcular_estoque_total
AFTER INSERT OR UPDATE OR DELETE ON movimentacao_estoque
FOR EACH ROW
EXECUTE FUNCTION fn_atualiza_estoque();

-- Dispara aviso quando estoque de um ingrediente ficar abaixo do mínimo
CREATE OR REPLACE FUNCTION fn_aviso_estoque_baixo()
RETURNS TRIGGER AS $$
DECLARE
  v_estoque NUMERIC;
  v_minimo NUMERIC;
  v_nome TEXT;
BEGIN
  SELECT estoque_atual, estoque_minimo, nome
  INTO v_estoque, v_minimo, v_nome
  FROM ingrediente
  WHERE codingrediente = NEW.codingrediente;

  IF v_estoque < v_minimo THEN
    RAISE NOTICE 'Estoque abaixo do mínimo para "%": atual = %, mínimo = %.',
                 v_nome, v_estoque, v_minimo;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_baixo_estoque
AFTER INSERT OR UPDATE ON movimentacao_estoque
FOR EACH ROW
EXECUTE FUNCTION fn_aviso_estoque_baixo();

-- Gera movimentação de entrada quando a ordem for marcada como recebida
CREATE OR REPLACE FUNCTION fn_receber_ordem_compra()
RETURNS TRIGGER AS $$
DECLARE item RECORD;
BEGIN
  IF NEW.codstatus = 2 AND OLD.codstatus IS DISTINCT FROM 2 THEN
    FOR item IN
      SELECT codingrediente, quantidade
      FROM item_ordem_compra
      WHERE codordem = NEW.codordem
    LOOP
      INSERT INTO movimentacao_estoque (
        codingrediente, codsetor, data_movimentacao, tipo_movimentacao, quantidade, origem
      )
      VALUES (
        item.codingrediente,
        NEW.codsetor,
        CURRENT_DATE,
        'entrada',
        item.quantidade,
        CONCAT('Recebimento da ordem ', NEW.codordem)
      );
    END LOOP;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_recebimento_ordem_compra
AFTER UPDATE OF codstatus ON ordem_compra
FOR EACH ROW
EXECUTE FUNCTION fn_receber_ordem_compra();

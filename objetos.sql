-- ============================================
-- FUNCTIONS
-- ============================================

-- 1. fn_calcular_custo_receita
CREATE OR REPLACE FUNCTION fn_calcular_custo_receita(cod_receita INT)
RETURNS NUMERIC AS $$
DECLARE
    total NUMERIC := 0;
BEGIN
    SELECT SUM(ir.quantidade_necessaria * COALESCE(i.preco_unitario, 0))
    INTO total
    FROM ingrediente_receita ir
    JOIN ingrediente i ON ir.codingrediente = i.codingrediente
    WHERE ir.codreceita = cod_receita;
    RETURN COALESCE(total, 0);
END;
$$ LANGUAGE plpgsql;


-- 2. fn_quantidade_disponivel
CREATE OR REPLACE FUNCTION fn_quantidade_disponivel(id INT)
RETURNS NUMERIC AS $$
DECLARE
    total NUMERIC := 0;
BEGIN
    SELECT estoque_atual INTO total FROM ingrediente WHERE codingrediente = id;
    RETURN COALESCE(total, 0);
END;
$$ LANGUAGE plpgsql;

-- 3. fn_previsao_reposicao
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

-- ============================================
-- PROCEDURES
-- ============================================

-- 1. sp_inserir_ordem_compra
CREATE OR REPLACE PROCEDURE sp_inserir_ordem_compra(
    p_data DATE,
    p_codfornecedor INT,
    p_codsetor INT,
    p_status VARCHAR,
    p_ingredientes INT[],
    p_quantidades NUMERIC[],
    p_precos NUMERIC[]
)
LANGUAGE plpgsql
AS $$
DECLARE
    nova_ordem_id INT;
    i INT := 1;
BEGIN
    INSERT INTO ordem_compra (data_ordem, codfornecedor, codsetor, status)
    VALUES (p_data, p_codfornecedor, p_codsetor, p_status)
    RETURNING codordem INTO nova_ordem_id;

    WHILE i <= array_length(p_ingredientes, 1) LOOP
        INSERT INTO item_ordem_compra (codordem, codingrediente, quantidade, preco_unitario)
        VALUES (nova_ordem_id, p_ingredientes[i], p_quantidades[i], p_precos[i]);
        i := i + 1;
    END LOOP;
END;
$$;

-- 2. sp_registrar_movimentacao
CREATE OR REPLACE PROCEDURE sp_registrar_movimentacao(
    p_codingrediente INT,
    p_codsetor INT,
    p_data DATE,
    p_tipo VARCHAR,
    p_quantidade NUMERIC,
    p_origem VARCHAR
)
LANGUAGE plpgsql
AS $$
BEGIN
    INSERT INTO movimentacao_estoque (codingrediente, codsetor, data_movimentacao, tipo_movimentacao, quantidade, origem)
    VALUES (p_codingrediente, p_codsetor, p_data, p_tipo, p_quantidade, p_origem);
END;
$$;

-- 3. sp_repor_estoque_minimo
CREATE OR REPLACE PROCEDURE sp_repor_estoque_minimo()
LANGUAGE plpgsql
AS $$
BEGIN
    INSERT INTO ordem_compra (data_ordem, codfornecedor, codsetor, status)
    SELECT CURRENT_DATE, 1, 1, 'pendente'
    WHERE EXISTS (
        SELECT 1 FROM ingrediente WHERE estoque_atual < 10
    );
END;
$$;

-- 4. sp_processar_receita
CREATE OR REPLACE PROCEDURE sp_processar_receita(p_codreceita INT, p_codsetor INT)
LANGUAGE plpgsql
AS $$
DECLARE
    r RECORD;
BEGIN
    FOR r IN
        SELECT codingrediente, quantidade_necessaria
        FROM ingrediente_receita
        WHERE codreceita = p_codreceita
    LOOP
        CALL sp_registrar_movimentacao(
            r.codingrediente, p_codsetor, CURRENT_DATE, 'produção', -r.quantidade_necessaria, 'Receita'
        );
    END LOOP;
END;
$$;

-- 5. sp_ajustar_estoque
CREATE OR REPLACE PROCEDURE sp_ajustar_estoque(
    p_codingrediente INT,
    p_quantidade NUMERIC,
    p_observacao VARCHAR
)
LANGUAGE plpgsql
AS $$
BEGIN
    CALL sp_registrar_movimentacao(
        p_codingrediente, NULL, CURRENT_DATE, 'ajuste', p_quantidade, p_observacao
    );
END;
$$;


-- ============================================
-- TRIGGERS
-- ============================================
--1 Atualiza estoque_atual na tabela ingrediente sempre que houver movimentação
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

--2 Dispara aviso quando estoque de um ingrediente ficar abaixo do mínimo.
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

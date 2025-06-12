-- ============================================
-- VIEWS
-- ============================================

-- 1. vw_estoque_atual
CREATE OR REPLACE VIEW vw_estoque_atual AS
SELECT 
    codingrediente, 
    nome, 
    unidade_medida, 
    estoque_atual, 
    estoque_minimo
FROM ingrediente;

-- 2. vw_avisos_estoque_baixo
CREATE OR REPLACE VIEW vw_avisos_estoque_baixo AS
SELECT 
    codingrediente, 
    nome, 
    estoque_atual, 
    estoque_minimo
FROM ingrediente
WHERE estoque_atual < estoque_minimo;

-- 3. vw_compras_por_fornecedor
CREATE OR REPLACE VIEW vw_compras_por_fornecedor AS
SELECT 
    f.nome AS fornecedor, 
    SUM(ioc.quantidade * ioc.preco_unitario) AS total_compras
FROM item_ordem_compra ioc
JOIN ordem_compra oc ON ioc.codordem = oc.codordem
JOIN fornecedor f ON f.codfornecedor = oc.codfornecedor
GROUP BY f.nome
ORDER BY total_compras DESC;

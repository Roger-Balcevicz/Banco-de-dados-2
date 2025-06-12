-- Índices da tabela ingrediente
CREATE INDEX idx_nome_ingrediente ON ingrediente(nome);
CREATE INDEX idx_estoque_atual ON ingrediente(estoque_atual);

-- Índice da tabela fornecedor
CREATE INDEX idx_nome_fornecedor ON fornecedor(nome);

-- Índice da tabela ordem_compra
CREATE INDEX idx_ordem_data ON ordem_compra(data_ordem);

-- Índice da tabela item_ordem_compra
CREATE INDEX idx_item_ingrediente ON item_ordem_compra(codingrediente);

-- Índice da tabela movimentacao_estoque
CREATE INDEX idx_movimentacao_tipo_data ON movimentacao_estoque(tipo_movimentacao, data_movimentacao);

-- Índice da tabela setor
CREATE INDEX idx_nome_setor ON setor(nome);

-- Índice da tabela receita
CREATE INDEX idx_nome_receita ON receita(nome);

-- Índice da tabela ingrediente_receita
CREATE INDEX idx_ingrediente_receita ON ingrediente_receita(codreceita, codingrediente);
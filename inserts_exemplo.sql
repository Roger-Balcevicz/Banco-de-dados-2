-- INSERTS PARA A TABELA SETOR
INSERT INTO setor (nome) VALUES
('Cozinha Principal'),
('Bar'),
('Confeitaria'),
('Churrasqueira'),
('Sushi Bar'),
('Delivery'),
('Salão'),
('Administração'),
('Estoque Seco'),
('Câmara Fria');

-- INSERTS PARA A TABELA INGREDIENTE
INSERT INTO ingrediente (nome, descricao, unidade_medida, estoque_atual) VALUES
('Farinha de Trigo', 'Ingrediente de cozinha', 'kg', 50),
('Leite Integral', 'Ingrediente de cozinha', 'litro', 30),
('Ovo', 'Ingrediente de cozinha', 'unidade', 200),
('Carne Moída', 'Ingrediente de cozinha', 'kg', 20),
('Cebola', 'Ingrediente de cozinha', 'kg', 15),
('Queijo Mussarela', 'Ingrediente de cozinha', 'kg', 25),
('Tomate', 'Ingrediente de cozinha', 'kg', 18),
('Açúcar', 'Ingrediente de cozinha', 'kg', 40),
('Manteiga', 'Ingrediente de cozinha', 'kg', 12),
('Fermento Biológico', 'Ingrediente de cozinha', 'g', 5);

-- INSERTS PARA A TABELA FORNECEDOR
INSERT INTO fornecedor (nome, contato) VALUES
('Distribuidora Alimentos LTDA', 'distribuidoraalimento@gmail.com'),
('Laticínios Bom Leite', 'laticiniosbomleite@gmail.com'),
('Hortifruti Central', 'hortifruticentral@gmail.com'),
('Carnes Premium', 'carnespremium@gmail.com'),
('Ovos São Pedro', 'ovossaopedro@gmail.com'),
('Queijos Mineiros', 'queijosmineiros@gmail.com'),
('Panifício Real', 'panificioreal@gmail.com'),
('Doces da Vó', 'docesdavo@gmail.com'),
('Sabor e Qualidade', 'saborequalidade@gmail.com'),
('Leites Vale Verde', 'leitesvaleverde@gmail.com');

-- INSERTS PARA A TABELA ORDEM_COMPRA
INSERT INTO ordem_compra (data_ordem, codfornecedor, codsetor, status) VALUES
('2025-06-01', 1, 1, 'pendente'),
('2025-06-02', 2, 2, 'recebido'),
('2025-06-03', 3, 3, 'pendente'),
('2025-06-04', 4, 1, 'recebido'),
('2025-06-05', 5, 2, 'pendente'),
('2025-06-06', 6, 4, 'recebido'),
('2025-06-07', 7, 5, 'pendente'),
('2025-06-08', 8, 6, 'recebido'),
('2025-06-09', 9, 7, 'pendente'),
('2025-06-10', 10, 1, 'recebido');

-- INSERTS PARA A TABELA ITEM_ORDEM_COMPRA
INSERT INTO item_ordem_compra (codordem, codingrediente, quantidade, preco_unitario) VALUES
(1, 1, 10.0, 2.5),
(2, 2, 10.0, 3.0),
(3, 3, 10.0, 0.5),
(4, 4, 10.0, 12.0),
(5, 5, 10.0, 2.0),
(6, 6, 10.0, 18.0),
(7, 7, 10.0, 3.5),
(8, 8, 10.0, 4.0),
(9, 9, 10.0, 9.0),
(10, 10, 10.0, 0.05);

-- INSERTS PARA A TABELA MOVIMENTACAO_ESTOQUE
INSERT INTO movimentacao_estoque (codingrediente, codsetor, data_movimentacao, tipo_movimentacao, quantidade, origem) VALUES
(1, 1, '2025-06-05', 'entrada', 10.0, 'Ordem de Compra 1'),
(2, 1, '2025-06-06', 'entrada', 10.0, 'Ordem de Compra 2'),
(3, 1, '2025-06-07', 'entrada', 30.0, 'Ordem de Compra 3'),
(4, 2, '2025-06-08', 'produção', -3.0, 'Receita Lasanha'),
(5, 2, '2025-06-09', 'produção', -5.0, 'Receita Lasanha'),
(6, 3, '2025-06-10', 'entrada', 5.0, 'Ordem de Compra 6'),
(7, 3, '2025-06-11', 'produção', -2.0, 'Receita Pizza'),
(8, 4, '2025-06-12', 'produção', -1.0, 'Receita Doce'),
(9, 4, '2025-06-13', 'entrada', 7.0, 'Ordem de Compra 9'),
(10, 5, '2025-06-14', 'produção', -0.5, 'Receita Bolo');

-- INSERTS PARA A TABELA RECEITA
INSERT INTO receita (nome, descricao) VALUES
('Lasanha Bolonhesa', 'Camadas de massa e carne com molho'),
('Bolo de Leite', 'Bolo simples com leite integral'),
('Quiche de Alho-Poró', 'Torta salgada com alho-poró'),
('Sanduíche Natural', 'Sanduíche leve com frango'),
('Sopa de Legumes', 'Caldo com vegetais variados'),
('Torta de Frango', 'Torta recheada com frango desfiado'),
('Pizza Margherita', 'Pizza com tomate e manjericão'),
('Salada Tropical', 'Salada com frutas e folhas verdes'),
('Escondidinho', 'Prato de carne com purê de batata'),
('Brigadeiro', 'Doce de chocolate tradicional');

-- INSERTS PARA A TABELA INGREDIENTE_RECEITA
INSERT INTO ingrediente_receita (codreceita, codingrediente, quantidade_necessaria) VALUES
(1, 1, 2.0),
(1, 4, 1.5),
(2, 2, 1.0),
(2, 3, 2.0),
(3, 5, 0.5),
(4, 6, 2.5),
(5, 7, 1.2),
(6, 8, 1.8),
(7, 9, 0.4),
(10, 8, 2.0);

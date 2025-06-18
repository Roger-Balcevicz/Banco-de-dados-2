CREATE TABLE setor (
    codsetor SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL
);

CREATE TABLE ingrediente (
    codingrediente SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    descricao TEXT,
    unidade_medida VARCHAR(20),
    estoque_atual DECIMAL(10,2) DEFAULT 0
);

CREATE TABLE fornecedor (
    codfornecedor SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    contato VARCHAR(100)
);

CREATE TABLE ordem_compra (
    codordem SERIAL PRIMARY KEY,
    data_ordem DATE NOT NULL,
    codfornecedor INTEGER NOT NULL,
    codsetor INTEGER, -- quem solicitou
    status VARCHAR(50) DEFAULT 'pendente',
    CONSTRAINT fk_ordem_setor FOREIGN KEY (codfornecedor) REFERENCES fornecedor(codfornecedor),
    CONSTRAINT fk_ordem_fornecedor FOREIGN KEY (codsetor) REFERENCES setor(codsetor)        
);

CREATE TABLE item_ordem_compra (
    coditem SERIAL PRIMARY KEY,
    codordem INTEGER NOT NULL,
    codingrediente INTEGER NOT NULL,
    quantidade DECIMAL(10,2) NOT NULL,
    preco_unitario DECIMAL(10,2),
    CONSTRAINT fk_item_ordem FOREIGN KEY (codordem) REFERENCES ordem_compra(codordem),
    CONSTRAINT fk_item_ingrediente FOREIGN KEY (codingrediente) REFERENCES ingrediente(codingrediente)
);



CREATE TABLE movimentacao_estoque (
    codmovimentacao SERIAL PRIMARY KEY,
    codingrediente INTEGER NOT NULL,
    codsetor INTEGER,
    data_movimentacao DATE NOT NULL,
    tipo_movimentacao VARCHAR(20) CHECK (tipo_movimentacao IN ('entrada', 'saida', 'ajuste', 'produção')),
    quantidade DECIMAL(10,2) NOT NULL,
    origem VARCHAR(100),
    CONSTRAINT fk_movimentacao_ingrediente FOREIGN KEY (codingrediente) REFERENCES ingrediente(codingrediente),
    CONSTRAINT fk_movimentacao_setor FOREIGN KEY (codsetor) REFERENCES setor(codsetor)        
);

CREATE TABLE receita (
    codreceita SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    descricao TEXT
);

CREATE TABLE ingrediente_receita (
    cod SERIAL PRIMARY KEY,
    codreceita INTEGER NOT NULL,
    codingrediente INTEGER NOT NULL,
    quantidade_necessaria DECIMAL(10,2),
    CONSTRAINT fk_receita_ingrediente_receita FOREIGN KEY (codreceita) REFERENCES receita(codreceita),
    CONSTRAINT fk_ingrediente_ingrediente_receita FOREIGN KEY (codingrediente) REFERENCES ingrediente(codingrediente)        
);

-- Alteração na tabela ingrediente: adicionado campo estoque_minimo
ALTER TABLE ingrediente
ADD COLUMN estoque_minimo NUMERIC DEFAULT 10; 

CREATE TABLE status (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(50) NOT NULL
);

ALTER TABLE ordem_compra
ADD COLUMN codstatus INT NOT NULL
DEFAULT 1;

ALTER TABLE ordem_compra
ADD CONSTRAINT fk_ordem_status
FOREIGN KEY (status_id) 
REFERENCES status_ordem(id);


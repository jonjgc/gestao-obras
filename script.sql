-- Diagrama Relacional Simplificado:
-- ORCAMENTO (1) <--- (N) ITEM
-- ORCAMENTO (1) <--- (N) MEDICAO
-- MEDICAO (1) <--- (N) ITEM_MEDICAO
-- ITEM (1) <--- (N) ITEM_MEDICAO

CREATE TABLE orcamento (
    id BIGSERIAL PRIMARY KEY,
    numero_protocolo VARCHAR(255) UNIQUE NOT NULL, -- 
    tipo_orcamento VARCHAR(50) NOT NULL, -- 
    valor_total NUMERIC(19, 2) NOT NULL, -- 
    data_criacao DATE NOT NULL, -- 
    status VARCHAR(20) NOT NULL DEFAULT 'ABERTO' -- 
);

CREATE TABLE item (
    id BIGSERIAL PRIMARY KEY,
    descricao VARCHAR(255) NOT NULL, -- 
    quantidade NUMERIC(19, 2) NOT NULL, -- 
    valor_unitario NUMERIC(19, 2) NOT NULL, -- 
    valor_total NUMERIC(19, 2) NOT NULL, -- 
    quantidade_acumulada NUMERIC(19, 2) DEFAULT 0, -- 
    orcamento_id BIGINT NOT NULL,
    CONSTRAINT fk_orcamento_item FOREIGN KEY (orcamento_id) REFERENCES orcamento(id)
);

CREATE TABLE medicao (
    id BIGSERIAL PRIMARY KEY,
    numero_medicao VARCHAR(255) UNIQUE NOT NULL, -- 
    data_medicao DATE NOT NULL, -- 
    valor_medicao NUMERIC(19, 2) NOT NULL, -- 
    status VARCHAR(20) NOT NULL DEFAULT 'ABERTA', -- 
    observacao TEXT, -- 
    orcamento_id BIGINT NOT NULL,
    CONSTRAINT fk_orcamento_medicao FOREIGN KEY (orcamento_id) REFERENCES orcamento(id)
);

CREATE TABLE item_medicao (
    id BIGSERIAL PRIMARY KEY,
    quantidade_medida NUMERIC(19, 2) NOT NULL, -- 
    valor_total_medido NUMERIC(19, 2) NOT NULL, -- 
    item_id BIGINT NOT NULL,
    medicao_id BIGINT NOT NULL,
    CONSTRAINT fk_item_item_medicao FOREIGN KEY (item_id) REFERENCES item(id),
    CONSTRAINT fk_medicao_item_medicao FOREIGN KEY (medicao_id) REFERENCES medicao(id)
);

-- Tabela de Usuários para o Requisito Opcional de JWT
CREATE TABLE usuario (
    id BIGSERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    senha VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'USER'
);
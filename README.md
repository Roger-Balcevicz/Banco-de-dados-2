# 🍽️ Sistema de Gestão de Suprimentos para Restaurante

**Projeto desenvolvido para a disciplina Banco de Dados II – Engenharia de Software (3ª fase – UNISATC)**  
Professor: Cristiane Pavei Martinello Fernandes 
Data de entrega: Junho de 2025

---

## 📌 Descrição

Este sistema tem como objetivo gerenciar de forma eficiente o estoque, compras e consumo de ingredientes(suprimentos) em um restaurante. A solução visa auxiliar na organização de ordens de compra, controle de movimentações de insumos e na prevenção de faltas com alertas automáticos de estoque mínimo.

---

## 📊 Funcionalidades principais

- Controle de ingredientes com estoque atual e mínimo
- Registro de ordens de compra com múltiplos itens
- Histórico completo de movimentações (entrada, saída, produção, ajuste)
- Alertas automáticos quando o estoque estiver abaixo do mínimo
- Cálculo do custo total de receitas
- Views analíticas para relatórios gerenciais

---

## 🗃️ Modelo de Dados

O sistema conta com 9 tabelas principais:

1. **ingrediente** – Cadastro e controle de estoque de insumos
2. **fornecedor** – Informações dos fornecedores
3. **ordem_compra** – Registro das ordens de compra
4. **item_ordem_compra** – Itens vinculados a cada ordem
5. **movimentacao_estoque** – Lançamentos de entrada/saída/produção
6. **setor** – Áreas internas (cozinha, bar, confeitaria, etc.)
7. **receita** – Pratos do restaurante
8. **ingrediente_receita** – Relacionamento entre receitas e seus ingredientes
9. **status** - Demonstrar os status das ordens de compra 'Pendente' e 'Recebido'

---

## ⚙️ Objetos SQL implementados

### 🔁 Functions

- `fn_calcular_custo_receita(codreceita)`  
  → Soma o custo total dos ingredientes de uma receita

- `fn_quantidade_disponivel(codingrediente)`  
  → Retorna o estoque atual de um ingrediente

- `fn_previsao_reposicao(codingrediente)`  
  → Estima dias restantes até o fim do estoque

- `fn_inserir_ordem_compra(...)`  
  → Insere ordem de compra com múltiplos itens via arrays

- `fn_registrar_movimentacao(...)`  
  → Insere movimentação (entrada/saída/produção)

- `fn_ajustar_estoque(...)`  
  → Permite ajustes manuais (inventário)

---

### 🔔 Triggers

- `trg_recebimento_ordem_compra`
  → Dispara movimentação de entrada no estoque automaticamento quando a ordem de compra é marcada como 'recebido'
  
- `trg_recalcular_estoque_total`  
  → Atualiza `estoque_atual` com base nas movimentações

- `trg_baixo_estoque`  
  → Emite aviso quando o estoque fica abaixo do mínimo
  
---

### 👁️ Views

- `vw_estoque_atual`  
  → Situação atual dos ingredientes

- `vw_avisos_estoque_baixo`  
  → Ingredientes abaixo do estoque mínimo

- `vw_compras_por_fornecedor`  
  → Total gasto em compras por fornecedor

---

## 🧪 Scripts disponíveis

- `criacao_tabelas.sql` – Criação das tabelas principais
- `inserts_exemplo.sql` – Dados de exemplo ( registros das tabelas )
- `objetos.sql` – Functions e triggers
- `Projeto_Final_BD2_2025-ATUALIZADO.docx` – Documento com todo o conteúdo das tabelas.
- `indices_tabelas.sql` – Documento com índices das tabelas
- `view_tabelas.sql` – Documento com as views das tabelas

---

## 💡 Justificativas técnicas

- **Functions**: garantem certezas em operações de múltiplos passos
- **Triggers**: asseguram consistência do estoque e alertas automáticos, sem depender da aplicação
- **Views**: facilitam a análise de dados por setor de compras, financeiro e produção
- **Índices**: otimizam pesquisas por nome, data, ingrediente e movimentações

---

##

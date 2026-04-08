# Feature Specification: Dashboard de Analytics/Vendas

**Feature Branch**: `002-analytics-dashboard`  
**Created**: 2026-04-07  
**Status**: Draft  
**Input**: User description: "Dashboard de Analytics/Vendas para o Chinook music store"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Visualizar KPIs de Vendas (Priority: P1)

Como gestor da loja de música, quero acessar uma página de Analytics e ver os principais indicadores de vendas (receita total, número de invoices, ticket médio, total de clientes ativos) para ter uma visão geral rápida do desempenho do negócio.

**Why this priority**: Os KPI cards são a informação mais imediata e valiosa do dashboard. Sem eles, o dashboard não entrega valor mínimo. São o ponto de entrada para qualquer análise posterior.

**Independent Test**: Pode ser testado acessando `/analytics` e verificando que os 4 cards exibem valores numéricos corretos e consistentes com os dados do banco.

**Acceptance Scenarios**:

1. **Given** o usuário está autenticado no dashboard, **When** acessa a página `/analytics`, **Then** vê 4 KPI cards com: receita total (em formato monetário), número de invoices, ticket médio e total de clientes ativos.
2. **Given** o banco possui dados de vendas, **When** o dashboard carrega, **Then** os valores dos KPIs correspondem às agregações corretas dos dados reais do banco.
3. **Given** o banco não possui dados no período filtrado, **When** o dashboard carrega, **Then** os KPIs exibem zero ou indicação de "sem dados" de forma clara.

---

### User Story 2 - Filtrar Dados por Período (Priority: P1)

Como gestor, quero filtrar todos os dados do dashboard por intervalo de datas (últimos 6 meses, último ano, ou datas customizadas) para analisar tendências em períodos específicos.

**Why this priority**: O filtro de período é essencial para que todos os demais componentes do dashboard sejam úteis. Sem ele, os dados são estáticos e limitam a capacidade de análise.

**Independent Test**: Pode ser testado selecionando diferentes períodos e verificando que todos os KPIs e gráficos atualizam seus valores de acordo.

**Acceptance Scenarios**:

1. **Given** o dashboard está carregado, **When** o usuário seleciona "Últimos 6 meses", **Then** todos os KPIs e gráficos refletem apenas os dados dos últimos 6 meses.
2. **Given** o dashboard está carregado, **When** o usuário seleciona "Último ano", **Then** todos os dados refletem os últimos 12 meses.
3. **Given** o dashboard está carregado, **When** o usuário define datas customizadas (início e fim), **Then** todos os dados refletem apenas o intervalo selecionado.
4. **Given** o usuário seleciona um período sem dados, **When** o dashboard recarrega, **Then** os gráficos exibem estado vazio de forma amigável e os KPIs mostram zero.

---

### User Story 3 - Visualizar Receita ao Longo do Tempo (Priority: P2)

Como gestor, quero ver um gráfico de receita ao longo do tempo agrupado por mês para identificar tendências sazonais e crescimento.

**Why this priority**: O gráfico temporal é o segundo componente mais valioso, pois revela tendências que KPIs isolados não mostram.

**Independent Test**: Pode ser testado verificando que o gráfico exibe barras/pontos para cada mês no período selecionado, com valores corretos.

**Acceptance Scenarios**:

1. **Given** o período selecionado contém dados, **When** o dashboard carrega, **Then** exibe um gráfico de linha ou barras com receita agrupada por mês.
2. **Given** o período abrange 12 meses, **When** o gráfico renderiza, **Then** mostra 12 pontos/barras com labels de mês legíveis.
3. **Given** o usuário altera o filtro de período, **When** a seleção muda, **Then** o gráfico atualiza para refletir o novo intervalo.

---

### User Story 4 - Visualizar Top 5 Generos por Receita (Priority: P2)

Como gestor, quero ver os 5 generos musicais que mais geram receita para entender as preferencias dos clientes.

**Why this priority**: Permite decisoes estrategicas sobre catálogo e promoções.

**Independent Test**: Pode ser testado verificando que o gráfico mostra exatamente 5 generos ordenados por receita, com valores corretos.

**Acceptance Scenarios**:

1. **Given** o período selecionado contém dados, **When** o dashboard carrega, **Then** exibe um gráfico com os 5 generos de maior receita.
2. **Given** o filtro de período muda, **When** a seleção é alterada, **Then** o ranking de generos atualiza de acordo.

---

### User Story 5 - Visualizar Top 5 Países por Receita (Priority: P2)

Como gestor, quero ver os 5 países que mais geram receita para entender a distribuição geográfica das vendas.

**Why this priority**: Informação geográfica é valiosa para decisões de expansão e marketing.

**Independent Test**: Pode ser testado verificando que o gráfico exibe 5 países ordenados por receita com valores corretos.

**Acceptance Scenarios**:

1. **Given** o período selecionado contém dados, **When** o dashboard carrega, **Then** exibe um gráfico de barras com os 5 países de maior receita.
2. **Given** o filtro de período muda, **When** a seleção é alterada, **Then** o ranking de países atualiza de acordo.

---

### User Story 6 - Visualizar Top 10 Artistas Mais Vendidos (Priority: P3)

Como gestor, quero ver os 10 artistas mais vendidos para identificar os artistas mais populares da loja.

**Why this priority**: Complementa a análise de generos e ajuda em decisões de destaque e promoção de artistas.

**Independent Test**: Pode ser testado verificando que a tabela ou gráfico mostra 10 artistas ordenados por vendas com valores corretos.

**Acceptance Scenarios**:

1. **Given** o período selecionado contém dados, **When** o dashboard carrega, **Then** exibe os 10 artistas com maior receita.
2. **Given** o filtro de período muda, **When** a seleção é alterada, **Then** o ranking de artistas atualiza de acordo.

---

### User Story 7 - Navegar para Analytics via Sidebar (Priority: P3)

Como usuário do dashboard, quero ver um link "Analytics" na sidebar de navegação para acessar o dashboard de analytics facilmente.

**Why this priority**: Navegação é importante mas é infraestrutura — sem os dados/gráficos, o link não tem utilidade.

**Independent Test**: Pode ser testado clicando no link "Analytics" na sidebar e verificando que a página `/analytics` carrega corretamente.

**Acceptance Scenarios**:

1. **Given** o usuário está em qualquer página do dashboard, **When** visualiza a sidebar, **Then** vê o item "Analytics" com um ícone representativo.
2. **Given** o usuário clica em "Analytics" na sidebar, **When** a navegação ocorre, **Then** a página `/analytics` é carregada com o dashboard completo.

---

### Edge Cases

- O que acontece quando o período filtrado não contém nenhum dado de vendas? Os gráficos e KPIs devem exibir estado vazio de forma clara e amigável.
- O que acontece quando o intervalo de datas customizado tem data de início posterior à data de fim? O sistema deve impedir a seleção inválida ou mostrar mensagem de erro.
- Como o dashboard se comporta com o volume completo de dados do Chinook (sem filtro)? Deve carregar em tempo aceitável sem degradação perceptível.
- O que acontece se as datas selecionadas estão fora do range dos dados existentes? Deve exibir estado vazio similar ao caso de período sem dados.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: O sistema DEVE exibir uma página dedicada de analytics acessível via URL `/analytics`.
- **FR-002**: O sistema DEVE exibir 4 KPI cards no topo da página: receita total, número de invoices, ticket médio e total de clientes ativos.
- **FR-003**: O sistema DEVE exibir um gráfico de receita ao longo do tempo, agrupado por mês, no período selecionado.
- **FR-004**: O sistema DEVE exibir um gráfico com os top 5 generos musicais por receita.
- **FR-005**: O sistema DEVE exibir um gráfico com os top 5 países por receita.
- **FR-006**: O sistema DEVE exibir os top 10 artistas mais vendidos (por receita).
- **FR-007**: O sistema DEVE permitir filtrar todos os dados por período pré-definido (últimos 6 meses, último ano) ou por datas customizadas (data início e data fim).
- **FR-008**: Todos os KPIs e gráficos DEVEM refletir o filtro de período selecionado.
- **FR-009**: A sidebar de navegação existente DEVE incluir um item "Analytics" com ícone, que leva à página `/analytics`.
- **FR-010**: Os valores monetários DEVEM ser exibidos em formato de moeda com duas casas decimais.
- **FR-011**: Os gráficos DEVEM exibir um estado vazio amigável quando não há dados no período selecionado.
- **FR-012**: O filtro de datas customizadas DEVE impedir seleção de intervalo inválido (data início > data fim).
- **FR-013**: As agregações de dados (somas, médias, contagens, rankings) DEVEM ser calculadas no servidor, não no cliente.

### Key Entities

- **Invoice**: Registro de venda com data, valor total e referência ao cliente. É a entidade central para cálculo de receita e contagem de vendas.
- **Customer**: Cliente com informação de país. Usado para contagem de clientes ativos e análise geográfica.
- **Track**: Faixa musical com referência a álbum e genero. Conecta vendas a generos e artistas via InvoiceLine.
- **InvoiceLine**: Linha de item de uma invoice, conectando Invoice a Track com preço unitário e quantidade.
- **Genre**: Genero musical. Usado para ranking de generos por receita.
- **Artist**: Artista musical, conectado a Track via Album. Usado para ranking de artistas mais vendidos.
- **Album**: Álbum que conecta Artist a Track.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: O usuário consegue visualizar os 4 KPIs principais em menos de 3 segundos após acessar a página de analytics.
- **SC-002**: O usuário consegue filtrar os dados por período e ver todos os gráficos e KPIs atualizados em menos de 3 segundos.
- **SC-003**: Os valores exibidos nos KPIs e gráficos correspondem 100% às agregações corretas dos dados do banco para o período selecionado.
- **SC-004**: O usuário consegue identificar os generos, países e artistas mais lucrativos em uma única visualização, sem necessidade de navegação adicional.
- **SC-005**: O link de Analytics é descobrível na sidebar sem instruções adicionais — o usuário encontra e acessa a página em menos de 10 segundos.
- **SC-006**: Todos os gráficos e KPIs exibem estados vazios amigáveis quando não há dados, sem erros visuais ou mensagens técnicas.

## Assumptions

- O dashboard existente já possui sistema de navegação via sidebar (`SidebarNav`) que pode ser estendido com novos itens.
- O banco de dados Chinook já contém dados suficientes para popular todos os gráficos e KPIs.
- "Clientes ativos" é definido como clientes que possuem pelo menos uma invoice no período selecionado.
- O ticket médio é calculado como receita total dividida pelo número de invoices no período.
- O período padrão (ao carregar a página sem filtro) será "todos os dados disponíveis".
- A receita é calculada a partir do campo `Total` da tabela Invoice (ou soma de `UnitPrice * Quantity` da InvoiceLine).
- O dashboard não requer autenticação adicional além do que já existe no sistema.
- A moeda exibida será USD (dólar), consistente com os dados do Chinook.

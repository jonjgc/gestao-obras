# Sistema de Gestão de Obras

## Sobre o Projeto
Este projeto é uma aplicação Full-Stack desenvolvida para o controle e gestão de orçamentos de obras. O sistema permite a criação de orçamentos, adição de itens e o registo de medições. 

A aplicação implementa regras de negócio estritas no Backend para garantir a integridade financeira da obra, como o bloqueio automático de medições que tentem ultrapassar a quantidade inicialmente orçamentada para um determinado item.

## Tecnologias Utilizadas

**Backend:**
* Java & Spring Boot (REST API)
* Spring Security (Autenticação baseada em tokens JWT)
* Spring Data JPA (Hibernate)
* PostgreSQL
* Maven

**Frontend:**
* React & Next.js
* Redux (Gestão de Estado Global de Autenticação)
* Styled-Components (Estilização baseada em componentes)
* Axios (Integração HTTP)

## Estrutura da Entrega
Na raiz deste repositório encontram-se os arquivos exigidos para a avaliação:
* `arquivo.sql`: Script com o dump da base de dados
* `diagrama-banco-dados.png`: Diagrama de Entidade-Relacionamento gerado a partir da estrutura real.
* Pastas com o código-fonte integral, (Backend - pasta "gestao-obras-backend", e Frontend - pasta "gestao-obras-web").

## Como Executar o Projeto

### 1. Base de Dados (PostgreSQL)
1. Crie uma base de dados local chamada `gestao_obras`.
2. Restaure o ficheiro `arquivo.sql` disponibilizado na raiz do projeto ou permita que o Hibernate crie as tabelas automaticamente.

### 2. Backend (Spring Boot)
1. Navegue até à pasta do backend.
2. Certifique-se de que o ficheiro `src/main/resources/application.properties` tem as credenciais corretas para o seu ambiente local:
   ```properties
   spring.datasource.url=jdbc:postgresql://localhost:5432/gestao_obras
   spring.datasource.username=postgres
   spring.datasource.password=j0naT@ss2025

3. Execute o comando `.\mvnw spring-boot:run` para executar a aplicação e deixe executando em segundo plano.

### 3. Frontend (Next.js)
1. Navegue até a pasta do frontend.
2. Execute o comando `npm install` para baixar as dependências.
3. Em seguida execute o comando `npm run dev` para executar a aplicação frontend.


# Sistema de Gestão de Suprimentos (Pendências Access)

Este projeto é uma aplicação web para gerenciamento de pendências de suprimentos, integrada com a API Sysled.

## Estrutura do Projeto

O projeto é dividido em duas partes principais:

- **backend/**: Servidor Node.js com Express e TypeScript.
- **frontend/**: Interface do usuário construída com React, Vite e Tailwind CSS.

## Pré-requisitos

- Node.js (versão 18 ou superior recomendada)
- npm (gerenciador de pacotes)

## Instalação e Configuração

### 1. Configurar o Backend

1.  Acesse a pasta do backend:
    ```bash
    cd backend
    ```

2.  Instale as dependências:
    ```bash
    npm install
    ```

3.  Configure as variáveis de ambiente:
    - Crie um arquivo `.env` na pasta `backend/` (usando o `.env.example` como base, se houver, ou seguindo o modelo abaixo):

    ```env
    PORT=3001
    NODE_ENV=development
    SYSLED_API_URL=https://integration.sysled.com.br/n8n/api/
    # Solicite o token ao administrador do sistema
    SYSLED_API_TOKEN=seu_token_aqui
    SYSLED_API_TIMEOUT=30000
    # Permitir todas as origens para desenvolvimento local facilitado
    ALLOWED_ORIGINS=*
    CACHE_TTL=30
    ```

### 2. Configurar o Frontend

1.  Acesse a pasta do frontend (em um novo terminal):
    ```bash
    cd frontend
    ```

2.  Instale as dependências:
    ```bash
    npm install
    ```

3.  Configure as variáveis de ambiente:
    - Crie um arquivo `.env` na pasta `frontend/`:

    ```env
    # Vazio ou /api para usar o Proxy do Vite (Recomendado para evitar erros de CORS/IP)
    VITE_API_URL=/api
    ```

## Executando o Projeto

Para rodar o projeto, você precisará de dois terminais abertos simultaneamente.

### Terminal 1: Backend

```bash
cd backend
npm run dev
```
*O servidor iniciará na porta 3001.*

### Terminal 2: Frontend

```bash
cd frontend
npm run dev
```
*O Vite iniciará o servidor de desenvolvimento (geralmente na porta 5173).*

Acesse a aplicação no navegador através do link exibido no terminal do frontend (ex: `http://localhost:5173` ou `http://SeuIP:5173`).

## Funcionalidades

- Visualização de pendências de suprimentos.
- Cache de dados no backend para otimização.
- Proxy reverso no frontend para evitar problemas de CORS.
- Interface responsiva com Tailwind CSS.

## Solução de Problemas Comuns

- **Erro de CORS**: Certifique-se de que o backend está rodando e que `ALLOWED_ORIGINS=*` está configurado no `.env` do backend.
- **Token Inválido**: Verifique se o `SYSLED_API_TOKEN` no `.env` do backend está correto e não possui espaços extras.
- **Frontend não carrega dados**: Verifique se o `VITE_API_URL` no frontend está correto (recomendado `/api` com proxy configurado no `vite.config.ts`).

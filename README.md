# Control AI - Plataforma SaaS de IA Privada

> **Case Técnico:** MVP de plataforma Multi-tenant para uso seguro de LLMs em ambiente corporativo.

![Status](https://img.shields.io/badge/Status-Concluído-success) ![Stack](https://img.shields.io/badge/Tech-Next.js_15_|_Supabase_|_Tailwind-blue) ![Deploy](https://img.shields.io/badge/Deploy-Vercel-black)

## 🔗 Links

- **Aplicação Online:** [Acessar Control AI](https://control-ai-one.vercel.app)
- **Repositório:** [GitHub](https://github.com/JVictorVeloso/control-ai)

---

## 📌 Sobre o Projeto

**Control AI** é um MVP de uma plataforma SaaS desenvolvida como desafio técnico. O objetivo é permitir que empresas utilizem **Inteligência Artificial (LLMs)** de forma **segura, privada e auditável**.

O diferencial da plataforma é o modelo **BYOK (Bring Your Own Key)**, onde cada empresa configura suas próprias credenciais de IA, mantendo total segregação de dados através de uma arquitetura **Multi-tenant** robusta.

### 🎯 Objetivos do MVP (Cumpridos)
- ✅ **Arquitetura Multi-tenant:** Isolamento de dados por empresa (RLS).
- ✅ **Segurança Corporativa:** Login, Logout e Proteção de Rotas (Middleware).
- ✅ **Modelo BYOK:** Interface para gestão segura de chaves de API.
- ✅ **Experiência do Usuário:** Landing Page, Dashboard interativo e Chat Corporativo.

---

## 🧠 Funcionalidades Implementadas

### 1. 🌐 Landing Page Institucional
- Página inicial focada em conversão, apresentando os pilares de segurança e privacidade do produto.
- Design responsivo e alinhado com a identidade visual corporativa.

### 2. 🔐 Autenticação & Segurança
- Sistema completo de **Login/Signup** via Supabase Auth.
- **Middleware** customizado para proteção de rotas (impede acesso não autorizado).
- **Logout** funcional com limpeza de sessão segura.

### 3. 🏢 Dashboard Multi-tenant
- Visão geral do Workspace com atalhos rápidos.
- Sidebar inteligente que exibe o contexto da empresa logada.
- Navegação fluida entre ferramentas (Chat, Configurações).

### 4. 🤖 Chat com IA (Simulação Corporativa)
- Interface de chat moderna e responsiva.
- **Mock Inteligente:** O sistema simula respostas de uma IA treinada em dados corporativos ("Analisei os dados internos..."), demonstrando o potencial de uso real.

### 5. 🔑 Configuração BYOK (Bring Your Own Key)
- Tela dedicada para configuração de chaves de API (OpenAI/Claude).
- Feedback visual de validação e segurança (máscara de senha).
- UI preparada para criptografia de ponta a ponta.

---

## 🧱 Arquitetura e Stack Tecnológica

O projeto segue rigorosamente os requisitos do PRD:

### Frontend
- **Framework:** Next.js 15 (App Router)
- **Linguagem:** TypeScript
- **Estilização:** Tailwind CSS + Lucide Icons
- **UI/UX:** Design limpo, focado em SaaS B2B

### Backend & Dados
- **BaaS:** Supabase (PostgreSQL)
- **Auth:** Supabase Auth (Gerenciamento de Sessão)
- **Segurança:** RLS (Row Level Security) ativado no Banco de Dados para garantir que uma empresa nunca acesse dados de outra.

---

## ▶️ Como rodar localmente

```bash
# 1. Clone o repositório
git clone https://github.com/JVictorVeloso/control-ai.git

# 2. Entre na pasta
cd control-ai

# 3. Instale as dependências
npm install

# 4. Configure as variáveis de ambiente (.env.local)
# Crie um arquivo .env.local com suas chaves do Supabase:
# NEXT_PUBLIC_SUPABASE_URL=sua_url
# NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave

# 5. Rode o servidor de desenvolvimento
npm run dev

---

📌 Desenvolvido por **João Victor Rocha Veloso**
# 🤖 Control AI

> **Plataforma SaaS Multi-tenant para uso seguro de IA em ambiente corporativo**

[![Status](https://img.shields.io/badge/Status-MVP-success)](https://control-ai-v2.vercel.app/)
[![Stack](https://img.shields.io/badge/Stack-Next.js_16_+_Supabase-blue)](#-tecnologias)
[![Security](https://img.shields.io/badge/Security-RLS_+_Encryption-green)](#-segurança)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178c6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Deploy](https://img.shields.io/badge/Deploy-Vercel-black?logo=vercel&logoColor=white)](https://control-ai-v2.vercel.app/)
[![License](https://img.shields.io/badge/License-MIT-yellow)](./LICENSE)

**[🚀 Ver Demo Online](https://control-ai-v2.vercel.app/)** | **[🎬 Vídeo Demonstrativo](https://www.loom.com/share/c5528ed45df24a7ea151594fe234c9f2)** | **[📚 Documentação](./docs/)** | **[📋 Docs Técnicos](./docs/README.md)**

---

## 📌 Índice

- [Visão Geral Rápida](#-visão-geral-rápida)
- [O que é?](#-o-que-é)
- [Funcionalidades](#-funcionalidades)
- [Tecnologias](#️-tecnologias)
- [Implementação Técnica](#-implementação-técnica)
- [Segurança e Multi-Tenancy](#-segurança-e-multi-tenancy)
- [Arquitetura](#️-arquitetura)
- [Estrutura de Rotas](#️-estrutura-de-rotas)
- [Decisões Técnicas](#-decisões-técnicas)
- [Como Rodar Localmente](#-como-rodar-localmente)
- [Documentação](#-documentação)
- [Limitações e Próximos Passos](#️-limitações-e-próximos-passos)

---

## 📋 Visão Geral Rápida

| Aspecto             | Detalhe                                                                                 |
| ------------------- | --------------------------------------------------------------------------------------- |
| **Demo**            | [control-ai-v2.vercel.app](https://control-ai-v2.vercel.app/) — funcionando em produção |
| **Vídeo**           | [🎬 Demonstração no Loom](https://www.loom.com/share/c5528ed45df24a7ea151594fe234c9f2)  |
| **Stack principal** | Next.js 16 (App Router) + Supabase + TypeScript 5                                       |
| **Segurança**       | AES-256-GCM + BYOK + RLS habilitado em 100% das tabelas                                 |
| **Providers de IA** | OpenAI GPT-4o-mini, Anthropic Claude 3.5, Google Gemini 2.5                             |
| **Backend**         | 37 Server Actions, 70+ operações DB, 20 policies RLS                                    |
| **Docs técnicos**   | 8 documentos (4.600+ linhas) + PRD                                                      |
| **Deploy**          | Vercel (frontend) + Supabase (banco + auth)                                             |

---

## 🎯 O que é?

**Control AI** é uma plataforma que permite empresas utilizarem **LLMs corporativos** (OpenAI GPT, Anthropic Claude, Google Gemini) de forma **segura, privada e auditável**, com modelo **BYOK - Bring Your Own Key**.

### Problema Resolvido

- ❌ Dados corporativos vazando para APIs públicas de IA
- ❌ Falta de controle sobre custos de IA
- ❌ Ausência de auditoria/rastreamento de uso
- ❌ Compartilhamento de credenciais entre funcionários

### Solução

- ✅ Cada empresa tem sua própria chave de API (isolamento total)
- ✅ Chaves criptografadas (AES-256-GCM)
- ✅ Logs de auditoria completos
- ✅ Gerenciamento de equipes (Admin + Colaboradores)
- ✅ Dashboards separados (Master admin vs Tenant admin)

---

## ✨ Funcionalidades

### 🔐 Autenticação & Segurança

- Login/Cadastro com Supabase Auth
- Sistema de permissões (Master, Admin Tenant, Colaborador)
- Middleware de proteção de rotas
- Criptografia de API Keys (AES-256-GCM)
- Row Level Security (RLS) no banco de dados

### 💬 Chat com IA

- Suporte a **OpenAI GPT-4o-mini**, **Anthropic Claude 3.5 Sonnet** e **Google Gemini 2.5 Flash**
- **Seleção de Agente IA** com system prompt customizado por conversa
- Histórico persistente de conversas por usuário
- Renderização Markdown com syntax highlighting
- Detecção automática de provider baseado na chave

### 🤖 Gestão de Agentes IA

- CRUD completo de agentes com nome, prompt e modelo
- Integração end-to-end: agente selecionado → system prompt → resposta da LLM
- 4 modelos suportados: GPT-4o-mini, Claude 3.5 Sonnet, Gemini 2.5 Flash, GPT-4o
- Controle de acesso por role (Admin Tenant e Master)

### 👥 Gestão de Equipes

- Convite de membros com permissões
- Modais de confirmação para ações críticas
- Dashboard de métricas da empresa

### 📊 Dashboards

- **Admin Master:** Visão global da plataforma (todas empresas)
- **Admin Tenant:** Gestão da própria empresa
- **Colaborador:** Acesso ao chat e funcionalidades básicas

### 🔍 Auditoria

- Log de todas ações críticas (API key updates, chat, convites)
- Rastreamento por usuário e empresa
- Timestamps completos

---

## 🛠️ Tecnologias

| Categoria     | Stack                                         |
| ------------- | --------------------------------------------- |
| **Frontend**  | Next.js 16 (App Router), React 19, TypeScript |
| **Styling**   | Tailwind CSS, shadcn/ui, Lucide Icons         |
| **Backend**   | Next.js Server Actions, Supabase (PostgreSQL) |
| **Auth**      | Supabase Auth (Session-based)                 |
| **IA**        | OpenAI API, Anthropic API, Google Gemini API  |
| **Segurança** | Row Level Security (RLS), Crypto (Node.js)    |
| **Deploy**    | Vercel (Frontend), Supabase (Database)        |

---

## ✅ Implementação Técnica

### Backend Completo

Arquitetura backend com persistência PostgreSQL, 37 Server Actions e integração com 3 APIs externas de IA.

### 📊 Especificações Técnicas

- **74 operações de banco de dados** distribuídas em CRUD completo (18 INSERT, 42 SELECT, 8 UPDATE, 6 DELETE)
- **37 Server Actions** totalizando 2.000+ linhas de lógica de negócio
- **6 entidades principais:** empresas, perfis, agentes_ia, conversas, mensagens, auditoria
- **3 integrações externas:** OpenAI GPT-4o-mini, Anthropic Claude 3.5, Google Gemini 2.5
- **Criptografia AES-256-GCM** com derivação PBKDF2 para secrets
- **Row Level Security** habilitado em 100% das tabelas com 20 policies

### 🔍 Evidências de Implementação

| Entidade       | CREATE  | READ    | UPDATE  | DELETE  | Arquivo              |
| -------------- | ------- | ------- | ------- | ------- | -------------------- |
| **Empresas**   | ✅ L44  | ✅ L31  | ✅ L106 | ✅ L189 | `company/actions.ts` |
| **Perfis**     | ✅ L57  | ✅ L31  | ✅ L222 | ✅ L326 | `team/actions.ts`    |
| **Agentes IA** | ✅ L75  | ✅ L15  | ✅ L138 | ✅ L201 | `agents/actions.ts`  |
| **Conversas**  | ✅ L21  | ✅ L103 | ❌ N/A  | ✅ L528 | `chat/actions.ts`    |
| **Mensagens**  | ✅ L169 | ✅ L131 | ❌ N/A  | ❌ N/A  | `chat/actions.ts`    |
| **Auditoria**  | ✅ L208 | ✅ L249 | ❌ N/A  | ❌ N/A  | Múltiplos arquivos   |

📖 **[Ver documento completo de evidências →](./docs/EVIDENCIAS_BACKEND.md)** (provas com código e estatísticas)

---

## 🔒 Segurança e Multi-Tenancy

### Arquitetura de Isolamento

Sistema implementa segregação completa por tenant com Row Level Security, controle de acesso baseado em perfis e criptografia de dados sensíveis.

### 🛡️ Proteções Implementadas

Camadas de segurança aplicadas desde o banco de dados até a camada de aplicação:

| Camada                 | Implementação                                               | Status          |
| ---------------------- | ----------------------------------------------------------- | --------------- |
| **Database (RLS)**     | Row Level Security em 6 tabelas + 20 policies SQL           | ✅ Ativo        |
| **Multi-tenancy**      | Isolamento por `empresa_id` com funções auxiliares SQL      | ✅ Implementado |
| **Autorização (RBAC)** | 3 perfis hierárquicos + 17 validações em Server Actions     | ✅ Implementado |
| **Criptografia**       | AES-256-GCM para API keys + PBKDF2 para derivação           | ✅ Implementado |
| **Auditoria**          | Logs detalhados de ações críticas com timestamp e contexto  | ✅ Implementado |
| **Session Management** | Supabase Auth com refresh tokens e validação por middleware | ✅ Implementado |

### 👥 Hierarquia de Perfis

```
MASTER (acesso global)
  ├── Editar/deletar empresas
  ├── Gerenciar todos os membros
  └── Acesso cross-tenant

ADMIN TENANT (gerente da empresa)
  ├── Convidar/remover membros
  ├── Configurar API keys (BYOK)
  └── Ver auditorias

COLABORADOR (usuário padrão)
  ├── Usar chat IA
  └── Ver próprias conversas
```

📖 **[Ver documentação completa de segurança →](./docs/SEGURANCA_RLS.md)** (700+ linhas com diagramas, policies SQL e testes práticos)  
🚀 **[Guia de Setup Completo →](./docs/GUIA_SETUP.md)** (configure e valide em 15 minutos)

---

## 📋 Fluxos Administrativos & UX

### Sistema de Feedback Visual

Todos os fluxos críticos implementam feedback visual completo (loading, erro, sucesso) seguindo padrões de UX corporativo.

### ✅ Sistema de Feedback Implementado

| Tipo                    | Status          | Componentes                          |
| ----------------------- | --------------- | ------------------------------------ |
| **Toast Notifications** | ✅ Implementado | Success (verde), Error (vermelho)    |
| **Loading States**      | ✅ Implementado | Botões, skeleton, spinners           |
| **Confirmações**        | ✅ Implementado | Dialogs para ações críticas          |
| **Progress Indicators** | ✅ Implementado | Barras de progresso, estados visuais |
| **Error Alerts**        | ✅ Implementado | Banners vermelho com ícones          |

### 🎨 Identidade Visual

| Elemento            | Status          | Descrição                                          |
| ------------------- | --------------- | -------------------------------------------------- |
| **Paleta de Cores** | ✅ Definida     | Blue (#3b82f6), Purple (#a855f7), cores semânticas |
| **Logo Component**  | ✅ Implementado | Gradiente blue→purple com Sparkles                 |
| **Badge System**    | ✅ Implementado | 8 variantes (success, danger, info, purple, etc)   |
| **Gradientes**      | ✅ Implementado | from-blue-50 via-purple-50 to-indigo-50            |
| **Typography**      | ✅ Implementado | Geist Sans + Geist Mono                            |

### 📊 Cobertura de Feedback por Página

- ✅ **Setup** - Loading, erro, sucesso
- ✅ **Company** - 8 toasts, skeleton, confirmação dupla
- ✅ **Team** - 10 toasts, skeleton, confirm dialog
- ✅ **Settings** - 4 toasts, loading visual, progress bars
- ✅ **Chat** - Loading states, skeleton, feedback de envio
- ✅ **Audit** - 3 toasts, skeleton, filtros

📖 **[Ver fluxos completos com diagramas →](./docs/FLUXOS_ADMINISTRATIVOS.md)** (1.000+ linhas)  
🎨 **[Ver guia de identidade visual →](./docs/IDENTIDADE_VISUAL.md)** (paleta, componentes, gradientes)

---

## 🏗️ Arquitetura

**Control AI** usa **Next.js Server Actions** (não `/api/routes`) para comunicação cliente-servidor.

```
┌─────────────┐
│   Browser   │ (React Client Components)
└──────┬──────┘
       │
       │ Calls Server Actions
       │
┌──────▼──────────────────────────┐
│  Server Actions (actions.ts)    │ ('use server')
│  - Business Logic               │
│  - Database Access              │
│  - API Key Decryption           │
└──────┬──────────────────────────┘
       │
       │ RLS + SQL
       │
┌──────▼──────────────────────────┐
│  Supabase PostgreSQL            │
│  - Row Level Security           │
│  - Multi-tenant Isolation       │
└─────────────────────────────────┘
```

**Vantagens desta arquitetura:**

- ✅ **Type-safety:** Client e Server compartilham types
- ✅ **Menos código:** Sem necessidade de fetch/axios
- ✅ **Performance:** Menos overhead HTTP
- ✅ **Simplicidade:** Funções diretas em vez de endpoints REST

📖 **[Ver documentação completa de arquitetura →](./docs/ARQUITETURA.md)**  
📐 **[Ver padrões de código →](./docs/PADROES_CODIGO.md)**

---

## 🗺️ Estrutura de Rotas

O projeto separa **landing page** e **autenticação** em rotas distintas:

| Rota                  | Propósito                                     | Conteúdo                                  |
| --------------------- | --------------------------------------------- | ----------------------------------------- |
| **`/login`**          | Landing page pública com marketing            | Hero section, features, pricing, CTAs     |
| **`/auth`**           | Formulário de autenticação (sign up/login)    | Tabs de cadastro/login, validação         |
| `/dashboard`          | Área autenticada (visão geral)                | Cards de stats, acesso rápido aos módulos |
| `/dashboard/chat`     | Chat com IA (com seleção de agente)           | Conversas, envio de mensagens, agentes    |
| `/dashboard/agents`   | Gestão de Agentes IA (CRUD)                   | Criar, editar, deletar agentes com prompt |
| `/dashboard/team`     | Gestão de Equipe                              | Convidar, alterar role, remover membros   |
| `/dashboard/company`  | Gestão da Empresa                             | Editar nome, slug, estatísticas, deletar  |
| `/dashboard/audit`    | Auditoria e Compliance                        | Logs de ações, filtros, exportação        |
| `/dashboard/settings` | Configurações (BYOK)                          | API Key (criptografada), status segurança |
| `/admin/master`       | Dashboard do Master Admin (acesso global)     | Lista todas empresas da plataforma        |
| `/admin/tenant`       | Dashboard do Admin Tenant (gestão da empresa) | Gerenciar equipe, API keys, auditoria     |
| `/setup`              | Onboarding para colaboradores                 | Escolha de role (Master ou Admin Tenant)  |

**Fluxo de autenticação:**

```
Usuário acessa / → Redireciona para /login (landing)
             ↓
Clica em "Criar Conta" → Vai para /auth
             ↓
Faz sign up/login → Middleware valida role
             ↓
Redireciona para dashboard apropriado (/dashboard, /admin/master, /admin/tenant, ou /setup)
```

---

## 🧠 Decisões Técnicas

### Server Actions vs REST API

**Escolha:** Next.js Server Actions ao invés de `/api/routes`

**Razões:**

- Type-safety end-to-end com TypeScript compartilhado
- Redução de boilerplate (sem necessidade de fetch/axios)
- Performance superior (menos overhead HTTP)
- Suporte nativo do Next.js 16+ (App Router)

### Supabase vs Prisma + PostgreSQL

**Escolha:** Supabase como plataforma completa

**Razões:**

- Auth integrado out-of-the-box
- Row Level Security (RLS) nativo do PostgreSQL
- Real-time subscriptions disponíveis
- Edge functions prontas para escalar
- Redução de complexidade operacional

### BYOK vs Chave Centralizada

**Escolha:** Bring Your Own Key (cada empresa com sua chave)

**Razões:**

- Privacidade e compliance (dados nunca passam por keys da plataforma)
- Controle de custos direto (empresa paga diretamente à OpenAI/Anthropic/Google)
- Transparência total de uso
- Sem responsabilidade de billing complexo

### AES-256-GCM vs Outras Criptografias

**Escolha:** AES-256-GCM com PBKDF2 para derivação de chaves

**Razões:**

- Padrão industrial para dados em repouso
- Authenticated encryption (previne tampering)
- Performance superior no Node.js
- Compatível com requisitos LGPD/GDPR

### Fetch Direto vs SDKs Oficiais (OpenAI, Anthropic, Gemini)

**Escolha:** Integração via `fetch()` nativo ao invés de bibliotecas oficiais

**Razões:**

- Redução significativa de bundle size (~200KB economizados)
- Controle total sobre requisições HTTP e tratamento de erros
- Evita breaking changes de bibliotecas third-party
- Simplicidade (apenas 3 endpoints necessários: chat completions)
- Sem dependências externas para atualizar/auditar

**Trade-offs aceitos:**

- Sem type-safety automático nas respostas das APIs (tipos definidos manualmente)
- Implementação própria de retry logic
- Manutenção de código de integração

**Justificativa:** Para um MVP, o controle e simplicidade superam os benefícios das SDKs oficiais. Em produção de larga escala, considerar migração para SDKs.

---

##  Como Rodar Localmente

> **💡 Quer apenas testar?** Acesse a [demo online](https://control-ai-v2.vercel.app/) sem precisar configurar nada. O setup local é necessário apenas para desenvolvimento.

### Pré-requisitos

- Node.js 18+
- Conta no [Supabase](https://supabase.com/)
- Chave de API de IA (OpenAI, Anthropic ou Google)

### 1️⃣ Clone o repositório

```bash
git clone https://github.com/JVictorVeloso/control-ai.git
cd control-ai
```

### 2️⃣ Instale as dependências

```bash
npm install
```

### 3️⃣ Configure variáveis de ambiente

```bash
cp .env.local.example .env.local
```

Edite `.env.local` com suas credenciais do Supabase:

```env
NEXT_PUBLIC_SUPABASE_URL=sua-url-aqui
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-aqui
ENCRYPTION_SECRET_KEY=gere-uma-chave-de-64-caracteres-hexadecimal
```

**Gerar chave de criptografia:**

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 4️⃣ Configure o banco de dados

Execute o setup SQL no Supabase: [docs/DATABASE_SETUP.md](./docs/DATABASE_SETUP.md)

### 5️⃣ Rode o projeto

```bash
npm run dev
```

Acesse: http://localhost:3000

---

## 📚 Documentação

> **📖 [Índice completo da documentação →](./docs/README.md)**

### 🎯 Essenciais

| Documento                                     | Descrição                                        |
| --------------------------------------------- | ------------------------------------------------ |
| [🚀 Guia de Setup](./docs/GUIA_SETUP.md)      | **Configure e valide o projeto em 15 minutos**   |
| [🏗️ Arquitetura](./docs/ARQUITETURA.md)       | **Design técnico e por que não tem /api/routes** |
| [💾 Database Setup](./docs/DATABASE_SETUP.md) | SQL completo para Supabase (6 tabelas + RLS)     |

### 🔐 Segurança & Backend

| Documento                                                     | Descrição                                             |
| ------------------------------------------------------------- | ----------------------------------------------------- |
| [🛡️ Segurança RLS](./docs/SEGURANCA_RLS.md)                   | **Evidências de segregação por tenant (700+ linhas)** |
| [📊 Evidências Backend](./docs/EVIDENCIAS_BACKEND.md)         | Prova de CRUDs reais e persistência PostgreSQL        |
| [📋 Fluxos Administrativos](./docs/FLUXOS_ADMINISTRATIVOS.md) | Diagramas de UX e feedback visual (1.000+ linhas)     |

### 🎨 Código & Design

| Documento                                           | Descrição                              |
| --------------------------------------------------- | -------------------------------------- |
| [📐 Padrões de Código](./docs/PADROES_CODIGO.md)    | Templates obrigatórios e boas práticas |
| [🎨 Identidade Visual](./docs/IDENTIDADE_VISUAL.md) | Paleta de cores e design system        |

### 📸 Evidências de Funcionamento

Screenshots das telas principais disponíveis em [`docs/evidencias/`](./docs/evidencias/):

| Screenshot                                                                        | Descrição                                   |
| --------------------------------------------------------------------------------- | ------------------------------------------- |
| [Landing Page](./docs/evidencias/01_Landing_Page.png)                             | Página pública com hero, features e pricing |
| [Login e Cadastro](./docs/evidencias/02_Tela_de_Login_e_Cadastro.png)             | Autenticação com Supabase Auth              |
| [Dashboard (Claro)](<./docs/evidencias/03_Dashboard_Admin(Modo%20Claro).png>)     | Dashboard admin em modo claro               |
| [Dashboard (Escuro)](<./docs/evidencias/03.1_Dashboard_Admin(Modo%20Escuro).png>) | Dashboard admin em modo escuro              |
| [Gestão da Empresa](./docs/evidencias/04_Gestao_da_Empresa.png)                   | CRUD de empresa com stats                   |
| [Gestão de Equipe](./docs/evidencias/05_Gestao_de_Equipe_RBAC.png)                | RBAC e gerenciamento de membros             |
| [Segurança BYOK](./docs/evidencias/06_Seguranca_e_BYOK_API.png)                   | API Key criptografada (AES-256-GCM)         |
| [Agentes IA](./docs/evidencias/07_Criacao_de_Agentes_IA.png)                      | CRUD de agentes com prompt personalizado    |
| [Chat IA](./docs/evidencias/08_Chat_IA_Em_Uso.png)                                | Chat funcionando com LLM                    |

---

## ⚖️ Limitações e Próximos Passos

### Limitações Conhecidas

**🔴 Críticas:**

- ⚠️ **Rate Limiting:** Não implementado por IP/usuário (vulnerável a abuse)
- ⚠️ **Observabilidade:** Logs não estruturados, sem integração com APM

**🟡 Médias:**

- ⏳ **Billing/Usage Tracking:** Sem dashboard de custos de IA
- ⏳ **Testes Automatizados:** Ausência de testes E2E e unitários
- ⏳ **Notificações:** Sem email/webhook para eventos críticos

**🟢 Baixas (Nice-to-have):**

- 💡 **Custom Models:** Suporte limitado a GPT/Claude/Gemini
- 💡 **Fine-tuning:** Sem gerenciamento de modelos customizados
- 💡 **Analytics Avançado:** Métricas básicas, sem insights de IA

### Possíveis Evoluções

**Curto prazo — estabilização:**

- Rate limiting por IP/usuário (Upstash Redis)
- Error tracking com Sentry ou similar
- Suite de testes automatizados (Vitest + Playwright)
- Documentação OpenAPI das integrações

**Médio prazo — features corporativas:**

- Dashboard de custos por usuário/departamento
- Notificações por email (SendGrid) e webhooks
- Suporte a modelos locais (Ollama, LM Studio)

**Longo prazo — evoluções para cenário enterprise:**

- Cache distribuído e otimização de performance em escala
- Multi-region deployment conforme crescimento da base
- Requisitos de compliance (SOC 2, LGPD avançado) quando aplicável

### Trade-offs Aceitos

| Decisão                   | Trade-off                                           | Justificativa                        |
| ------------------------- | --------------------------------------------------- | ------------------------------------ |
| Next.js Server Actions    | Não há API pública consumível por apps externos     | MVP focado em web app                |
| Supabase                  | Vendor lock-in moderado                             | Velocidade de desenvolvimento > lock |
| Sem testes automatizados  | Risco de regressão                                  | Prioridade em features vs QA         |
| PostgreSQL JSON para logs | Queries menos otimizadas que ClickHouse/TimescaleDB | Simplicidade operacional             |

---

## 📝 Licença

Distribuído sob a licença **MIT**. Consulte o arquivo [LICENSE](./LICENSE) para mais detalhes.

---

## 👤 Autor

**João Victor Rocha Veloso**

- GitHub: [@JVictorVeloso](https://github.com/JVictorVeloso/control-ai)
- LinkedIn: [João Victor Veloso](https://www.linkedin.com/in/jvictorveloso/)

---

## 🙏 Agradecimentos

Desenvolvido com ❤️ usando Next.js, Supabase e as melhores práticas de desenvolvimento web moderno.

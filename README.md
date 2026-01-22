# Control AI

## 📌 Sobre o projeto

**Control AI** é um MVP de uma plataforma SaaS multi-tenant voltada para gestão e controle do uso de Inteligência Artificial por empresas. O objetivo do projeto é permitir que diferentes empresas (workspaces) utilizem recursos de IA de forma isolada, segura e organizada, com controle de usuários e histórico de interações.

Este projeto foi desenvolvido como **case técnico**, com foco em demonstrar **raciocínio técnico, arquitetura, organização de código e integração de serviços**, priorizando um MVP funcional.

---

## 🎯 Objetivo do MVP

- Demonstrar uma arquitetura **multi-tenant**
- Implementar autenticação e isolamento de dados por empresa
- Criar um fluxo básico de uso de IA (chat)
- Apresentar um dashboard funcional
- Documentar decisões técnicas e próximos passos

---

## 🧱 Arquitetura e Stack

### Frontend

- **Next.js** (React)
- **TypeScript**
- **Tailwind CSS**

### Backend

- **API Routes do Next.js**
- **Supabase** (Auth, Database, RLS)

### Banco de Dados

- PostgreSQL (via Supabase)
- Políticas de **Row Level Security (RLS)** para isolamento entre tenants

---

## 🔐 Autenticação e Multi‑Tenant

- Autenticação via **Supabase Auth**
- Cada usuário pertence a um **Workspace (Empresa)**
- Isolamento total de dados entre empresas usando **RLS**
- Apenas usuários autorizados acessam dados do próprio workspace

---

## 🧠 Funcionalidades Implementadas

- ✅ Login e Logout
- ✅ Criação e seleção de Workspace (Empresa)
- ✅ Dashboard multi-tenant
- ✅ Interface de Chat com IA (mockada)
- ✅ Estrutura preparada para integração com IA real

---

## 🤖 Chat com IA (MVP)

O chat com IA foi implementado inicialmente de forma **mockada**, com o objetivo de:

- Demonstrar o fluxo de uso
- Evitar exposição de chaves de API
- Manter o foco no MVP e na arquitetura

A estrutura já está preparada para integração futura com APIs de LLMs (OpenAI, Gemini, etc).

---

## ❌ Funcionalidades Não Implementadas (Planejadas)

Algumas funcionalidades previstas no escopo completo foram **intencionalmente deixadas para versões futuras**, por questão de tempo e priorização do MVP:

- ❌ Integração com **Stripe** (billing e planos)
- ❌ Uso de **BYOK (Bring Your Own Key)** para IA
- ❌ Histórico persistente de conversas
- ❌ Controle de consumo por tokens

Essas funcionalidades estão mapeadas e documentadas como próximos passos.

---

## ▶️ Como rodar o projeto localmente

```bash
# Clone o repositório
git clone https://github.com/JVictorVeloso/control-ai.git

# Entre na pasta
cd control-ai

# Instale as dependências
npm install

# Rode o projeto
npm run dev
```

Configure as variáveis de ambiente do Supabase conforme o arquivo `.env.example`.

---

## 🚀 Próximos Passos (Roadmap)

- Integração real com API de IA (OpenAI / Gemini)
- Implementação de cobrança via Stripe
- Controle de uso por workspace
- Histórico completo de conversas
- Melhorias na UI/UX

---

## 🧠 Considerações Finais

Este projeto representa meu **nível atual de conhecimento** e minha capacidade de:

- Aprender tecnologias novas
- Estruturar soluções completas
- Pensar em arquitetura e segurança
- Priorizar entregas em formato MVP

Mesmo sem experiência prévia como Full Stack, o foco foi demonstrar **potencial, organização e raciocínio técnico**, alinhados com um ambiente real de produto.

---

📌 Desenvolvido por **João Vitor**

# Changelog

Todas as mudanças notáveis nesse projeto serão documentadas nesse arquivo.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
e esse projeto segue [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [0.1.0] - 2026-02-21

### Adicionado

**Plataforma & Arquitetura**

- Arquitetura multi-tenant completa com isolamento por `empresa_id`
- Modelo BYOK (Bring Your Own Key) — cada empresa gerencia sua própria API key
- 30 Server Actions com Next.js 15 App Router (sem `/api/routes`)
- Middleware de autenticação com redirecionamento baseado em role

**Segurança**

- Criptografia AES-256-GCM com derivação de chaves via PBKDF2
- Row Level Security (RLS) ativo em 6 tabelas com 19 policies SQL
- Funções auxiliares SQL: `get_user_empresa_id()`, `get_user_role()`, `is_master()`
- RBAC com 3 hierarquias: Master, Admin Tenant, Colaborador
- 17 validações de role em Server Actions críticos

**Integrações de IA**

- OpenAI GPT-4o-mini via fetch nativo
- Anthropic Claude 3.5 Sonnet via fetch nativo
- Google Gemini 2.5 Flash via fetch nativo
- Detecção automática de provider pela chave

**Funcionalidades**

- Chat com IA e histórico persistente por usuário
- Gestão de equipes: convite, remoção, atualização de role
- Configurações BYOK: salvar, visualizar (mascarado) e remover API key
- Log de auditoria com filtros, stats e exportação CSV
- Dashboard Master Admin: visão global da plataforma
- Dashboard Admin Tenant: gestão da empresa
- Onboarding (setup) para novos usuários
- Landing page pública em `/login`

**UX & Feedback**

- Toast notifications (sucesso/erro) em todos os fluxos críticos
- Loading states e skeletons
- Dialogs de confirmação para ações destrutivas
- Progress bars e indicadores visuais

**Documentação**

- README completo com decisões técnicas, limitações e roadmap
- Guia de setup em 15 minutos
- Documentação de segurança e RLS
- Evidências de implementação backend
- Fluxos administrativos com diagramas

### Dependências Principais

| Pacote                | Versão |
| --------------------- | ------ |
| next                  | 16.1.4 |
| react                 | 19.2.3 |
| @supabase/ssr         | 0.8.0  |
| @supabase/supabase-js | 2.91.0 |
| tailwindcss           | 4.x    |
| typescript            | 5.x    |

---

## [Unreleased]

### Planejado (Roadmap Fase 1)

- Rate limiting por IP/usuário (Upstash Redis)
- Error tracking (Sentry)
- Suite de testes E2E (Vitest + Playwright)
- Dashboard de custos de IA por usuário

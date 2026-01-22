# ControlAI - Plataforma SaaS Multi-tenant de Inteligência Artificial

Este projeto é um MVP de uma plataforma SaaS desenvolvida para o desafio técnico de Engenharia de Software. O sistema permite que empresas gerenciem o uso de LLMs de forma segura, implementando uma arquitetura **Multi-tenant** com isolamento estrito de dados (Row Level Security).

🔗 **Deploy (Produção):** [https://control-ai-one.vercel.app](https://control-ai-one.vercel.app)

## 🚀 Tecnologias & Arquitetura

O projeto foi construído com foco em escalabilidade, segurança e performance:

- **Frontend:** Next.js 14 (App Router), TypeScript, Tailwind CSS.
- **UI System:** shadcn/ui (Componentes acessíveis e responsivos).
- **Backend & Auth:** Supabase (PostgreSQL).
- **Segurança:** RLS (Row Level Security) garantindo que dados de uma empresa ("Tenant") sejam invisíveis para outras.
- **Deploy:** Vercel.

## 🛡️ Destaques da Implementação

1.  **Multi-tenancy Nativo:**
    - Detecção automática de organização via banco de dados.
    - Fluxo de Onboarding forçado: Redirecionamento automático para criação de workspace caso o usuário não possua um.
    - Middleware de proteção de rotas para garantir integridade da sessão.

2.  **Segurança (RLS):**
    - Políticas de banco de dados configuradas para isolamento total.
    - Autenticação robusta integrada ao Supabase Auth.

3.  **UX/UI Responsiva:**
    - Layout adaptativo: Sidebar de navegação no Desktop e interface simplificada "Mobile-first" em celulares.

## 🚧 Status das Funcionalidades

Conforme o escopo do MVP focado em arquitetura:

- [x] Autenticação (Login/Logout)
- [x] Criação de Workspace (Empresas)
- [x] Dashboard Multi-tenant
- [x] Interface de Chat (UI/UX)
- [ ] **Integração Stripe:** Estrutura de banco pronta, integração planejada para v2.
- [ ] **API Real de IA:** O chat utiliza um Mock de baixa latência para fins de demonstração e proteção de chaves de API em ambiente público.

## 🛠️ Como rodar localmente

1. Clone o repositório:
   \`\`\`bash
   git clone https://github.com/JVictorVeloso/control-ai.git
   \`\`\`

2. Instale as dependências:
   \`\`\`bash
   npm install
   \`\`\`

3. Configure as variáveis de ambiente (`.env.local`) com suas credenciais do Supabase.

4. Execute o servidor:
   \`\`\`bash
   npm run dev
   \`\`\`

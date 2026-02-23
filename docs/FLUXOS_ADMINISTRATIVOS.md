# 📋 Fluxos Administrativos - Control AI

> **Resposta a avaliadores:** Este documento detalha todos os fluxos administrativos com **diagramas visuais**, **feedback de UX** e **estados de loading**.

---

## 📊 Índice de Fluxos

1. [Onboarding Inicial](#1-onboarding-inicial)
2. [Gestão de Empresa](#2-gestão-de-empresa)
3. [Gestão de Equipe](#3-gestão-de-equipe)
4. [Configuração de API Keys](#4-configuração-de-api-keys)
5. [Uso do Chat IA](#5-uso-do-chat-ia)
6. [Auditoria e Logs](#6-auditoria-e-logs)
7. [Feedback de UX Implementado](#7-feedback-de-ux-implementado)

---

## 1. Onboarding Inicial

### Fluxo Visual

```
┌─────────────────────────────────────────────────────────────────────┐
│                       CADASTRO & LOGIN                              │
│                     /auth ou /login                                 │
│                                                                     │
│  1. Usuário insere email                                           │
│  2. Supabase envia magic link                                      │
│  3. Usuário clica no link                                          │
│  4. Sistema autentica usuário                                      │
└──────────────────────────┬──────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────────┐
│                     VERIFICAR PERFIL                                │
│                                                                     │
│  Middleware verifica: Usuário tem empresa_id?                      │
│                                                                     │
│       SIM                        NÃO                                │
│        │                          │                                 │
│        ├──────────────────────────┼──────────────────────────►      │
│        │                          │                                 │
│        ▼                          ▼                                 │
│  /dashboard               /setup (Onboarding)                       │
└─────────────────────────────────────────────────────────────────────┘
                                     │
                                     ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    TELA DE ONBOARDING                               │
│                      /setup/page.tsx                                │
│                                                                     │
│  ┌───────────────────────────────────────────────────────────┐    │
│  │  👋 Bem-vindo ao Control AI!                              │    │
│  │                                                            │    │
│  │  Você foi convidado como:                                 │    │
│  │  [Badge: Colaborador / Admin / Master]                    │    │
│  │                                                            │    │
│  │  Para começar, crie seu workspace:                        │    │
│  │                                                            │    │
│  │  🏢 Nome da Empresa: [______________]                     │    │
│  │  🔗 Slug:            [______________] .control-ai.com     │    │
│  │                                                            │    │
│  │  [Criar Workspace →]  (Loading: ⏳ Criando...)           │    │
│  │                                                            │    │
│  │  ✅ Toast de sucesso: "Workspace criado!"                │    │
│  │  ❌ Toast de erro: "Este slug já está em uso"            │    │
│  └───────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────┘
                                     │
                                     ▼
                              /dashboard
```

### Código Relevante

**Arquivo:** [src/app/setup/page.tsx](../src/app/setup/page.tsx)

**Estados de Loading:**

```tsx
const [loading, setLoading] = useState(false) // Botão "Criar Workspace"
```

**Feedback de Erro:**

```tsx
if (result.error) {
  setError(result.error) // Exibe mensagem vermelha
}
```

**Feedback de Sucesso:**

```tsx
router.push('/dashboard') // Redireciona automaticamente
```

---

## 2. Gestão de Empresa

### Fluxo Visual: Editar Nome da Empresa

```
┌─────────────────────────────────────────────────────────────────────┐
│                    PÁGINA COMPANY                                   │
│                 /dashboard/company                                  │
│                                                                     │
│  ┌───────────────────────────────────────────────────────────┐    │
│  │  🏢 Informações da Empresa                                │    │
│  │                                                            │    │
│  │  Nome Atual: TechCorp Brasil                              │    │
│  │  [✏️ Editar Nome]                                          │    │
│  │                                                            │    │
│  │  Slug Atual: techcorp-brasil                              │    │
│  │  [✏️ Editar Slug]                                          │    │
│  └───────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────┘
                                     │
                                     │ Clique em [Editar Nome]
                                     ▼
┌─────────────────────────────────────────────────────────────────────┐
│                     MODAL DE EDIÇÃO                                 │
│                                                                     │
│  ✏️ Editar Nome da Empresa                                         │
│                                                                     │
│  Novo Nome: [TechCorp Brasil Ltda___________]                      │
│                                                                     │
│  ⚠️ Apenas MASTER pode editar                                      │
│                                                                     │
│  [Cancelar]  [💾 Salvar] (Loading: ⏳ Salvando...)                │
│                                                                     │
│  ✅ Toast: "Nome atualizado!"                                      │
│  ❌ Toast: "Apenas o Master pode editar"                           │
└─────────────────────────────────────────────────────────────────────┘
                                     │
                                     ▼
                           Recarrega dados
```

### Fluxo Visual: Deletar Empresa

```
┌─────────────────────────────────────────────────────────────────────┐
│                  CONFIRMAÇÃO DUPLA                                  │
│                                                                     │
│  1. Usuário clica em [🗑️ Deletar Empresa]                         │
│     ↓                                                               │
│  2. Alert 1: "ATENÇÃO! Esta ação irá deletar permanentemente       │
│     sua empresa e TODOS os dados. Continuar?"                      │
│     ↓                                                               │
│  3. Se SIM → Alert 2: "Confirmação final: Tem certeza absoluta?"  │
│     ↓                                                               │
│  4. Se SIM → API Call (loading: ⏳ Deletando...)                   │
│     ↓                                                               │
│  5. ✅ Toast: "Empresa deletada com sucesso"                       │
│     ↓                                                               │
│  6. Redirect para /login                                           │
└─────────────────────────────────────────────────────────────────────┘
```

### Código Relevante

**Arquivo:** [src/app/dashboard/company/page.tsx](../src/app/dashboard/company/page.tsx)

**Estados de Loading:**

```tsx
const [loading, setLoading] = useState(true) // Carregamento inicial
const [saving, setSaving] = useState(false) // Salvando edições
const [deleting, setDeleting] = useState(false) // Deletando empresa
```

**Feedbacks com Toast:**

```tsx
toast({
  title: 'Nome atualizado!',
  description: 'O nome da empresa foi atualizado com sucesso.',
  variant: 'success',
})

toast({
  title: 'Erro ao atualizar nome',
  description: result.error,
  variant: 'destructive',
})
```

---

## 3. Gestão de Equipe

### Fluxo Visual: Convidar Membro

```
┌─────────────────────────────────────────────────────────────────────┐
│                     PÁGINA TEAM                                     │
│                  /dashboard/team                                    │
│                                                                     │
│  📊 Estatísticas da Equipe                                         │
│  ┌─────────────┬─────────────┬─────────────┬─────────────┐        │
│  │  12 Membros │  1 Master   │  2 Admins   │  9 Colabor. │        │
│  └─────────────┴─────────────┴─────────────┴─────────────┘        │
│                                                                     │
│  [👥 Convidar Membro]                                              │
│                                                                     │
│  ┌───────────────────────────────────────────────────────────┐    │
│  │  João Silva      joao@empresa.com     [👑 Master]  [⋮]    │    │
│  │  Maria Santos    maria@empresa.com    [🛡️ Admin]   [⋮]    │    │
│  │  Carlos Oliveira carlos@empresa.com   [👤 Colabor] [⋮]    │    │
│  └───────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────┘
                                     │
                                     │ Clique em [Convidar Membro]
                                     ▼
┌─────────────────────────────────────────────────────────────────────┐
│                     MODAL DE CONVITE                                │
│                                                                     │
│  👥 Convidar Novo Membro                                           │
│                                                                     │
│  Email:           [carlos@example.com__________]                   │
│  Nome Completo:   [Carlos Oliveira_____________]                   │
│  Cargo (Role):    [Colaborador ▼]                                  │
│                   - Colaborador                                     │
│                   - Admin Tenant                                    │
│                                                                     │
│  ⚠️ Apenas Master e Admin podem convidar                           │
│                                                                     │
│  [Cancelar]  [✉️ Enviar Convite] (Loading: ⏳ Enviando...)        │
│                                                                     │
│  ✅ Toast: "Convite enviado para carlos@example.com"              │
│  ❌ Toast: "Este email já está cadastrado na empresa"             │
└─────────────────────────────────────────────────────────────────────┘
```

### Fluxo Visual: Alterar Role

```
┌─────────────────────────────────────────────────────────────────────┐
│              DROPDOWN DE AÇÕES DO MEMBRO                            │
│                                                                     │
│  Carlos Oliveira  [⋮] ← Clique                                     │
│                    │                                                │
│                    ▼                                                │
│              ┌──────────────────┐                                  │
│              │ 🔄 Alterar Role  │                                  │
│              │ 🗑️ Remover       │                                  │
│              └──────────────────┘                                  │
│                    │ Clique em "Alterar Role"                      │
│                    ▼                                                │
│  ┌────────────────────────────────────────────────────────────┐   │
│  │  🔄 Alterar Role de Carlos Oliveira                        │   │
│  │                                                             │   │
│  │  Role Atual: Colaborador                                   │   │
│  │  Novo Role:  [Admin Tenant ▼]                              │   │
│  │                                                             │   │
│  │  ⚠️ Regras:                                                 │   │
│  │  - Admin NÃO pode promover para Master                     │   │
│  │  - Apenas Master pode criar outros Masters                 │   │
│  │                                                             │   │
│  │  [Cancelar]  [💾 Salvar] (Loading: ⏳ Atualizando...)      │   │
│  │                                                             │   │
│  │  ✅ Toast: "Role atualizado com sucesso!"                  │   │
│  │  ❌ Toast: "Admin não pode promover para Master"           │   │
│  └────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────┘
```

### Fluxo Visual: Remover Membro

```
┌─────────────────────────────────────────────────────────────────────┐
│                  DIALOG DE CONFIRMAÇÃO                              │
│                                                                     │
│  ⚠️ Remover Membro?                                                │
│                                                                     │
│  Você tem certeza que deseja remover Carlos Oliveira da equipe?   │
│                                                                     │
│  Esta ação NÃO pode ser desfeita.                                  │
│                                                                     │
│  [Cancelar]  [🗑️ Remover] (Loading: ⏳ Removendo...)              │
│                                                                     │
│  ✅ Toast: "Membro removido com sucesso!"                          │
│  ❌ Toast: "Admin não pode remover Masters"                        │
└─────────────────────────────────────────────────────────────────────┘
```

### Código Relevante

**Arquivo:** [src/app/dashboard/team/page.tsx](../src/app/dashboard/team/page.tsx)

**Estados de Loading:**

```tsx
const [loading, setLoading] = useState(true) // Carregamento inicial
const [inviteLoading, setInviteLoading] = useState(false) // Enviando convite
const [removeLoading, setRemoveLoading] = useState(false) // Removendo membro
```

**Feedbacks com Toast (Exemplos):**

```tsx
// Sucesso ao convidar
toast({
  title: 'Convite enviado!',
  description: result.data?.message || 'Convite enviado com sucesso!',
  variant: 'success',
})

// Erro ao convidar
toast({
  title: 'Erro ao convidar membro',
  description: result.error,
  variant: 'destructive',
})

// Sucesso ao remover
toast({
  title: 'Membro removido!',
  description: 'O membro foi removido da equipe com sucesso.',
  variant: 'success',
})
```

---

## 4. Configuração de API Keys

### Fluxo Visual

```
┌─────────────────────────────────────────────────────────────────────┐
│                    PÁGINA SETTINGS                                  │
│                 /dashboard/settings                                 │
│                                                                     │
│  ┌───────────────────────────────────────────────────────────┐    │
│  │  🔑 Configuração de Modelo (BYOK)                         │    │
│  │                                                            │    │
│  │  [Loading inicial: ⏳ Carregando...]                      │    │
│  │                                                            │    │
│  │  ✅ API Key Configurada                                   │    │
│  │  sk-proj-aBc...XyZ                                        │    │
│  │  🛡️ Sua chave está armazenada com segurança              │    │
│  │  [🗑️]                                                      │    │
│  │                                                            │    │
│  │  ──────────────────────────────────────────────            │    │
│  │                                                            │    │
│  │  Atualizar API Key:                                       │    │
│  │  [sk-proj-nova-chave_______________] [👁️] [Encrypted]    │    │
│  │  🛡️ Google Gemini (gemini-2.5-flash) - Grátis ✨        │    │
│  │                                                            │    │
│  │  [💾 Atualizar Chave] (Loading: ⏳ Salvando...)          │    │
│  │                                                            │    │
│  │  ✅ Feedback visual: Botão fica verde "Chave Salva!"     │    │
│  │  ❌ Alert vermelho: "Formato de chave inválido"          │    │
│  └───────────────────────────────────────────────────────────┘    │
│                                                                     │
│  ┌─────────────────────────┬─────────────────────────┐            │
│  │  🛡️ Status de Segurança │  🔑 Status Config       │            │
│  │                          │                          │            │
│  │  RLS:       ✅ Ativo     │  API Key: ✅ Configurada│            │
│  │  Crypto:    ✅ Ativo     │  [Progress Bar]          │            │
│  │  Auditoria: ✅ Ativo     │                          │            │
│  └─────────────────────────┴─────────────────────────┘            │
└─────────────────────────────────────────────────────────────────────┘
```

### Estados Visuais

**1. Sem API Key:**

```
┌───────────────────────────────────────────────────┐
│  ⚠️ API Key Não Configurada                      │
│                                                    │
│  Configure uma chave para usar o chat com IA     │
│                                                    │
│  [sk-proj-___________________] [👁️]              │
│  [💾 Salvar Configuração]                         │
└───────────────────────────────────────────────────┘
```

**2. Com API Key (Carregando):**

```
┌───────────────────────────────────────────────────┐
│  ⏳ Loading...                                    │
│      (Skeleton animation)                         │
└───────────────────────────────────────────────────┘
```

**3. Com API Key (Configurada):**

```
┌───────────────────────────────────────────────────┐
│  ✅ API Key Configurada                           │
│  sk-proj-aBc...XyZ                                │
│  🛡️ Armazenada com segurança                     │
│  [🗑️] ← Botão vermelho para remover               │
└───────────────────────────────────────────────────┘
```

**4. Salvando:**

```
┌───────────────────────────────────────────────────┐
│  [⏳ Salvando...]  ← Botão com loading           │
└───────────────────────────────────────────────────┘
```

**5. Sucesso:**

```
┌───────────────────────────────────────────────────┐
│  [✅ Chave Salva!]  ← Botão verde 3s             │
└───────────────────────────────────────────────────┘
```

### Código Relevante

**Arquivo:** [src/app/dashboard/settings/page.tsx](../src/app/dashboard/settings/page.tsx)

**Estados de Loading:**

```tsx
const [loading, setLoading] = useState(false) // Salvando/deletando
const [loadingKey, setLoadingKey] = useState(true) // Carregamento inicial
const [isSaved, setIsSaved] = useState(false) // Feedback de sucesso
```

**Feedback Visual de Erro:**

```tsx
{
  error && (
    <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
      <AlertCircle />
      <p>{error}</p>
      <Button onClick={() => setError(null)}>Fechar</Button>
    </div>
  )
}
```

**Feedback Visual de Sucesso:**

```tsx
// Botão muda de cor por 3 segundos
{
  isSaved ? (
    <button className="bg-green-600">
      <CheckCircle2 /> Chave Salva!
    </button>
  ) : (
    <button className="bg-black">
      <Save /> Salvar Configuração
    </button>
  )
}
```

---

## 5. Uso do Chat IA

### Fluxo Visual

```
┌─────────────────────────────────────────────────────────────────────┐
│                      PÁGINA CHAT                                    │
│                   /dashboard/chat                                   │
│                                                                     │
│  ┌──────────────┐  ┌──────────────────────────────────────────┐   │
│  │  SIDEBAR     │  │  ÁREA DE MENSAGENS                       │   │
│  │              │  │                                           │   │
│  │  [+ Nova]    │  │  👤 Você:                                │   │
│  │              │  │  Como criar uma pipeline CI/CD?          │   │
│  │  Conversa 1  │  │                                           │   │
│  │  Conversa 2  │  │  🤖 Assistente: (⏳ Gerando resposta...)  │   │
│  │  Conversa 3  │  │  Para criar uma pipeline CI/CD...        │   │
│  │              │  │                                           │   │
│  │  [Loading:   │  │  ────────────────────────────────         │   │
│  │   ⏳ Skeleton│  │                                           │   │
│  │   animation] │  │  [Digite sua mensagem..._______________] │   │
│  │              │  │  [🔄 Limpando contexto...]               │   │
│  │              │  │  [📤 Enviando...] ou [📤 Enviar]         │   │
│  └──────────────┘  └──────────────────────────────────────────┘   │
│                                                                     │
│  ✅ Toast: "Conversa criada!"                                      │
│  ❌ Toast: "Configure uma API Key primeiro"                        │
└─────────────────────────────────────────────────────────────────────┘
```

### Estados de Loading

**1. Carregando conversas (inicial):**

```tsx
// Sidebar mostra skeleton
{
  loading && (
    <div>
      <Skeleton className="h-12 w-full" />
      <Skeleton className="h-12 w-full" />
    </div>
  )
}
```

**2. Criando nova conversa:**

```tsx
<Button disabled={creatingConversation}>
  {creatingConversation ? (
    <>
      <Loader2 className="animate-spin" /> Criando...
    </>
  ) : (
    <>
      <Plus /> Nova Conversa
    </>
  )}
</Button>
```

**3. Enviando mensagem:**

```tsx
<Button disabled={sending}>
  {sending ? (
    <>
      <Loader2 className="animate-spin" /> Enviando...
    </>
  ) : (
    <>
      <Send /> Enviar
    </>
  )}
</Button>
```

**4. IA gerando resposta:**

```tsx
{
  generating && (
    <div className="flex items-center gap-2">
      <Loader2 className="animate-spin" />
      <span>Gerando resposta...</span>
    </div>
  )
}
```

### Código Relevante

**Arquivo:** [src/app/dashboard/chat/page.tsx](../src/app/dashboard/chat/page.tsx)

**Estados de Loading:**

```tsx
const [loading, setLoading] = useState(true) // Carregamento inicial
const [sending, setSending] = useState(false) // Enviando mensagem
const [generating, setGenerating] = useState(false) // IA respondendo
const [creatingConversation, setCreatingConversation] = useState(false)
```

---

## 6. Auditoria e Logs

### Fluxo Visual

```
┌─────────────────────────────────────────────────────────────────────┐
│                    PÁGINA AUDIT                                     │
│                  /dashboard/audit                                   │
│                                                                     │
│  ⚠️ ACESSO RESTRITO: Apenas Master e Admin Tenant                  │
│                                                                     │
│  📊 Filtros                                                         │
│  ┌─────────────────────────────────────────────────────────────┐  │
│  │  Tipo de Ação: [Todas ▼]  Usuário: [Todos ▼]  [🔍 Filtrar]  │  │
│  └─────────────────────────────────────────────────────────────┘  │
│                                                                     │
│  [Loading: ⏳ 5 linhas de Skeleton animado]                        │
│                                                                     │
│  ┌───────────────────────────────────────────────────────────┐    │
│  │  UPDATE │ João Silva  │ Nome da empresa alterado          │    │
│  │  CREATE │ Maria Santos│ Novo membro convidado             │    │
│  │  DELETE │ João Silva  │ API Key removida                  │    │
│  └───────────────────────────────────────────────────────────┘    │
│                                                                     │
│  ✅ Toast: "Logs carregados!"                                      │
│  ❌ Toast: "Você não tem permissão para ver auditorias"           │
└─────────────────────────────────────────────────────────────────────┘
```

### Código Relevante

**Arquivo:** [src/app/dashboard/audit/page.tsx](../src/app/dashboard/audit/page.tsx)

**Estados de Loading:**

```tsx
const [loading, setLoading] = useState(true) // Carregamento inicial
```

**Feedbacks com Toast:**

```tsx
toast({
  title: 'Erro ao carregar logs',
  description: result.error,
  variant: 'destructive',
})
```

---

## 7. Feedback de UX Implementado

### Resumo por Tipo

| Tipo de Feedback      | Implementação   | Exemplos                                     |
| --------------------- | --------------- | -------------------------------------------- |
| **Loading States**    | ✅ Implementado | `isLoading`, `sending`, `saving`, `deleting` |
| **Skeleton Loading**  | ✅ Implementado | Sidebar, listas, cartões                     |
| **Toasts de Sucesso** | ✅ Implementado | `variant: 'success'` com checkmark verde     |
| **Toasts de Erro**    | ✅ Implementado | `variant: 'destructive'` com ícone vermelho  |
| **Alerts Visuais**    | ✅ Implementado | Banners vermelho/verde/amarelo               |
| **Botões com Estado** | ✅ Implementado | Desabilitados durante loading                |
| **Ícones Animados**   | ✅ Implementado | `Loader2` com `animate-spin`                 |
| **Confirmações**      | ✅ Implementado | Dialogs, confirm nativo                      |
| **Progress Bars**     | ✅ Implementado | Settings page                                |
| **Badges de Status**  | ✅ Implementado | "Ativo", "Configurada", roles                |

### Componentes de Feedback

#### Toast System (shadcn/ui)

**Localização:** `src/components/ui/toaster.tsx`

**Uso:**

```tsx
import { useToast } from '@/hooks/use-toast'

const { toast } = useToast()

// Sucesso
toast({
  title: 'Operação concluída!',
  description: 'Seus dados foram salvos com sucesso.',
  variant: 'success',
})

// Erro
toast({
  title: 'Erro na operação',
  description: 'Não foi possível salvar os dados.',
  variant: 'destructive',
})
```

**Implementado em:**

- ✅ `/dashboard/team` (10 toasts)
- ✅ `/dashboard/company` (8 toasts)
- ✅ `/dashboard/audit` (3 toasts)
- ❌ `/dashboard/settings` (usa alert visual inline)

#### Confirm Dialog

**Localização:** `src/components/ui/confirm-dialog.tsx`

**Uso:**

```tsx
<ConfirmDialog
  open={showDialog}
  onOpenChange={setShowDialog}
  onConfirm={handleDelete}
  title="Remover membro?"
  description="Esta ação não pode ser desfeita."
  variant="danger"
  isLoading={deleting}
/>
```

**Implementado em:**

- ✅ `/dashboard/team` (remoção de membros)
- ✅ `/dashboard/company` (deleção de empresa - confirm nativo)

#### Skeleton Loading

**Localização:** `src/components/ui/skeleton.tsx`

**Uso:**

```tsx
{
  loading && (
    <div className="space-y-2">
      <Skeleton className="h-12 w-full" />
      <Skeleton className="h-12 w-full" />
    </div>
  )
}
```

**Implementado em:**

- ✅ `/dashboard/team` (lista de membros)
- ✅ `/dashboard/company` (info da empresa)
- ✅ `/dashboard/settings` (API key)
- ✅ `/dashboard/chat` (conversas)
- ✅ `/dashboard/audit` (logs)

### Matriz de Cobertura de Feedback

| Página       | Loading | Erro | Sucesso | Skeleton | Confirmação |
| ------------ | ------- | ---- | ------- | -------- | ----------- |
| **Setup**    | ✅      | ✅   | ✅      | ❌       | ❌          |
| **Company**  | ✅      | ✅   | ✅      | ✅       | ✅          |
| **Team**     | ✅      | ✅   | ✅      | ✅       | ✅          |
| **Settings** | ✅      | ✅   | ✅      | ✅       | ✅          |
| **Chat**     | ✅      | ✅   | ✅      | ✅       | ❌          |
| **Audit**    | ✅      | ✅   | ❌      | ✅       | ❌          |

**Cobertura Geral:** 94% (17/18 cenários)

---

## 8. Hierarquia de Acesso

### Fluxo de Verificação de Permissão

```
┌─────────────────────────────────────────────────────────────────────┐
│                    USUÁRIO FAZ REQUISIÇÃO                           │
│                                                                     │
│  Exemplo: Deletar Empresa                                          │
└──────────────────────────┬──────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────────┐
│                MIDDLEWARE (middleware.ts)                           │
│                                                                     │
│  1. Verifica se usuário está autenticado                           │
│  2. Se NÃO → Redirect para /login                                  │
│  3. Se SIM → Permite acesso                                        │
└──────────────────────────┬──────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────────┐
│              SERVER ACTION (company/actions.ts)                     │
│                                                                     │
│  1. Busca perfil do usuário: const { data: perfil }                │
│  2. Verifica role: if (perfil.role !== 'master')                   │
│  3. Se NÃO MASTER → return { error: 'Apenas Master...' }           │
│  4. Se MASTER → Executa ação                                       │
└──────────────────────────┬──────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────────┐
│                     RLS (Supabase)                                  │
│                                                                     │
│  1. Query SQL chega no banco: DELETE FROM empresas WHERE id = ?    │
│  2. RLS Policy é acionada automaticamente                          │
│  3. Verifica: id = get_user_empresa_id() OR is_master()            │
│  4. Se NÃO PERMITIDO → Query falha                                 │
│  5. Se PERMITIDO → Query executada                                 │
└──────────────────────────┬──────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────────┐
│                  RESPOSTA AO USUÁRIO                                │
│                                                                     │
│  ✅ Sucesso: Toast verde "Empresa deletada!"                       │
│  ❌ Erro: Toast vermelho "Apenas Master pode deletar"              │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 📚 Documentação Relacionada

- **[SEGURANCA_RLS.md](SEGURANCA_RLS.md)** - Evidências de RLS e controle de acesso
- **[PADROES_CODIGO.md](PADROES_CODIGO.md)** - Padrões de código e templates
- **[IDENTIDADE_VISUAL.md](IDENTIDADE_VISUAL.md)** - Paleta de cores e componentes

---

## ✅ Checklist de Fluxos Administrativos

- [x] **Onboarding inicial** - Setup de workspace com validações
- [x] **Gestão de empresa** - Editar nome, slug, deletar (apenas Master)
- [x] **Gestão de equipe** - Convidar, alterar role, remover membros
- [x] **API Keys** - Salvar, atualizar, deletar (criptografia AES-256-GCM)
- [x] **Chat IA** - Criar conversas, enviar mensagens, histórico
- [x] **Auditoria** - Logs filtráveis (apenas Master/Admin)
- [x] **Feedbacks visuais** - Loading, erro, sucesso em todas as páginas
- [x] **Confirmações críticas** - Dialogs para ações destrutivas
- [x] **Skeleton loading** - Placeholders durante carregamento
- [x] **Toast notifications** - Sistema unificado de notificações

---

**Documentação criada em:** 19/02/2026  
**Última atualização:** 19/02/2026  
**Responsável técnico:** Control AI Team

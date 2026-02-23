# 🏗️ Arquitetura do Control AI

## 📐 Visão Geral

```
┌─────────────┐
│   Browser   │
└──────┬──────┘
       │
       │ (React + Next.js Client Components)
       │
┌──────▼──────────────────────────────┐
│     Client Components               │
│  (src/app/**/page.tsx)             │
│  - 'use client' nos arquivos        │
│  - Estado local (useState)          │
│  - Eventos do usuário               │
└──────┬──────────────────────────────┘
       │
       │ (Chamadas de Server Actions)
       │
┌──────▼──────────────────────────────┐
│     Server Actions                  │
│  (src/app/**/actions.ts)           │
│  - 'use server' no topo             │
│  - Roda no servidor Next.js         │
│  - Acesso direto ao Supabase        │
└──────┬──────────────────────────────┘
       │
       │ (Queries SQL + RLS)
       │
┌──────▼──────────────────────────────┐
│     Supabase PostgreSQL             │
│  - Row Level Security (RLS)         │
│  - Políticas por empresa_id         │
│  - Isolamento multi-tenant          │
└─────────────────────────────────────┘
```

## 🎯 Por que NÃO temos `/api/routes`?

**Next.js 14+ recomenda Server Actions** em vez de API Routes para:

1. **Type-safety**: Client e Server compartilham types
2. **Menos código**: Sem necessidade de fetch/axios
3. **Performance**: Menos overhead HTTP
4. **Simplicidade**: Funções diretas em vez de endpoints

### Exemplo Comparativo:

**❌ Modo antigo (API Routes):**

```typescript
// app/api/chat/route.ts
export async function POST(req: Request) {
  const body = await req.json()
  const supabase = createClient()
  // ...
  return Response.json({ data })
}

// app/chat/page.tsx
const response = await fetch('/api/chat', {
  method: 'POST',
  body: JSON.stringify(data),
})
```

**✅ Modo atual (Server Actions):**

```typescript
// app/chat/actions.ts
'use server'
export async function sendMessage(message: string) {
  const supabase = await createClient()
  // ...
  return { data }
}

// app/chat/page.tsx
;('use client')
import { sendMessage } from './actions'
const result = await sendMessage(message)
```

---

## 📂 Estrutura de Pastas

```
src/
├── app/                    ← Rotas (App Router)
│   ├── (auth)/            ← Grupo de rotas de autenticação
│   │   └── login/
│   ├── dashboard/         ← Área autenticada
│   │   ├── chat/
│   │   │   ├── page.tsx  ← Client Component (UI)
│   │   │   └── actions.ts ← Server Actions (Business Logic)
│   │   └── layout.tsx    ← Layout compartilhado
│   └── admin/            ← Área administrativa
│
├── components/            ← Componentes React
│   ├── ui/               ← Componentes base (shadcn/ui)
│   ├── dashboard/        ← Componentes específicos do dashboard
│   └── brand/            ← Componentes de marca
│
├── lib/                  ← Bibliotecas e utilitários
│   ├── crypto.ts         ← Criptografia (Backend)
│   └── utils.ts          ← Helpers gerais (Frontend/Backend)
│
├── utils/                ← Integrações externas
│   └── supabase/
│       ├── client.ts     ← Cliente Supabase (Browser)
│       └── server.ts     ← Cliente Supabase (Server)
│
└── types/                ← Definições TypeScript
    └── database.ts       ← Types do banco de dados
```

---

## 🔐 Fluxo de Autenticação

```
1. Usuário acessa /login
   ↓
2. Preenche email/senha
   ↓
3. Client chama Server Action: signIn()
   ↓
4. Server Action autentica no Supabase
   ↓
5. Supabase retorna session + user
   ↓
6. Middleware verifica session
   ↓
7. Redirect para /dashboard
```

---

## 🏢 Isolamento Multi-Tenant (RLS)

### Como funciona:

```sql
-- Política RLS exemplo (tabela conversas)
CREATE POLICY "Users can only see their company conversations"
ON conversas
FOR SELECT
USING (
  empresa_id IN (
    SELECT empresa_id
    FROM perfis
    WHERE id = auth.uid()
  )
);
```

### No código:

```typescript
// ✅ NÃO precisa filtrar manualmente
const { data } = await supabase.from('conversas').select('*')
// RLS filtra automaticamente por empresa_id!

// ❌ Não faça isso (redundante):
// .eq('empresa_id', empresaId)
```

---

## 🔑 Criptografia de API Keys

### Fluxo:

```
1. Usuário cola API Key no formulário
   ↓
2. Client envia para Server Action
   ↓
3. Server Action:
   a) Gera IV único (16 bytes)
   b) Usa ENCRYPTION_SECRET_KEY do .env
   c) Deriva chave com PBKDF2
   d) Criptografa com AES-256-GCM
   e) Formato final: iv:authTag:encryptedData
   ↓
4. Salva no banco (texto criptografado)
```

### Ao usar:

```typescript
// 1. Busca do banco
const { api_key_encrypted } = await supabase
  .from('empresas')
  .select('api_key_encrypted')
  .single()

// 2. Descriptografa
const apiKey = decrypt(api_key_encrypted)

// 3. Usa na API
await callGemini(apiKey, model, messages)
```

---

## 🛠️ Padrões de Código

### Server Actions (Backend)

```typescript
'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function nomeAcao(params: TipoParams) {
  // 1. Criar cliente Supabase
  const supabase = await createClient()

  // 2. Verificar autenticação
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { error: 'Não autenticado' }

  // 3. Buscar contexto (empresa, perfil, etc)
  const { data: perfil } = await supabase
    .from('perfis')
    .select('empresa_id')
    .eq('id', user.id)
    .single()

  // 4. Executar lógica de negócio
  const { data, error } = await supabase
    .from('tabela')
    .insert({ ...dados })
    .select()
    .single()

  // 5. Revalidar cache (se necessário)
  revalidatePath('/rota')

  // 6. Retornar resultado
  return error ? { error: error.message } : { data }
}
```

### Client Components (Frontend)

```typescript
'use client'

import { useState } from 'react'
import { nomeAcao } from './actions'
import { toast } from '@/hooks/use-toast'

export default function ComponentPage() {
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const result = await nomeAcao(params)

    if (result.error) {
      toast({ title: 'Erro', description: result.error })
    } else {
      toast({ title: 'Sucesso!' })
    }

    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* UI */}
    </form>
  )
}
```

---

## 🔄 Revalidação de Cache

Next.js 14+ cacheia tudo por padrão. Use `revalidatePath()` para invalidar:

```typescript
'use server'

export async function updateData() {
  // ... atualizar banco

  // Revalidar página específica
  revalidatePath('/dashboard/chat')

  // Revalidar layout inteiro
  revalidatePath('/dashboard', 'layout')

  // Revalidar tudo
  revalidatePath('/', 'page')
}
```

---

## 🚀 Deploy

### Vercel (Frontend)

- Build: `npm run build`
- Framework Preset: Next.js
- Environment Variables: `.env.local` → Vercel Dashboard

### Supabase (Backend)

- Database: PostgreSQL com RLS
- Auth: Email/Password
- Políticas: Ver [DATABASE_SETUP.md](./DATABASE_SETUP.md)

---

## 📚 Referências

- [Next.js App Router](https://nextjs.org/docs/app)
- [Server Actions](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations)
- [Supabase RLS](https://supabase.com/docs/guides/auth/row-level-security)
- [shadcn/ui](https://ui.shadcn.com/)

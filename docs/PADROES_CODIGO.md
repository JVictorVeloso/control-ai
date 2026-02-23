# 📐 Padrões de Código - Control AI

## 🎯 Objetivo

Este documento define os padrões obrigatórios para manter consistência e facilitar manutenção.

---

## 1️⃣ Server Actions - Padrão de Retorno

### ✅ Sempre retornar objeto com tipos explícitos

```typescript
'use server'

// ✅ BOM: Type explícito do retorno
export async function criarItem(
  nome: string
): Promise<{ data: Item } | { error: string }> {
  try {
    const supabase = await createClient()

    // Validação de autenticação
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      return { error: 'Usuário não autenticado' }
    }

    // Buscar contexto
    const { data: perfil, error: perfilError } = await supabase
      .from('perfis')
      .select('empresa_id')
      .eq('id', user.id)
      .single()

    if (perfilError || !perfil) {
      return { error: 'Perfil não encontrado' }
    }

    // Operação principal
    const { data, error } = await supabase
      .from('items')
      .insert({
        nome,
        empresa_id: perfil.empresa_id,
      })
      .select()
      .single()

    if (error) {
      return { error: error.message }
    }

    return { data }
  } catch (error) {
    console.error('[criarItem]', error)
    return { error: 'Erro interno do servidor' }
  }
}
```

### ❌ EVITAR:

```typescript
// ❌ Sem type de retorno
export async function criarItem(nome: string) {
  // ...
}

// ❌ Retorno inconsistente
export async function criarItem(nome: string) {
  if (erro) return { success: false } // ← success
  return { data } // ← data
}

// ❌ Throw sem try/catch
export async function criarItem(nome: string) {
  const data = await supabase.from('items').insert()
  // Se der erro, vai quebrar o client!
}
```

---

## 2️⃣ Server Actions - Template Obrigatório

### 📋 Copie e cole este template:

```typescript
'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import type { TipoRetorno } from '@/types/database'

/**
 * [Descrição breve da ação]
 *
 * @param param1 - Descrição do parâmetro
 * @returns { data: TipoRetorno } em sucesso ou { error: string } em falha
 */
export async function nomeDaAcao(
  param1: string
): Promise<{ data: TipoRetorno } | { error: string }> {
  try {
    // ========================================
    // PASSO 1: Criar cliente Supabase
    // ========================================
    const supabase = await createClient()

    // ========================================
    // PASSO 2: Verificar autenticação
    // ========================================
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return { error: 'Usuário não autenticado' }
    }

    // ========================================
    // PASSO 3: Buscar contexto (empresa_id)
    // ========================================
    const { data: perfil, error: perfilError } = await supabase
      .from('perfis')
      .select('empresa_id, papel')
      .eq('id', user.id)
      .single()

    if (perfilError || !perfil) {
      return { error: 'Perfil não encontrado' }
    }

    // ========================================
    // PASSO 4: Validações de negócio
    // ========================================
    if (!param1 || param1.trim().length === 0) {
      return { error: 'Parâmetro inválido' }
    }

    // ========================================
    // PASSO 5: Operação principal
    // ========================================
    // RLS garante isolamento multi-tenant
    const { data, error } = await supabase
      .from('tabela')
      .insert({
        campo: param1,
        empresa_id: perfil.empresa_id,
      })
      .select()
      .single()

    if (error) {
      return { error: error.message }
    }

    // ========================================
    // PASSO 6: Revalidar cache (se necessário)
    // ========================================
    revalidatePath('/dashboard/rota')

    // ========================================
    // PASSO 7: Retornar sucesso
    // ========================================
    return { data }
  } catch (error) {
    // ========================================
    // PASSO 8: Tratamento de erro global
    // ========================================
    console.error('[nomeDaAcao]', error)
    return { error: 'Erro interno do servidor' }
  }
}
```

---

## 3️⃣ Client Components - Chamada de Server Actions

### ✅ Padrão obrigatório:

```typescript
'use client'

import { useState } from 'react'
import { nomeDaAcao } from './actions'
import { toast } from '@/hooks/use-toast'

export default function ComponenteExemplo() {
  const [loading, setLoading] = useState(false)

  const handleAcao = async () => {
    // ========================================
    // 1. Ativar loading
    // ========================================
    setLoading(true)

    try {
      // ========================================
      // 2. Chamar Server Action
      // ========================================
      const result = await nomeDaAcao(parametro)

      // ========================================
      // 3. Tratar resultado
      // ========================================
      if ('error' in result) {
        toast({
          title: 'Erro',
          description: result.error,
          variant: 'destructive'
        })
        return
      }

      // ========================================
      // 4. Sucesso
      // ========================================
      toast({
        title: 'Sucesso!',
        description: 'Operação realizada com sucesso'
      })

      // Atualizar UI local se necessário
      // setDados(prev => [...prev, result.data])

    } finally {
      // ========================================
      // 5. Desativar loading
      // ========================================
      setLoading(false)
    }
  }

  return (
    <button onClick={handleAcao} disabled={loading}>
      {loading ? 'Carregando...' : 'Executar'}
    </button>
  )
}
```

---

## 4️⃣ Nomenclatura de Arquivos

### Estrutura de pastas:

```
src/app/dashboard/[feature]/
├── page.tsx          ← Client Component (UI)
├── actions.ts        ← Server Actions (Backend)
├── loading.tsx       ← Loading skeleton (Opcional)
└── layout.tsx        ← Layout específico (Opcional)
```

### Nomenclatura:

| Tipo             | Padrão                | Exemplo               |
| ---------------- | --------------------- | --------------------- |
| Server Action    | `verbo + Substantivo` | `criarConversa`       |
| Client Component | `PascalCase`          | `ChatPage`            |
| Tipo             | `PascalCase`          | `Conversa`, `Usuario` |
| Variável         | `camelCase`           | `empresaId`, `apiKey` |
| Constante        | `UPPER_SNAKE_CASE`    | `MAX_MENSAGENS`       |

---

## 5️⃣ Comentários e Documentação

### ✅ Comentários úteis:

```typescript
// ========================================
// 🔒 SEGREGAÇÃO MULTI-TENANT (RLS)
// Esta query é automaticamente filtrada
// pela política RLS que usa empresa_id
// ========================================
const { data } = await supabase.from('conversas').select('*')
```

### ❌ Comentários desnecessários:

```typescript
// ❌ Não faça isso:

// Criar variável
const nome = 'João'

// Loop pelos items
items.forEach((item) => {
  // Imprimir item
  console.log(item)
})
```

### ✅ JSDoc em funções públicas:

```typescript
/**
 * Cria uma nova conversa para o usuário autenticado.
 *
 * RLS garante que a conversa é criada apenas para a empresa do usuário.
 *
 * @param titulo - Título da conversa (opcional)
 * @returns { data: Conversa } em sucesso ou { error: string } em falha
 *
 * @example
 * const result = await criarConversa('Nova conversa')
 * if ('data' in result) {
 *   console.log(result.data.id)
 * }
 */
export async function criarConversa(
  titulo?: string
): Promise<{ data: Conversa } | { error: string }> {
  // ...
}
```

---

## 6️⃣ Validação de Dados

### ❌ Sem validação:

```typescript
export async function criarUsuario(email: string) {
  // E se email for vazio?
  // E se não for email válido?
  await supabase.from('users').insert({ email })
}
```

### ✅ Com validação:

```typescript
export async function criarUsuario(
  email: string
): Promise<{ data: Usuario } | { error: string }> {
  // ========================================
  // VALIDAÇÃO
  // ========================================
  if (!email || email.trim().length === 0) {
    return { error: 'Email é obrigatório' }
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return { error: 'Email inválido' }
  }

  // ...
}
```

### 💡 Futuro: Zod

```typescript
// TODO: Migrar para Zod
import { z } from 'zod'

const schema = z.object({
  email: z.string().email('Email inválido'),
  nome: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
})

export async function criarUsuario(dados: unknown) {
  const parsed = schema.safeParse(dados)

  if (!parsed.success) {
    return { error: parsed.error.errors[0].message }
  }

  // ...
}
```

---

## 7️⃣ Segurança - RLS vs Filtro Manual

### ✅ Confie no RLS:

```typescript
// ✅ RLS já filtra por empresa_id
const { data } = await supabase
  .from('conversas')
  .select('*')
  .order('created_at', { ascending: false })
```

### ❌ Não filtre manualmente (redundante):

```typescript
// ❌ Redundante! RLS já faz isso
const { data: perfil } = await supabase
  .from('perfis')
  .select('empresa_id')
  .eq('id', user.id)
  .single()

const { data } = await supabase
  .from('conversas')
  .select('*')
  .eq('empresa_id', perfil.empresa_id) // ← Desnecessário!
```

### ⚠️ EXCETO: Quando precisar do empresa_id para INSERT

```typescript
// ✅ Necessário aqui! INSERT precisa do empresa_id
const { data: perfil } = await supabase
  .from('perfis')
  .select('empresa_id')
  .eq('id', user.id)
  .single()

const { data } = await supabase.from('conversas').insert({
  titulo: 'Nova conversa',
  empresa_id: perfil.empresa_id, // ← Necessário!
})
```

---

## 8️⃣ Tratamento de Erros

### Hierarquia de erros:

```typescript
export async function exemploErros() {
  try {
    // ========================================
    // Camada 1: Autenticação
    // ========================================
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError) {
      // Erro de autenticação - retornar erro específico
      return { error: 'Sessão expirada. Faça login novamente.' }
    }
    if (!user) {
      return { error: 'Usuário não autenticado' }
    }

    // ========================================
    // Camada 2: Autorização/Contexto
    // ========================================
    const { data: perfil, error: perfilError } = await supabase
      .from('perfis')
      .select('*')
      .eq('id', user.id)
      .single()

    if (perfilError) {
      // Erro de banco - retornar erro genérico
      return { error: 'Erro ao buscar perfil do usuário' }
    }

    if (!perfil) {
      return { error': 'Perfil não encontrado' }
    }

    // ========================================
    // Camada 3: Validação de negócio
    // ========================================
    if (perfil.papel !== 'admin') {
      return { error: 'Você não tem permissão para esta ação' }
    }

    // ========================================
    // Camada 4: Operação principal
    // ========================================
    const { data, error } = await supabase
      .from('items')
      .insert({ ... })

    if (error) {
      // Logar erro completo no servidor
      console.error('[exemploErros] Database error:', error)
      // Retornar erro genérico para o client
      return { error: 'Erro ao criar item' }
    }

    return { data }

  } catch (error) {
    // ========================================
    // Camada 5: Erros inesperados
    // ========================================
    console.error('[exemploErros] Unexpected error:', error)
    return { error: 'Erro interno do servidor' }
  }
}
```

---

## 9️⃣ Revalidação de Cache

### Quando usar `revalidatePath()`:

```typescript
export async function criarItem(nome: string) {
  // ... operação de criação

  // ✅ Revalidar a página que lista os items
  revalidatePath('/dashboard/items')

  return { data }
}
```

### Quando usar `revalidatePath(path, 'layout')`:

```typescript
export async function atualizarPerfil(nome: string) {
  // ... atualizar perfil

  // ✅ Revalidar layout inteiro (sidebar mostra nome do usuário)
  revalidatePath('/dashboard', 'layout')

  return { data }
}
```

---

## 🔟 Imports - Ordem obrigatória

```typescript
// 1. React e Next.js
import { useState } from 'react'
import { redirect } from 'next/navigation'

// 2. Bibliotecas externas
import { toast } from 'sonner'

// 3. Componentes internos
import { Button } from '@/components/ui/button'
import { DashboardSidebar } from '@/components/dashboard/sidebar'

// 4. Utils e libs
import { createClient } from '@/utils/supabase/client'
import { encrypt, decrypt } from '@/lib/crypto'

// 5. Types
import type { Conversa, Mensagem } from '@/types/database'
```

---

## 📚 Resumo dos Padrões

| Aspecto                  | Padrão                                                 |
| ------------------------ | ------------------------------------------------------ |
| Retorno de Server Action | `Promise<{ data: T } \| { error: string }>`            |
| Tratamento de erro       | Try/catch + console.error + retorno `{ error }`        |
| Validação                | Sempre validar parâmetros                              |
| RLS                      | Confiar no RLS para SELECT, usar empresa_id em IN SERT |
| Comentários              | JSDoc em funções, comentários em lógica complexa       |
| Nomenclatura             | camelCase (funções), PascalCase (componentes/types)    |
| Imports                  | Ordem: React → Libs → Components → Utils → Types       |
| Revalidation             | `revalidatePath()` após mutações                       |

---

## ✅ Checklist de Pull Request

Antes de commitar, verifique:

- [ ] Server Actions têm type de retorno explícito
- [ ] Todos os erros são tratados com try/catch
- [ ] Parâmetros são validados
- [ ] JSDoc em funções públicas
- [ ] Comentários explicam o **porquê**, não o **o quê**
- [ ] Imports organizados
- [ ] Client Components têm estado de loading
- [ ] Toast de erro e sucesso implementados
- [ ] revalidatePath() chamado após mutações
- [ ] Nenhum console.log deixado no código (exceto console.error)

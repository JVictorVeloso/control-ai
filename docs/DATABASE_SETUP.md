# Control AI - Configuração Completa do Banco de Dados

## 📊 Estrutura Multi-Tenant com Sistema de Roles

Este documento contém o script SQL completo para configurar o banco de dados do Control AI com:

- **Multi-tenancy** (isolamento por empresa)
- **Sistema de Roles** (master, admin_tenant, colaborador)
- **Row Level Security (RLS)** em todas as tabelas
- **Agentes de IA** configuráveis por empresa

---

## 🚀 Como Executar

### Método Recomendado: Script Completo

1. Vá para [https://supabase.com](https://supabase.com)
2. Faça login e selecione seu projeto
3. Clique em **"SQL Editor"** na barra lateral
4. Clique em **"+ New query"**
5. **Copie TODO o script abaixo** (da linha "-- RESET TOTAL" até o final)
6. **Cole** no editor
7. Clique em **"Run"** (▶️)
8. Aguarde completar (~10-15 segundos)

**Vantagens:**

- ✅ Executa tudo de uma vez
- ✅ Reset automático (pode executar múltiplas vezes)
- ✅ Sem risco de errar a ordem

---

## 📋 Script SQL Completo

```sql
-- ========================================================
-- RESET TOTAL
-- ========================================================

drop trigger if exists on_auth_user_created on auth.users;

-- Remover tabelas primeiro (isso remove as policies automaticamente)
drop table if exists public.mensagens cascade;
drop table if exists public.conversas cascade;
drop table if exists public.agentes_ia cascade;
drop table if exists public.auditoria cascade;
drop table if exists public.perfis cascade;
drop table if exists public.empresas cascade;

-- Agora podemos remover as funções sem conflito
drop function if exists public.handle_new_user() cascade;
drop function if exists public.get_user_empresa_id() cascade;
drop function if exists public.get_user_role() cascade;
drop function if exists public.is_master() cascade;

drop type if exists user_role cascade;

-- ========================================================
-- EXTENSÕES
-- ========================================================

create extension if not exists "uuid-ossp";

-- ========================================================
-- TYPES
-- ========================================================

create type user_role as enum ('master', 'admin_tenant', 'colaborador');

-- ========================================================
-- TABELA EMPRESAS
-- ========================================================

create table public.empresas (
  id uuid default uuid_generate_v4() primary key,
  created_at timestamptz default now() not null,
  nome text not null,
  slug text unique,
  api_key_encrypted text,
  subscription_status text default 'active'
);

-- ========================================================
-- TABELA PERFIS
-- ========================================================

create table public.perfis (
  id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz default now() not null,
  empresa_id uuid references public.empresas(id) on delete cascade,
  nome text,
  email text,
  role user_role default 'colaborador'
);

-- ========================================================
-- AGENTES IA
-- ========================================================

create table public.agentes_ia (
  id uuid default uuid_generate_v4() primary key,
  created_at timestamptz default now() not null,
  empresa_id uuid references public.empresas(id) on delete cascade not null,
  nome text not null,
  prompt text not null,
  modelo text default 'gpt-4'
);

-- ========================================================
-- CONVERSAS
-- ========================================================

create table public.conversas (
  id uuid default uuid_generate_v4() primary key,
  created_at timestamptz default now() not null,
  empresa_id uuid references public.empresas(id) on delete cascade not null,
  usuario_id uuid references public.perfis(id) on delete cascade not null,
  titulo text,
  agente_id uuid references public.agentes_ia(id)
);

-- ========================================================
-- MENSAGENS
-- ========================================================

create table public.mensagens (
  id uuid default uuid_generate_v4() primary key,
  created_at timestamptz default now() not null,
  conversa_id uuid references public.conversas(id) on delete cascade not null,
  role text not null,
  conteudo text not null
);

-- ========================================================
-- AUDITORIA
-- ========================================================

create table public.auditoria (
  id uuid default uuid_generate_v4() primary key,
  created_at timestamptz default now() not null,
  empresa_id uuid references public.empresas(id) on delete cascade,
  usuario_id uuid references public.perfis(id) on delete cascade,
  acao text not null,
  detalhes text
);

-- ========================================================
-- HABILITAR RLS
-- ========================================================

alter table public.empresas enable row level security;
alter table public.perfis enable row level security;
alter table public.agentes_ia enable row level security;
alter table public.conversas enable row level security;
alter table public.mensagens enable row level security;
alter table public.auditoria enable row level security;

-- ========================================================
-- FUNÇÕES AUXILIARES
-- ========================================================

create or replace function public.get_user_empresa_id()
returns uuid
language sql
security definer
stable
as $$
  select empresa_id
  from public.perfis
  where id = auth.uid();
$$;

create or replace function public.get_user_role()
returns user_role
language sql
security definer
stable
as $$
  select role
  from public.perfis
  where id = auth.uid();
$$;

create or replace function public.is_master()
returns boolean
language sql
security definer
stable
as $$
  select role = 'master'
  from public.perfis
  where id = auth.uid();
$$;

-- ========================================================
-- POLICIES EMPRESAS
-- ========================================================

create policy "Empresa SELECT"
on public.empresas
for select
using (
  id = get_user_empresa_id()
  or is_master()
);

create policy "Empresa INSERT"
on public.empresas
for insert
to authenticated
with check (true);

create policy "Empresa UPDATE"
on public.empresas
for update
using (
  (
    id = get_user_empresa_id()
    and get_user_role() = 'admin_tenant'
  )
  or is_master()
);

-- ========================================================
-- POLICIES PERFIS
-- ========================================================

create policy "Perfis SELECT"
on public.perfis
for select
using (
  empresa_id = get_user_empresa_id()
  or is_master()
);

create policy "Perfis INSERT"
on public.perfis
for insert
with check (
  (
    empresa_id = get_user_empresa_id()
    and get_user_role() = 'admin_tenant'
  )
  or is_master()
);

create policy "Perfis UPDATE"
on public.perfis
for update
to authenticated
using (
  id = auth.uid()  -- Permite atualizar seu próprio perfil (onboarding)
  or (
    empresa_id = get_user_empresa_id()
    and get_user_role() = 'admin_tenant'
  )
  or is_master()
)
with check (
  id = auth.uid()
  or (
    empresa_id = get_user_empresa_id()
    and get_user_role() = 'admin_tenant'
  )
  or is_master()
);

create policy "Perfis DELETE"
on public.perfis
for delete
using (
  (
    empresa_id = get_user_empresa_id()
    and get_user_role() = 'admin_tenant'
  )
  or is_master()
);

-- ========================================================
-- POLICIES AGENTES IA
-- ========================================================

create policy "Agentes SELECT"
on public.agentes_ia
for select
using (
  empresa_id = get_user_empresa_id()
  or is_master()
);

create policy "Agentes INSERT"
on public.agentes_ia
for insert
with check (
  empresa_id = get_user_empresa_id()
);

create policy "Agentes UPDATE"
on public.agentes_ia
for update
using (
  empresa_id = get_user_empresa_id()
);

create policy "Agentes DELETE"
on public.agentes_ia
for delete
using (
  empresa_id = get_user_empresa_id()
);

-- ========================================================
-- POLICIES CONVERSAS
-- ========================================================

create policy "Conversas SELECT"
on public.conversas
for select
using (
  empresa_id = get_user_empresa_id()
  or is_master()
);

create policy "Conversas INSERT"
on public.conversas
for insert
with check (
  empresa_id = get_user_empresa_id()
);

create policy "Conversas UPDATE"
on public.conversas
for update
using (
  empresa_id = get_user_empresa_id()
);

create policy "Conversas DELETE"
on public.conversas
for delete
using (
  empresa_id = get_user_empresa_id()
);

-- ========================================================
-- POLICIES MENSAGENS
-- ========================================================

create policy "Mensagens SELECT"
on public.mensagens
for select
using (
  exists (
    select 1 from public.conversas c
    where c.id = mensagens.conversa_id
    and (
      c.empresa_id = get_user_empresa_id()
      or is_master()
    )
  )
);

create policy "Mensagens INSERT"
on public.mensagens
for insert
with check (
  exists (
    select 1 from public.conversas c
    where c.id = mensagens.conversa_id
    and c.empresa_id = get_user_empresa_id()
  )
);

-- ========================================================
-- POLICIES AUDITORIA
-- ========================================================

create policy "Auditoria SELECT"
on public.auditoria
for select
using (
  empresa_id = get_user_empresa_id()
  or is_master()
);

create policy "Auditoria INSERT"
on public.auditoria
for insert
with check (
  empresa_id = get_user_empresa_id()
);

-- ========================================================
-- TRIGGER CRIA PERFIL AUTOMÁTICO
-- ========================================================

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
as $$
begin
  insert into public.perfis (id, email, nome)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name'
  );
  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row
execute procedure public.handle_new_user();
```

---

## 🔍 Verificação

Após executar, verifique se deu tudo certo:

```sql
-- Verificar tabelas criadas
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;

-- Verificar RLS ativo
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY tablename;

-- Verificar políticas
SELECT tablename, policyname
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;
```

**Resultado esperado:**

- ✅ 6 tabelas: `agentes_ia`, `auditoria`, `conversas`, `empresas`, `mensagens`, `perfis`
- ✅ Todas com `rowsecurity = true`
- ✅ Múltiplas políticas por tabela

---

## 📊 Estrutura das Tabelas

### 1. empresas

```
id (PK)
created_at
nome
slug (unique)
api_key_encrypted
subscription_status
```

### 2. perfis

```
id (PK, FK → auth.users)
created_at
empresa_id (FK → empresas)
nome
email
role (master | admin_tenant | colaborador)
```

### 3. agentes_ia

```
id (PK)
created_at
empresa_id (FK → empresas)
nome
prompt
modelo
```

### 4. conversas

```
id (PK)
created_at
empresa_id (FK → empresas)
usuario_id (FK → perfis)
titulo
agente_id (FK → agentes_ia)
```

### 5. mensagens

```
id (PK)
created_at
conversa_id (FK → conversas)
role
conteudo
```

### 6. auditoria

```
id (PK)
created_at
empresa_id (FK → empresas)
usuario_id (FK → perfis)
acao
detalhes
```

---

## 🔐 Sistema de Roles

### master

- Acesso total a todas empresas
- Pode ver/editar tudo no sistema
- Ideal para desenvolvedores/suporte

### admin_tenant

- Administrador da empresa
- Pode gerenciar usuários da sua empresa
- Pode criar/editar agentes de IA
- Pode atualizar configurações da empresa

### colaborador (padrão)

- Usuário normal
- Pode criar conversas
- Pode usar agentes de IA
- Só vê dados da própria empresa

---

## 🛡️ Como Funciona o Multi-Tenancy

### Funções Auxiliares

O sistema usa 3 funções para controlar acesso:

```sql
get_user_empresa_id()  -- Retorna a empresa do usuário logado
get_user_role()        -- Retorna o role do usuário
is_master()            -- Verifica se é master
```

### Exemplo de Policy

```sql
-- Usuário só vê conversas da sua empresa (ou master vê tudo)
create policy "Conversas SELECT"
on public.conversas
for select
using (
  empresa_id = get_user_empresa_id()
  or is_master()
);
```

### Isolamento Garantido

- ✅ Cada empresa só acessa seus próprios dados
- ✅ RLS valida automaticamente em cada query
- ✅ Master pode acessar tudo (suporte/debug)
- ✅ Admin pode gerenciar sua empresa
- ✅ Colaborador só usa o sistema

---

## ❓ Problemas Comuns

### Erro: "permission denied for table"

**Causa:** RLS está bloqueando
**Solução:** Certifique-se que o usuário tem empresa_id definido

### Erro: "duplicate key value"

**Causa:** Já executou o script antes
**Solução:** O script tem RESET no início, pode executar novamente

### Trigger não cria perfil

**Causa:** Trigger não foi criado
**Solução:** Execute a seção final (TRIGGER) novamente

### Usuário não consegue criar empresa (onboarding)

**Causa:** Perfil foi criado mas sem empresa_id
**Solução:** Policy "Empresa INSERT" permite qualquer usuário criar

---

## 🚀 Próximos Passos

Após configurar o banco:

1. **Configure .env.local:**

```env
NEXT_PUBLIC_SUPABASE_URL=sua_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave
```

2. **Rode o projeto:**

```bash
npm install
npm run dev
```

3. **Teste o fluxo:**
   - Faça cadastro
   - Crie uma empresa (onboarding)
   - Seu perfil recebe `role = colaborador` automaticamente
   - Empresa fica associada ao seu perfil

4. **Para ter um usuário master:**

```sql
-- No SQL Editor do Supabase:
UPDATE public.perfis
SET role = 'master'
WHERE email = 'seu-email@exemplo.com';
```

---

## ✅ Checklist

- [ ] Script completo executado sem erros
- [ ] 6 tabelas criadas
- [ ] RLS ativo em todas (rowsecurity = true)
- [ ] Políticas criadas (várias por tabela)
- [ ] Trigger testado (criar usuário → perfil é criado automaticamente)
- [ ] Variáveis de ambiente configuradas
- [ ] Projeto rodando localmente

---

**✅ Setup completo! Banco configurado com multi-tenancy + roles.**

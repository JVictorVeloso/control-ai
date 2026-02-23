# 🚀 Guia de Setup e Validação - Control AI

> **Guia completo:** Configure o projeto do zero e valide todas as funcionalidades em 15 minutos.

---

## 📋 Índice Rápido

1. [Setup Inicial](#1-setup-inicial)
2. [Configuração do Banco](#2-configuração-do-banco)
3. [Variáveis de Ambiente](#3-variáveis-de-ambiente)
4. [Testes Funcionais](#4-testes-funcionais)
5. [Validação de Segurança](#5-validação-de-segurança)
6. [Troubleshooting](#6-troubleshooting)

---

## 1. Setup Inicial

### Requisitos

- Node.js 18+ e npm
- Conta no Supabase (gratuita)
- Conta no Vercel (opcional, para deploy)

### Clonar e Instalar

```bash
git clone <seu-repositorio>
cd control-ai
npm install
```

---

## 2. Configuração do Banco

### Passo 1: Criar Projeto no Supabase

1. Acesse [supabase.com](https://supabase.com)
2. Crie novo projeto
3. Anote: **URL do projeto** e **Anon Key**

### Passo 2: Executar SQL

1. No Supabase Dashboard, vá em **SQL Editor**
2. Copie **TODO** o conteúdo de [DATABASE_SETUP.md](DATABASE_SETUP.md)
3. Execute o script completo (cria 6 tabelas + RLS + policies)

### Passo 3: Verificar RLS Ativo

Execute no SQL Editor:

```sql
-- Deve retornar 6 linhas com rowsecurity = true
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename IN ('empresas', 'perfis', 'conversas', 'mensagens', 'auditoria', 'agentes_ia');
```

**Resultado esperado:**

```
empresas     | true
perfis       | true
conversas    | true
mensagens    | true
auditoria    | true
agentes_ia   | true
```

### Passo 4: Verificar Policies

```sql
-- Deve retornar múltiplas policies (24+)
SELECT tablename, policyname, cmd
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, cmd;
```

✅ **Checkpoint:** Se RLS está ativo e há policies, banco configurado corretamente.

---

## 3. Variáveis de Ambiente

### Criar `.env.local`

```bash
cp .env.local.example .env.local
```

### Preencher Credenciais

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-anonima

# Encriptação (gere com: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
ENCRYPTION_SECRET_KEY=sua-chave-256-bits-aqui
```

### Gerar Encryption Key

```bash
# Windows (PowerShell)
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Linux/Mac
openssl rand -hex 32
```

---

## 4. Testes Funcionais

### Iniciar Aplicação

```bash
npm run dev
```

Acesse: [http://localhost:3000](http://localhost:3000)

---

### Teste 1: Autenticação ✅

**Fluxo:**

1. Acesse `/login`
2. Clique em "Criar conta"
3. Use email real (receberá magic link)
4. Ou confirme manualmente no Supabase:
   ```sql
   UPDATE auth.users SET email_confirmed_at = NOW() WHERE email = 'seu@email.com';
   ```
5. Faça login
6. Deve redirecionar para `/dashboard` ou `/setup`

**Validação SQL:**

```sql
-- Ver usuário criado
SELECT id, email, created_at FROM auth.users;

-- Ver perfil associado
SELECT id, email, role, empresa_id FROM perfis WHERE id = 'user-id';
```

✅ **Checkpoint:** Login funciona e perfil foi criado.

---

### Teste 2: Onboarding (Primeira Vez) ✅

**Fluxo:**

1. Após primeiro login, deve ver `/setup`
2. Preencher:
   - Nome da empresa: "Minha Empresa"
   - Slug: "minha-empresa"
3. Clicar "Criar Workspace"
4. Deve redirecionar para `/dashboard`

**Validação SQL:**

```sql
-- Empresa criada
SELECT id, nome, slug, created_at FROM empresas;

-- Perfil agora tem empresa_id
SELECT email, empresa_id, role FROM perfis WHERE id = 'user-id';
```

✅ **Checkpoint:** Empresa criada e perfil vinculado.

---

### Teste 3: Configurar API Key ✅

**Fluxo:**

1. No dashboard, ir em "Configurações" (⚙️)
2. Ver estado inicial: "API Key Não Configurada"
3. Inserir chave válida (pode usar chave de teste do Google Gemini - gratuita):
   ```
   https://aistudio.google.com/app/apikey
   ```
4. Digitar chave no formato: `AIza...`
5. Clicar "Salvar Configuração"
6. **Observar feedbacks:**
   - ⏳ Botão mostra "Salvando..."
   - ✅ Botão fica verde: "Chave Salva!"
   - 🎨 Cartão verde aparece: "API Key Configurada"
   - 🔒 Chave aparece mascarada: `AIza...XyZ`

**Validação SQL:**

```sql
-- Empresa tem API key criptografada
SELECT nome, api_key_encrypted FROM empresas WHERE id = 'empresa-id';
```

**Validação de Criptografia:**

- A chave NO BANCO deve estar DIFERENTE da original
- Formato: `iv:authTag:encryptedData` (base64)
- Exemplo: `a1b2c3...`

✅ **Checkpoint:** API Key salva e criptografada.

---

### Teste 4: Chat com IA ✅

**Fluxo:**

1. Ir em "Chat" (💬)
2. Clicar "+ Nova Conversa"
3. Ver conversa aparecer na sidebar
4. Digitar: "Olá! Você está funcionando?"
5. Pressionar Enter ou clicar "Enviar"
6. **Observar:**
   - ⏳ Mensagem usuário aparece
   - 🔄 Spinner "Gerando resposta..."
   - 🤖 Resposta da IA aparece
   - ✅ Timestamp correto

**Mensagens de Teste Sugeridas:**

```
1. "Olá! Me explique o que é RLS em bancos de dados."
2. "Liste 5 vantagens de usar Next.js Server Actions."
3. "Crie um exemplo de código em TypeScript."
```

**Validação SQL:**

```sql
-- Conversa criada
SELECT id, titulo, empresa_id, usuario_id, created_at FROM conversas;

-- Mensagens salvas
SELECT role, conteudo, created_at
FROM mensagens
WHERE conversa_id = 'conversa-id'
ORDER BY created_at;
```

**Devem existir:**

- 1 linha com `role = 'user'` (sua mensagem)
- 1 linha com `role = 'assistant'` (resposta da IA)

✅ **Checkpoint:** Chat funciona, IA responde, tudo é persistido.

---

### Teste 5: Gestão de Equipe ✅

**Fluxo:**

1. Ir em "Equipe" (👥)
2. Ver seu próprio perfil listado
3. Ver estatísticas: "1 Membro, 1 Master, 0 Admins, 0 Colaboradores"
4. Clicar "Convidar Membro"
5. Preencher:
   - Email: `teste@exemplo.com`
   - Nome: `João Silva`
   - Role: `Colaborador`
6. Clicar "Enviar Convite"
7. Ver toast verde: "Convite enviado!"

**Validação SQL:**

```sql
-- Novo perfil criado
SELECT email, nome, role, empresa_id FROM perfis WHERE email = 'teste@exemplo.com';

-- Log de auditoria
SELECT tipo_acao, detalhes FROM auditoria WHERE tipo_acao = 'INVITE_SENT';
```

✅ **Checkpoint:** Sistema permite convidar membros com validação de permissões.

---

### Teste 6: Deletar Conversa ✅

**Fluxo:**

1. No Chat, passar mouse sobre conversa na sidebar
2. Ver botão 🗑️ aparecer
3. Clicar nele
4. Ver modal de confirmação: "Tem certeza?"
5. Confirmar
6. Ver conversa desaparecer
7. Ver toast verde: "Conversa deletada!"

**Validação SQL:**

```sql
-- Conversa foi deletada
SELECT * FROM conversas WHERE id = 'conversa-id';
-- Deve retornar 0 linhas

-- Mensagens também foram deletadas (CASCADE)
SELECT * FROM mensagens WHERE conversa_id = 'conversa-id';
-- Deve retornar 0 linhas
```

✅ **Checkpoint:** Deleções funcionam com CASCADE.

---

## 5. Validação de Segurança

### Teste 1: Multi-Tenancy (Isolamento)

**Setup:**

1. Criar **2 contas** diferentes (2 emails)
2. Em cada conta, criar workspace separado
3. Na **Conta A**: criar 2 conversas
4. Na **Conta B**: criar 3 conversas

**Validação:**

```sql
-- Logar como Usuário A no SQL Editor (usar sua session)
SELECT * FROM conversas;
-- Deve retornar: 2 conversas (só da Empresa A)

-- Trocar para Usuário B
SELECT * FROM conversas;
-- Deve retornar: 3 conversas (só da Empresa B)
```

✅ **Checkpoint:** RLS está funcionando, dados isolados por tenant.

---

### Teste 2: Controle de Acesso por Role

**Setup:**

1. Login como **Master** (sua conta original)
2. Ir em "Empresa" (🏢)
3. Tentar editar nome da empresa
4. ✅ Deve PERMITIR (Master pode)

**Simular Colaborador:**

No código, altere temporariamente:

```typescript
// src/app/dashboard/company/actions.ts
// Linha 93, altere para:
if (perfil.role !== 'colaborador') {  // Força ser "colaborador"
```

Agora tente editar empresa novamente:

- ❌ Deve BLOQUEAR com erro: "Apenas o Master pode editar"

**Restaure o código depois!**

✅ **Checkpoint:** Validações de role estão funcionando.

---

### Teste 3: Persistência (Refresh)

**Fluxo:**

1. Criar conversa com 5 mensagens
2. **Pressionar F5** (refresh)
3. Ver que tudo continua lá
4. **Fechar navegador**
5. Abrir novamente
6. Fazer login
7. Ir no Chat
8. Ver que conversas e mensagens persistiram

✅ **Checkpoint:** Dados são persistidos em PostgreSQL, não em memória.

---

### Teste 4: Criptografia de API Key

**Validação:**

1. Configurar API Key: `AIzaSyABC123XYZ`
2. No SQL Editor:
   ```sql
   SELECT api_key_encrypted FROM empresas WHERE id = 'sua-empresa';
   ```
3. Ver que retorna algo como: `a1b2c3d4:e5f6g7h8:i9j0k1l2`
4. ❌ NÃO deve mostrar `AIzaSyABC123XYZ` em texto puro

✅ **Checkpoint:** Chaves são criptografadas com AES-256-GCM.

---

## 6. Troubleshooting

### Erro: "Failed to fetch"

**Causa:** Supabase URL ou Anon Key incorretos

**Solução:**

```bash
# Verificar .env.local
cat .env.local

# Verificar no Supabase Dashboard > Settings > API
# Comparar URL e Anon Key
```

---

### Erro: "Row Level Security"

**Causa:** Policies não foram criadas

**Solução:**

```sql
-- Verificar se RLS está ativo
SELECT tablename, rowsecurity FROM pg_tables WHERE schemaname = 'public';

-- Se alguma tabela tiver rowsecurity = false, executar:
ALTER TABLE nome_da_tabela ENABLE ROW LEVEL SECURITY;

-- Recriar policies executando DATABASE_SETUP.md novamente
```

---

### Erro: "User already registered"

**Causa:** Email já usado

**Solução:**

```sql
-- Deletar usuário existente (CUIDADO: apenas em dev!)
DELETE FROM auth.users WHERE email = 'seu@email.com';
```

---

### Chat não responde (IA)

**Causa:** API Key inválida ou sem saldo

**Solução:**

1. Verificar no dashboard do provider (OpenAI, Google, etc)
2. Testar chave manualmente:
   ```bash
   curl https://api.openai.com/v1/chat/completions \
     -H "Authorization: Bearer sua-chave" \
     -H "Content-Type: application/json" \
     -d '{"model": "gpt-4o-mini", "messages": [{"role": "user", "content": "test"}]}'
   ```
3. Se erro, trocar por chave válida

---

### Build falha no Vercel

**Causa:** Variáveis de ambiente não configuradas

**Solução:**

1. No Vercel Dashboard, ir em **Settings > Environment Variables**
2. Adicionar:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `ENCRYPTION_SECRET_KEY`
3. Fazer redeploy: `vercel --prod`

---

## ✅ Checklist Final

Antes de entregar o case, confirme:

- [x] Build passa sem erros: `npm run build`
- [x] RLS ativo em todas as 6 tabelas
- [x] 24+ policies criadas
- [x] API Key criptografada no banco
- [x] Chat IA funciona (resposta real)
- [x] Multi-tenancy funciona (2 contas, dados isolados)
- [x] Auditoria registra ações críticas
- [x] Loading states e toasts em todas as páginas
- [x] Aplicação deployada (Vercel + Supabase)

---

## 📚 Próximos Passos

Após validar tudo:

1. **Capturar evidências:**
   - Screenshots de cada funcionalidade
   - Vídeo 2-3min mostrando fluxo completo

2. **Revisar documentação:**
   - [README.md](../README.md) - Overview
   - [ARQUITETURA.md](ARQUITETURA.md) - Design técnico
   - [SEGURANCA_RLS.md](SEGURANCA_RLS.md) - Segurança detalhada

3. **Deploy:**

   ```bash
   # Vercel CLI
   npm i -g vercel
   vercel --prod
   ```

4. **Compartilhar:**
   - URL da aplicação online
   - Repositório GitHub
   - Link para documentação

---

**Documentação criada em:** 19/02/2026  
**Última atualização:** 19/02/2026  
**Tempo estimado de setup:** 15-20 minutos

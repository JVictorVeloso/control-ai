# Control AI - Dashboard & Onboarding

## 📊 Estrutura do Banco de Dados

Para que o sistema funcione corretamente, crie as seguintes tabelas no Supabase:

### Tabela: perfis

```sql
CREATE TABLE perfis (
  id UUID REFERENCES auth.users PRIMARY KEY,
  empresa_id UUID REFERENCES empresas(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE perfis ENABLE ROW LEVEL SECURITY;

-- Policy: Usuários podem ver e editar apenas seu próprio perfil
CREATE POLICY "Users can view own profile" ON perfis
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON perfis
  FOR UPDATE USING (auth.uid() = id);

-- Trigger para criar perfil automaticamente quando um usuário se registra
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.perfis (id)
  VALUES (NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

### Tabela: empresas

```sql
CREATE TABLE empresas (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE empresas ENABLE ROW LEVEL SECURITY;

-- Policy: Usuários podem ver empresas que estão associados
CREATE POLICY "Users can view own company" ON empresas
  FOR SELECT USING (
    id IN (
      SELECT empresa_id FROM perfis WHERE id = auth.uid()
    )
  );

-- Policy: Usuários podem criar empresas
CREATE POLICY "Users can create companies" ON empresas
  FOR INSERT WITH CHECK (true);
```

## 🚀 Como Usar

1. **Configurar as tabelas no Supabase** (SQL acima)
2. **Acessar `/login`** - Criar conta ou fazer login
3. **Redirecionamento automático** para `/dashboard`
4. **Onboarding** - Se não tiver empresa, criar workspace
5. **Dashboard** - Navegar pelo sistema

## 📁 Arquivos Criados

- ✅ [src/app/dashboard/layout.tsx](src/app/dashboard/layout.tsx) - Layout protegido
- ✅ [src/app/dashboard/page.tsx](src/app/dashboard/page.tsx) - Lógica principal
- ✅ [src/app/dashboard/actions.ts](src/app/dashboard/actions.ts) - Server Actions
- ✅ [src/components/dashboard/onboarding-card.tsx](src/components/dashboard/onboarding-card.tsx) - Card de onboarding
- ✅ [src/components/dashboard/dashboard-content.tsx](src/components/dashboard/dashboard-content.tsx) - Dashboard com sidebar

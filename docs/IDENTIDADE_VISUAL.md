# Identidade Visual - Control AI

Este documento descreve a identidade visual implementada no sistema Control AI.

## 🎨 Paleta de Cores

### Cores Primárias

- **Primary Blue**: `#3b82f6` (blue-500)
  - Usado em botões principais, links e elementos interativos
  - Variantes: blue-50 até blue-900

### Cores de Acento

- **Accent Purple**: `#a855f7` (purple-500)
  - Usado para destacar elementos especiais e role Master
  - Variantes: purple-50 até purple-900

### Cores Semânticas

- **Success Green**: `#22c55e` (green-500)
  - Usado para ações de criação e mensagens de sucesso
- **Warning Yellow**: `#f59e0b` (amber-500)
  - Usado para avisos e alertas importantes

- **Danger Red**: `#ef4444` (red-500)
  - Usado para ações destrutivas e erros

- **Info Blue**: `#3b82f6` (blue-500)
  - Usado para informações e atualizações

## 🎭 Componentes de Brand

### Logo Component

**Localização**: `src/components/brand/logo.tsx`

O logo utiliza:

- Ícone Sparkles do Lucide
- Gradiente de blue-600 para purple-600
- Efeito de blur para profundidade
- Três tamanhos: sm, md, lg
- Opção de mostrar/ocultar texto

```tsx
<Logo size="md" showText={true} />
```

### Badge Component

**Localização**: `src/components/ui/badge.tsx`

Variantes disponíveis:

- `default`: Azul primário
- `secondary`: Cinza neutro
- `destructive`: Vermelho
- `outline`: Borda apenas
- `success`: Verde
- `warning`: Amarelo
- `info`: Azul informativo
- `purple`: Roxo para destaque

```tsx
<Badge variant="success">Ativo</Badge>
```

## 🎯 Aplicações de Design

### Gradientes

Usados em:

- Cabeçalhos de páginas principais
- Card de Chat (principal CTA)
- Logo e branding
- Backgrounds sutis

**Padrão de gradiente hero**:

```css
bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-50
dark:from-blue-950/30 dark:via-purple-950/30 dark:to-indigo-950/30
```

### Sombras

Sistema de sombras consistente:

- `shadow-sm`: Pequena elevação
- `shadow-md`: Elevação média (padrão)
- `shadow-lg`: Elevação alta
- `shadow-xl`: Elevação máxima
- `shadow-brand`: Sombra colorida com azul (0 10px 40px -10px rgba(59, 130, 246, 0.4))

### Border Radius

- Cards e containers: `rounded-xl` (1rem)
- Badges e pills: `rounded-full`
- Botões: `rounded-lg` (0.5rem)
- Inputs: `rounded-md` (0.375rem)

## 📦 Sistema de Badges por Role

### Master

- **Variant**: `purple`
- **Ícone**: Crown
- **Cor**: Purple-600
- **Uso**: Role mais alto no sistema

### Admin Tenant

- **Variant**: `info`
- **Ícone**: Shield
- **Cor**: Blue-600
- **Uso**: Administrador da empresa

### Colaborador

- **Variant**: `secondary`
- **Ícone**: User
- **Cor**: Gray-600
- **Uso**: Usuário padrão

## 🎨 Sistema de Badges por Ação (Audit)

| Ação                | Variant     | Significado             |
| ------------------- | ----------- | ----------------------- |
| CREATE              | success     | Criação de recursos     |
| UPDATE              | info        | Atualização de dados    |
| DELETE              | destructive | Remoção de recursos     |
| LOGIN               | purple      | Autenticação            |
| LOGOUT              | secondary   | Saída do sistema        |
| INVITE_SENT         | warning     | Convites pendentes      |
| MEMBER_ROLE_UPDATED | warning     | Alteração de permissões |

## 🌈 Dark Mode

Todos os componentes suportam dark mode usando:

- Prefixo `dark:` do Tailwind
- Ajuste de opacidade e contraste
- Backgrounds: gray-800/gray-900 no dark
- Borders: reduzidas para zinc-700/zinc-800

## 📐 Espaçamento Padrão

- Padding externo de páginas: `p-8`
- Gap entre elementos: `gap-4` ou `gap-6`
- Espaçamento entre seções: `space-y-8`
- Padding interno de cards: `p-6`

## 🎯 Hierarquia Visual

### Títulos

1. **H1**: `text-3xl font-bold` - Títulos principais de página
2. **H2**: `text-xl font-semibold` - Subtítulos de seções
3. **H3**: `text-lg font-bold` - Títulos de cards

### Cards de Destaque

O card principal (Chat) usa:

- Gradiente colorido (blue-600 to purple-600)
- Hover com scale-105 e translate-y
- Sombra elevada aumentando no hover
- Backdrop blur em elementos internos

### Efeitos de Hover

- **Cards**: `hover:shadow-md hover:border-color transition-all`
- **Botões primários**: `hover:scale-105`
- **Cards principais**: `hover:-translate-y-1`

## 📋 Configuração de Brand

Arquivo central: `src/lib/brand.ts`

Exporta:

- `brand.name`: "Control AI"
- `brand.tagline`: "Seu Assistente Inteligente de Negócios"
- `brand.colors`: Paleta completa
- `brand.gradients`: Gradientes pré-definidos
- `brand.shadows`: Sistema de sombras
- `roleColors`: Cores por role
- `statusColors`: Cores por status

## 🚀 Uso e Boas Práticas

### Ao adicionar novos componentes:

1. Use a paleta de cores definida em `brand.ts`
2. Aplique badges consistentes com as variantes existentes
3. Mantenha dark mode em mente desde o início
4. Use os gradientes pré-definidos
5. Aplique sombras do sistema

### Ao criar CTAs:

- Principal: Gradiente blue-600 to purple-600
- Secundário: Outline com hover
- Destrutivo: Red-600 com hover para red-700

### Ao criar formulários:

- Labels: `text-sm font-medium`
- Inputs: Border gray-300, focus:ring-blue-500
- Helpers: `text-xs text-gray-500`
- Errors: `text-xs text-red-600`

## 🎨 Exemplos Visuais

### Card Padrão

```tsx
<div className="p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
  {/* conteúdo */}
</div>
```

### Card com Hover

```tsx
<div className="group p-6 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl hover:shadow-md hover:border-blue-300 transition-all">
  {/* conteúdo */}
</div>
```

### Cabeçalho de Página

```tsx
<div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-50 dark:from-blue-950/30 dark:via-purple-950/30 dark:to-indigo-950/30 p-8 border border-blue-100 dark:border-blue-900/50">
  <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-3xl"></div>
  <div className="relative">{/* conteúdo */}</div>
</div>
```

## 📱 Responsividade

- Grid de cards: `grid-cols-1 md:grid-cols-3`
- Sidebar: Oculto em mobile (`hidden md:flex`)
- Padding responsivo: `p-4 md:p-6 lg:p-8`

## 🔄 Próximos Passos

- [ ] Adicionar animações com Framer Motion
- [ ] Criar illustrated empty states
- [ ] Implementar breadcrumbs com estilo consistente
- [ ] Expandir sistema de ícones customizados

---

**Última atualização**: 16 de fevereiro de 2026

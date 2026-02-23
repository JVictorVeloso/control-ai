// Tipos do banco de dados

// Enum de roles do sistema
export type UserRole = 'master' | 'admin_tenant' | 'colaborador'

export interface Empresa {
  id: string
  nome: string
  slug: string | null
  api_key_encrypted: string | null
  subscription_status: string
  created_at: string
}

export interface Perfil {
  id: string
  empresa_id: string | null
  nome: string | null
  email: string | null
  role: UserRole
  created_at: string
}

export interface Conversa {
  id: string
  empresa_id: string
  usuario_id: string
  titulo: string | null
  agente_id: string | null
  created_at: string
}

export interface Mensagem {
  id: string
  conversa_id: string
  role: 'user' | 'assistant' | 'system'
  conteudo: string
  created_at: string
}

export interface Auditoria {
  id: string
  empresa_id: string | null
  usuario_id: string | null
  acao: string
  detalhes: string | null
  created_at: string
}

export interface AgenteIA {
  id: string
  empresa_id: string
  nome: string
  prompt: string
  modelo: string
  created_at: string
}

// Tipo para resposta do Supabase com join de perfil
// Supabase retorna relações como arrays mesmo se for 1-para-1
export interface AuditoriaQueryResult {
  id: string
  empresa_id: string | null
  usuario_id: string | null
  acao: string
  detalhes: string | null
  created_at: string
  perfis: Array<{
    nome: string | null
    email: string | null
  }>
}

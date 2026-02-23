'use server'

import type { AuditoriaQueryResult } from '@/types/database'
import { createClient } from '@/utils/supabase/server'

export interface AuditLog {
  id: string
  created_at: string
  empresa_id: string
  usuario_id: string | null
  acao: string
  detalhes: string | null
  // Join fields
  usuario_nome?: string | null
  usuario_email?: string | null
}

// Listar logs de auditoria com paginação
export async function getAuditLogs(
  page: number = 1,
  limit: number = 50,
  filterAction?: string
): Promise<{
  data?: AuditLog[]
  total?: number
  error?: string
}> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Não autenticado' }
  }

  // ============================================
  // 🔒 SEGREGAÇÃO MULTI-TENANT:
  // Cada empresa só vê seus próprios logs de auditoria
  // RLS filtra automaticamente por empresa_id
  // ============================================

  const { data: perfil } = await supabase
    .from('perfis')
    .select('empresa_id')
    .eq('id', user.id)
    .single()

  if (!perfil?.empresa_id) {
    return { error: 'Empresa não encontrada' }
  }

  // Calcular offset para paginação
  const offset = (page - 1) * limit

  // Query base
  let query = supabase
    .from('auditoria')
    .select(
      `
      id,
      created_at,
      empresa_id,
      usuario_id,
      acao,
      detalhes,
      perfis:usuario_id (
        nome,
        email
      )
    `,
      { count: 'exact' }
    )
    .eq('empresa_id', perfil.empresa_id)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1)

  // Aplicar filtro de ação se fornecido
  if (filterAction && filterAction !== 'all') {
    query = query.eq('acao', filterAction)
  }

  const { data, error, count } = await query

  if (error) {
    return { error: error.message }
  }

  // Transformar dados para incluir info do usuário
  const logs: AuditLog[] =
    data?.map((log: AuditoriaQueryResult) => ({
      id: log.id,
      created_at: log.created_at,
      empresa_id: log.empresa_id || '',
      usuario_id: log.usuario_id,
      acao: log.acao,
      detalhes: log.detalhes,
      usuario_nome: log.perfis?.[0]?.nome,
      usuario_email: log.perfis?.[0]?.email,
    })) || []

  return {
    data: logs,
    total: count || 0,
  }
}

// Obter estatísticas de auditoria
export async function getAuditStats(): Promise<{
  data?: {
    total: number
    today: number
    thisWeek: number
    thisMonth: number
    actionCounts: Record<string, number>
  }
  error?: string
}> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Não autenticado' }
  }

  const { data: perfil } = await supabase
    .from('perfis')
    .select('empresa_id')
    .eq('id', user.id)
    .single()

  if (!perfil?.empresa_id) {
    return { error: 'Empresa não encontrada' }
  }

  // Buscar todos os logs da empresa
  const { data: logs } = await supabase
    .from('auditoria')
    .select('created_at, acao')
    .eq('empresa_id', perfil.empresa_id)

  if (!logs) {
    return {
      data: {
        total: 0,
        today: 0,
        thisWeek: 0,
        thisMonth: 0,
        actionCounts: {},
      },
    }
  }

  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
  const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)

  const stats = {
    total: logs.length,
    today: logs.filter((log) => new Date(log.created_at) >= today).length,
    thisWeek: logs.filter((log) => new Date(log.created_at) >= weekAgo).length,
    thisMonth: logs.filter((log) => new Date(log.created_at) >= monthAgo)
      .length,
    actionCounts: logs.reduce(
      (acc, log) => {
        acc[log.acao] = (acc[log.acao] || 0) + 1
        return acc
      },
      {} as Record<string, number>
    ),
  }

  return { data: stats }
}

// Obter tipos de ações únicas (para filtros)
export async function getActionTypes(): Promise<{
  data?: string[]
  error?: string
}> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Não autenticado' }
  }

  const { data: perfil } = await supabase
    .from('perfis')
    .select('empresa_id')
    .eq('id', user.id)
    .single()

  if (!perfil?.empresa_id) {
    return { error: 'Empresa não encontrada' }
  }

  const { data, error } = await supabase
    .from('auditoria')
    .select('acao')
    .eq('empresa_id', perfil.empresa_id)

  if (error) {
    return { error: error.message }
  }

  // Extrair tipos únicos
  const uniqueActions = [...new Set(data?.map((item) => item.acao) || [])]

  return { data: uniqueActions.sort() }
}

// Exportar logs para CSV (retorna string CSV)
export async function exportAuditLogs(): Promise<{
  data?: string
  error?: string
}> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Não autenticado' }
  }

  const { data: perfil } = await supabase
    .from('perfis')
    .select('empresa_id, role')
    .eq('id', user.id)
    .single()

  if (!perfil?.empresa_id) {
    return { error: 'Empresa não encontrada' }
  }

  // Apenas master e admin podem exportar
  if (perfil.role !== 'master' && perfil.role !== 'admin_tenant') {
    return { error: 'Apenas Master e Admin podem exportar logs' }
  }

  // Buscar todos os logs
  const { data: logs, error } = await supabase
    .from('auditoria')
    .select(
      `
      created_at,
      acao,
      detalhes,
      perfis:usuario_id (
        nome,
        email
      )
    `
    )
    .eq('empresa_id', perfil.empresa_id)
    .order('created_at', { ascending: false })
    .limit(10000) // Limite de segurança

  if (error) {
    return { error: error.message }
  }

  if (!logs || logs.length === 0) {
    return { error: 'Nenhum log encontrado' }
  }

  // Gerar CSV
  const headers = ['Data/Hora', 'Ação', 'Usuário', 'Email', 'Detalhes']
  const rows = logs.map((log) => [
    new Date(log.created_at).toLocaleString('pt-BR'),
    log.acao,
    log.perfis?.[0]?.nome || 'Sistema',
    log.perfis?.[0]?.email || '-',
    log.detalhes || '-',
  ])

  const csv = [
    headers.join(','),
    ...rows.map((row) =>
      row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(',')
    ),
  ].join('\n')

  return { data: csv }
}

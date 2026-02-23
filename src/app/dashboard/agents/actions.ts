'use server'

import type { AgenteIA } from '@/types/database'
import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

// ============================================================
// Agentes IA — CRUD completo com RLS + Auditoria
// ============================================================

/**
 * Lista todos os agentes da empresa do usuário.
 * RLS garante isolamento por tenant.
 */
export async function getAgentes(): Promise<{
  data?: AgenteIA[]
  error?: string
}> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return { error: 'Não autenticado' }

  const { data: perfil } = await supabase
    .from('perfis')
    .select('empresa_id')
    .eq('id', user.id)
    .single()

  if (!perfil?.empresa_id) return { error: 'Empresa não encontrada' }

  const { data, error } = await supabase
    .from('agentes_ia')
    .select('*')
    .eq('empresa_id', perfil.empresa_id)
    .order('created_at', { ascending: false })

  if (error) return { error: error.message }

  return { data: data as AgenteIA[] }
}

/**
 * Obtém um agente específico por ID.
 */
export async function getAgente(
  agenteId: string
): Promise<{ data?: AgenteIA; error?: string }> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return { error: 'Não autenticado' }

  const { data, error } = await supabase
    .from('agentes_ia')
    .select('*')
    .eq('id', agenteId)
    .single()

  if (error) return { error: error.message }

  return { data: data as AgenteIA }
}

/**
 * Cria um novo agente de IA.
 * Apenas admin_tenant e master podem criar agentes.
 */
export async function createAgente(
  formData: FormData
): Promise<{ data?: AgenteIA; error?: string }> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return { error: 'Não autenticado' }

  // Verificar permissão
  const { data: perfil } = await supabase
    .from('perfis')
    .select('empresa_id, role')
    .eq('id', user.id)
    .single()

  if (!perfil?.empresa_id) return { error: 'Empresa não encontrada' }

  if (perfil.role === 'colaborador') {
    return {
      error: 'Sem permissão. Apenas Admin e Master podem criar agentes.',
    }
  }

  const nome = formData.get('nome') as string
  const prompt = formData.get('prompt') as string
  const modelo = formData.get('modelo') as string

  if (!nome?.trim()) return { error: 'Nome é obrigatório' }
  if (!prompt?.trim()) return { error: 'Prompt do sistema é obrigatório' }
  if (!modelo?.trim()) return { error: 'Modelo é obrigatório' }

  const { data, error } = await supabase
    .from('agentes_ia')
    .insert({
      empresa_id: perfil.empresa_id,
      nome: nome.trim(),
      prompt: prompt.trim(),
      modelo: modelo.trim(),
    })
    .select()
    .single()

  if (error) return { error: error.message }

  // Registrar na auditoria
  await supabase.from('auditoria').insert({
    empresa_id: perfil.empresa_id,
    usuario_id: user.id,
    acao: 'agent_created',
    detalhes: `Agente "${nome.trim()}" criado com modelo ${modelo}`,
  })

  revalidatePath('/dashboard/agents')
  return { data: data as AgenteIA }
}

/**
 * Atualiza um agente existente.
 * Apenas admin_tenant e master podem atualizar.
 */
export async function updateAgente(
  agenteId: string,
  formData: FormData
): Promise<{ data?: AgenteIA; error?: string }> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return { error: 'Não autenticado' }

  const { data: perfil } = await supabase
    .from('perfis')
    .select('empresa_id, role')
    .eq('id', user.id)
    .single()

  if (!perfil?.empresa_id) return { error: 'Empresa não encontrada' }

  if (perfil.role === 'colaborador') {
    return {
      error: 'Sem permissão. Apenas Admin e Master podem editar agentes.',
    }
  }

  const nome = formData.get('nome') as string
  const prompt = formData.get('prompt') as string
  const modelo = formData.get('modelo') as string

  if (!nome?.trim()) return { error: 'Nome é obrigatório' }
  if (!prompt?.trim()) return { error: 'Prompt do sistema é obrigatório' }

  const { data, error } = await supabase
    .from('agentes_ia')
    .update({
      nome: nome.trim(),
      prompt: prompt.trim(),
      modelo: modelo.trim(),
    })
    .eq('id', agenteId)
    .eq('empresa_id', perfil.empresa_id)
    .select()
    .single()

  if (error) return { error: error.message }

  // Registrar na auditoria
  await supabase.from('auditoria').insert({
    empresa_id: perfil.empresa_id,
    usuario_id: user.id,
    acao: 'agent_updated',
    detalhes: `Agente "${nome.trim()}" atualizado`,
  })

  revalidatePath('/dashboard/agents')
  return { data: data as AgenteIA }
}

/**
 * Remove um agente.
 * Apenas admin_tenant e master podem remover.
 */
export async function deleteAgente(
  agenteId: string
): Promise<{ error?: string }> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return { error: 'Não autenticado' }

  const { data: perfil } = await supabase
    .from('perfis')
    .select('empresa_id, role')
    .eq('id', user.id)
    .single()

  if (!perfil?.empresa_id) return { error: 'Empresa não encontrada' }

  if (perfil.role === 'colaborador') {
    return {
      error: 'Sem permissão. Apenas Admin e Master podem remover agentes.',
    }
  }

  // Buscar nome do agente para auditoria
  const { data: agente } = await supabase
    .from('agentes_ia')
    .select('nome')
    .eq('id', agenteId)
    .single()

  const { error } = await supabase
    .from('agentes_ia')
    .delete()
    .eq('id', agenteId)
    .eq('empresa_id', perfil.empresa_id)

  if (error) return { error: error.message }

  // Registrar na auditoria
  await supabase.from('auditoria').insert({
    empresa_id: perfil.empresa_id,
    usuario_id: user.id,
    acao: 'agent_deleted',
    detalhes: `Agente "${agente?.nome || agenteId}" removido`,
  })

  revalidatePath('/dashboard/agents')
  return {}
}

/**
 * Retorna estatísticas dos agentes da empresa.
 */
export async function getAgentesStats(): Promise<{
  data?: { total: number; modelos: Record<string, number> }
  error?: string
}> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return { error: 'Não autenticado' }

  const { data: perfil } = await supabase
    .from('perfis')
    .select('empresa_id')
    .eq('id', user.id)
    .single()

  if (!perfil?.empresa_id) return { error: 'Empresa não encontrada' }

  const { data, error } = await supabase
    .from('agentes_ia')
    .select('modelo')
    .eq('empresa_id', perfil.empresa_id)

  if (error) return { error: error.message }

  const modelos: Record<string, number> = {}
  for (const agente of data || []) {
    modelos[agente.modelo] = (modelos[agente.modelo] || 0) + 1
  }

  return {
    data: {
      total: data?.length || 0,
      modelos,
    },
  }
}

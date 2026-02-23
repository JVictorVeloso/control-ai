'use server'

import type { Empresa } from '@/types/database'
import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

/**
 * Obtém informações da empresa do usuário autenticado.
 *
 * RLS garante que apenas membros da empresa podem acessar suas informações.
 *
 * @returns { data: Empresa } em sucesso ou { error: string } em falha
 */
export async function getCompanyInfo(): Promise<{
  data?: Empresa
  error?: string
}> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Não autenticado' }
  }

  // Buscar empresa do usuário
  const { data: perfil } = await supabase
    .from('perfis')
    .select('empresa_id')
    .eq('id', user.id)
    .single()

  if (!perfil?.empresa_id) {
    return { error: 'Empresa não encontrada' }
  }

  const { data, error } = await supabase
    .from('empresas')
    .select('*')
    .eq('id', perfil.empresa_id)
    .single()

  if (error) {
    return { error: error.message }
  }

  return { data }
}

/**
 * Atualiza o nome da empresa.
 *
 * 🔐 Apenas MASTER pode editar informações da empresa.
 * Admin e Colaborador não têm permissão.
 *
 * @param formData - Formulário contendo 'nome'
 * @returns { data: { success: true } } em sucesso ou { error: string } em falha
 */
export async function updateCompanyName(
  formData: FormData
): Promise<{ data?: { success: true }; error?: string }> {
  try {
    const supabase = await createClient()

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return { error: 'Não autenticado' }
    }

    // ============================================
    // 🔐 CONTROLE DE ACESSO POR ROLE:
    // Apenas MASTER (dono) pode editar dados da empresa
    // Admin e Colaborador: ❌ Sem permissão
    // ============================================

    const { data: perfil, error: perfilError } = await supabase
      .from('perfis')
      .select('empresa_id, role')
      .eq('id', user.id)
      .single()

    if (perfilError || !perfil?.empresa_id) {
      return { error: 'Empresa não encontrada' }
    }

    // Validação crítica: Apenas Master pode editar empresa
    if (perfil.role !== 'master') {
      return { error: 'Apenas o Master pode editar informações da empresa' }
    }

    const newName = formData.get('nome') as string

    if (!newName || newName.trim().length < 3) {
      return { error: 'Nome deve ter no mínimo 3 caracteres' }
    }

    // Atualizar nome
    const { error: updateError } = await supabase
      .from('empresas')
      .update({ nome: newName.trim() })
      .eq('id', perfil.empresa_id)

    if (updateError) {
      return { error: updateError.message }
    }

    // Registrar na auditoria
    await supabase.from('auditoria').insert({
      empresa_id: perfil.empresa_id,
      usuario_id: user.id,
      acao: 'UPDATE',
      detalhes: `Nome da empresa alterado para: ${newName}`,
    })

    revalidatePath('/dashboard/company')
    return { data: { success: true } }
  } catch (error) {
    console.error('[updateCompanyName]', error)
    return { error: 'Erro ao atualizar nome da empresa' }
  }
}

/**
 * Atualiza o slug da empresa (identificador único na URL).
 *
 * 🔐 Apenas MASTER pode editar o slug.
 * Valida formato (apenas letras minúsculas, números e hífen).
 *
 * @param formData - Formulário contendo 'slug'
 * @returns { data: { success: true } } em sucesso ou { error: string } em falha
 */
export async function updateCompanySlug(
  formData: FormData
): Promise<{ data?: { success: true }; error?: string }> {
  try {
    const supabase = await createClient()

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return { error: 'Não autenticado' }
    }

    const { data: perfil, error: perfilError } = await supabase
      .from('perfis')
      .select('empresa_id, role')
      .eq('id', user.id)
      .single()

    if (perfilError || !perfil?.empresa_id) {
      return { error: 'Empresa não encontrada' }
    }

    if (perfil.role !== 'master') {
      return { error: 'Apenas o Master pode editar o slug' }
    }

    const newSlug = formData.get('slug') as string

    if (!newSlug || !/^[a-z0-9-]{3,}$/.test(newSlug)) {
      return {
        error:
          'Slug deve ter no mínimo 3 caracteres (apenas letras minúsculas, números e hífen)',
      }
    }

    // Verificar se slug já existe
    const { data: existing } = await supabase
      .from('empresas')
      .select('id')
      .eq('slug', newSlug)
      .single()

    if (existing && existing.id !== perfil.empresa_id) {
      return { error: 'Este slug já está em uso por outra empresa' }
    }

    // Atualizar slug
    const { error: updateError } = await supabase
      .from('empresas')
      .update({ slug: newSlug })
      .eq('id', perfil.empresa_id)

    if (updateError) {
      return { error: updateError.message }
    }

    // Registrar na auditoria
    await supabase.from('auditoria').insert({
      empresa_id: perfil.empresa_id,
      usuario_id: user.id,
      acao: 'UPDATE',
      detalhes: `Slug da empresa alterado para: ${newSlug}`,
    })

    revalidatePath('/dashboard/company')
    return { data: { success: true } }
  } catch (error) {
    console.error('[updateCompanySlug]', error)
    return { error: 'Erro ao atualizar slug da empresa' }
  }
}

// Obter estatísticas de uso da empresa
export async function getCompanyUsageStats(): Promise<{
  data?: {
    totalConversas: number
    totalMensagens: number
    totalMembros: number
    hasApiKey: boolean
    createdAt: string
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

  // Buscar estatísticas
  const [conversasResult, membrosResult, empresaResult] = await Promise.all([
    supabase
      .from('conversas')
      .select('id', { count: 'exact', head: true })
      .eq('empresa_id', perfil.empresa_id),
    supabase
      .from('perfis')
      .select('id', { count: 'exact', head: true })
      .eq('empresa_id', perfil.empresa_id),
    supabase
      .from('empresas')
      .select('api_key_encrypted, created_at')
      .eq('id', perfil.empresa_id)
      .single(),
  ])

  // Contar mensagens manualmente (join não funciona no count)
  const { data: conversas } = await supabase
    .from('conversas')
    .select('id')
    .eq('empresa_id', perfil.empresa_id)

  let totalMensagens = 0
  if (conversas && conversas.length > 0) {
    const conversaIds = conversas.map((c) => c.id)
    const { count } = await supabase
      .from('mensagens')
      .select('id', { count: 'exact', head: true })
      .in('conversa_id', conversaIds)

    totalMensagens = count || 0
  }

  return {
    data: {
      totalConversas: conversasResult.count || 0,
      totalMensagens,
      totalMembros: membrosResult.count || 0,
      hasApiKey: !!empresaResult.data?.api_key_encrypted,
      createdAt: empresaResult.data?.created_at || '',
    },
  }
}

/**
 * Deleta a empresa (soft delete).
 *
 * 🔐 Apenas MASTER pode deletar a empresa.
 * CASCADE remove automaticamente: perfis, conversas, mensagens, auditoria.
 *
 * @returns { data: { success: true, redirect: string } } em sucesso ou { error: string } em falha
 */
export async function deleteCompany(): Promise<{
  data?: { success: true; redirect: string }
  error?: string
}> {
  try {
    const supabase = await createClient()

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return { error: 'Não autenticado' }
    }

    const { data: perfil, error: perfilError } = await supabase
      .from('perfis')
      .select('empresa_id, role')
      .eq('id', user.id)
      .single()

    if (perfilError || !perfil?.empresa_id) {
      return { error: 'Empresa não encontrada' }
    }

    if (perfil.role !== 'master') {
      return { error: 'Apenas o Master pode deletar a empresa' }
    }

    // Registrar na auditoria antes de deletar
    await supabase.from('auditoria').insert({
      empresa_id: perfil.empresa_id,
      usuario_id: user.id,
      acao: 'DELETE',
      detalhes: 'Empresa deletada pelo Master',
    })

    // Deletar empresa (CASCADE irá remover todos os dados relacionados)
    const { error: deleteError } = await supabase
      .from('empresas')
      .delete()
      .eq('id', perfil.empresa_id)

    if (deleteError) {
      return { error: deleteError.message }
    }

    revalidatePath('/dashboard')
    return { data: { success: true, redirect: '/login' } }
  } catch (error) {
    console.error('[deleteCompany]', error)
    return { error: 'Erro ao deletar empresa' }
  }
}

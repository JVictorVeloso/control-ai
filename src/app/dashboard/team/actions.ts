'use server'

import type { Perfil } from '@/types/database'
import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

/**
 * Lista todos os membros da empresa do usuário autenticado.
 *
 * RLS garante que apenas membros da mesma empresa são retornados.
 * Ordena por data de criação (mais antigos primeiro).
 *
 * @returns { data: Perfil[] } em sucesso ou { error: string } em falha
 */
export async function getTeamMembers(): Promise<{
  data?: Perfil[]
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
    .select('empresa_id, role')
    .eq('id', user.id)
    .single()

  if (!perfil?.empresa_id) {
    return { error: 'Empresa não encontrada' }
  }

  // Buscar todos os membros da mesma empresa
  const { data, error } = await supabase
    .from('perfis')
    .select('*')
    .eq('empresa_id', perfil.empresa_id)
    .order('created_at', { ascending: true })

  if (error) {
    return { error: error.message }
  }

  return { data }
}

/**
 * Convida um novo membro para a empresa.
 *
 * 🔐 CONTROLE DE ACESSO:
 * - Master: ✅ Pode convidar
 * - Admin:  ✅ Pode convidar
 * - Colaborador: ❌ Não pode
 *
 * @param formData - Formulário contendo 'email', 'nome' e 'role'
 * @returns { data: { success: true, message: string } } em sucesso ou { error: string } em falha
 */
export async function inviteTeamMember(
  formData: FormData
): Promise<{ data?: { success: true; message: string }; error?: string }> {
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
    // - Master: ✅ Pode convidar
    // - Admin:  ✅ Pode convidar
    // - Colaborador: ❌ Não pode
    // ============================================

    const { data: perfil, error: perfilError } = await supabase
      .from('perfis')
      .select('empresa_id, role')
      .eq('id', user.id)
      .single()

    if (perfilError || !perfil?.empresa_id) {
      return { error: 'Empresa não encontrada' }
    }

    // Validação de permissão ANTES de executar ação
    if (perfil.role !== 'master' && perfil.role !== 'admin_tenant') {
      return { error: 'Apenas Master e Admin podem convidar membros' }
    }

    const email = formData.get('email') as string
    const nome = formData.get('nome') as string
    const role = formData.get('role') as 'admin_tenant' | 'colaborador'

    if (!email || !nome) {
      return { error: 'Email e nome são obrigatórios' }
    }

    // Validar role
    if (role !== 'admin_tenant' && role !== 'colaborador') {
      return { error: 'Role inválido' }
    }

    // Verificar se o email já existe na empresa
    const { data: existing } = await supabase
      .from('perfis')
      .select('id')
      .eq('email', email)
      .eq('empresa_id', perfil.empresa_id)
      .single()

    if (existing) {
      return { error: 'Este email já está cadastrado na empresa' }
    }

    // Criar convite na tabela auditoria (para rastreamento)
    await supabase.from('auditoria').insert({
      empresa_id: perfil.empresa_id,
      usuario_id: user.id,
      acao: 'INVITE_SENT',
      detalhes: `Convite enviado para ${email} (${nome}) com role ${role}`,
    })

    revalidatePath('/dashboard/team')
    return {
      data: {
        success: true,
        message: `Convite enviado para ${email}. (Nota: Implementação de email pendente)`,
      },
    }
  } catch (error) {
    console.error('[inviteTeamMember]', error)
    return { error: 'Erro ao convidar membro' }
  }
}

// ============================================
// 🔐 CONTROLE DE ACESSO POR ROLE:
// Apenas MASTER pode alterar roles de outros usuários
// Admin NÃO pode alterar roles (hierarquia de permissões)
// ============================================

// Atualizar role de um membro
export async function updateMemberRole(memberId: string, newRole: string) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Não autenticado' }
  }

  // Verificar permissão (apenas master pode alterar roles)
  const { data: perfil } = await supabase
    .from('perfis')
    .select('empresa_id, role')
    .eq('id', user.id)
    .single()

  if (!perfil?.empresa_id) {
    return { error: 'Empresa não encontrada' }
  }

  // 🔒 Hierarquia de permissões:
  // Master > Admin_Tenant > Colaborador
  // Master pode alterar qualquer role
  // Admin_Tenant pode alterar roles dentro da empresa (exceto criar Masters)
  if (perfil.role !== 'master' && perfil.role !== 'admin_tenant') {
    return { error: 'Sem permissão para alterar roles' }
  }

  // Validar role
  if (
    newRole !== 'master' &&
    newRole !== 'admin_tenant' &&
    newRole !== 'colaborador'
  ) {
    return { error: 'Role inválido' }
  }

  // Admin Tenant não pode criar Masters (apenas Master pode)
  if (perfil.role === 'admin_tenant' && newRole === 'master') {
    return { error: 'Apenas Masters podem promover outros usuários a Master' }
  }

  // Não permitir alterar o próprio role
  if (memberId === user.id) {
    return { error: 'Você não pode alterar seu próprio role' }
  }

  // Verificar se o membro pertence à mesma empresa
  const { data: targetMember } = await supabase
    .from('perfis')
    .select('empresa_id')
    .eq('id', memberId)
    .single()

  if (targetMember?.empresa_id !== perfil.empresa_id) {
    return { error: 'Membro não encontrado na sua empresa' }
  }

  // Atualizar role
  const { error } = await supabase
    .from('perfis')
    .update({ role: newRole })
    .eq('id', memberId)

  if (error) {
    return { error: error.message }
  }

  // Registrar na auditoria
  await supabase.from('auditoria').insert({
    empresa_id: perfil.empresa_id,
    usuario_id: user.id,
    acao: 'MEMBER_ROLE_UPDATED',
    detalhes: `Role do membro ${memberId} alterado para ${newRole}`,
  })

  revalidatePath('/dashboard/team')
  return { data: { success: true } }
}

/**
 * Remove um membro da equipe.
 *
 * 🔐 PERMISSÕES:
 * - Apenas Master e Admin podem remover membros
 * - Admin não pode remover Master
 * - Ninguém pode remover a si mesmo
 *
 * CASCADE remove automaticamente conversas e mensagens do membro.
 *
 * @param memberId - ID do membro a ser removido
 * @returns { data: { success: true } } em sucesso ou { error: string } em falha
 */
export async function removeMember(
  memberId: string
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

    // Verificar permissão (apenas master e admin podem remover)
    const { data: perfil, error: perfilError } = await supabase
      .from('perfis')
      .select('empresa_id, role')
      .eq('id', user.id)
      .single()

    if (perfilError || !perfil?.empresa_id) {
      return { error: 'Empresa não encontrada' }
    }

    if (perfil.role !== 'master' && perfil.role !== 'admin_tenant') {
      return { error: 'Apenas Master e Admin podem remover membros' }
    }

    // Não permitir remover a si mesmo
    if (memberId === user.id) {
      return { error: 'Você não pode remover a si mesmo' }
    }

    // Verificar se o membro pertence à mesma empresa
    const { data: targetMember, error: targetError } = await supabase
      .from('perfis')
      .select('empresa_id, role')
      .eq('id', memberId)
      .single()

    if (
      targetError ||
      !targetMember ||
      targetMember?.empresa_id !== perfil.empresa_id
    ) {
      return { error: 'Membro não encontrado na sua empresa' }
    }

    // Não permitir que admin remova master
    if (perfil.role === 'admin_tenant' && targetMember.role === 'master') {
      return { error: 'Admin não pode remover o Master' }
    }

    // Registrar na auditoria antes de remover
    await supabase.from('auditoria').insert({
      empresa_id: perfil.empresa_id,
      usuario_id: user.id,
      acao: 'MEMBER_REMOVED',
      detalhes: `Membro ${memberId} (role: ${targetMember.role}) removido da empresa`,
    })

    // Remover membro (CASCADE irá remover suas conversas/mensagens)
    const { error: deleteError } = await supabase
      .from('perfis')
      .delete()
      .eq('id', memberId)

    if (deleteError) {
      return { error: deleteError.message }
    }

    revalidatePath('/dashboard/team')
    return { data: { success: true } }
  } catch (error) {
    console.error('[removeMember]', error)
    return { error: 'Erro ao remover membro' }
  }
}

// Obter estatísticas da equipe
export async function getTeamStats(): Promise<{
  data?: {
    total: number
    masters: number
    admins: number
    colaboradores: number
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

  const { data: members } = await supabase
    .from('perfis')
    .select('role')
    .eq('empresa_id', perfil.empresa_id)

  if (!members) {
    return { data: { total: 0, masters: 0, admins: 0, colaboradores: 0 } }
  }

  const stats = {
    total: members.length,
    masters: members.filter((m) => m.role === 'master').length,
    admins: members.filter((m) => m.role === 'admin_tenant').length,
    colaboradores: members.filter((m) => m.role === 'colaborador').length,
  }

  return { data: stats }
}

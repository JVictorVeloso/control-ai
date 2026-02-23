'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function setupUserRole(role: 'admin_tenant') {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Não autenticado' }
  }

  // Buscar perfil atual
  const { data: perfil } = await supabase
    .from('perfis')
    .select('empresa_id, role')
    .eq('id', user.id)
    .single()

  if (!perfil?.empresa_id) {
    return { error: 'Empresa não encontrada' }
  }

  // 🔒 Validar role - apenas permitir promoção a admin_tenant
  // Promoção a master requer ação de outro master
  if (role !== 'admin_tenant') {
    return {
      error: 'Apenas a promoção para Admin Tenant é permitida via setup',
    }
  }

  // Apenas colaboradores podem usar o setup
  if (perfil.role !== 'colaborador') {
    return { error: 'Apenas colaboradores podem usar o setup inicial' }
  }

  // Atualizar role
  const { error } = await supabase
    .from('perfis')
    .update({ role: role })
    .eq('id', user.id)

  if (error) {
    return { error: error.message }
  }

  // Registrar na auditoria
  await supabase.from('auditoria').insert({
    empresa_id: perfil.empresa_id,
    usuario_id: user.id,
    acao: 'ROLE_SETUP',
    detalhes: `Usuário configurou role para ${role} (setup inicial)`,
  })

  revalidatePath('/')
  return { success: true }
}

export async function checkUserNeedsSetup() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { needsSetup: false }
  }

  const { data: perfil } = await supabase
    .from('perfis')
    .select('role')
    .eq('id', user.id)
    .single()

  // Se for colaborador, pode fazer setup para se promover
  const needsSetup = perfil?.role === 'colaborador'

  return { needsSetup, currentRole: perfil?.role }
}

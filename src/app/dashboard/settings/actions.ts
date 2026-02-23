'use server'

import { decrypt, encrypt, isEncrypted, maskString } from '@/lib/crypto'
import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

/**
 * Busca a API Key da empresa do usuário autenticado.
 *
 * Descriptografa automaticamente se a chave estiver criptografada.
 * RLS garante que apenas membros da empresa podem acessar sua API Key.
 *
 * @returns { data: { api_key_encrypted: string | null } } em sucesso ou { error: string } em falha
 *
 * @example
 * const result = await getApiKey()
 * if ('data' in result) {
 *   // API Key obtida com sucesso: result.data.api_key_encrypted
 * }
 */
export async function getApiKey(): Promise<{
  data?: { maskedKey: string | null; hasKey: boolean }
  error?: string
}> {
  try {
    // ========================================
    // PASSO 1: Criar cliente Supabase
    // ========================================
    const supabase = await createClient()

    // ========================================
    // PASSO 2: Verificar autenticação
    // ========================================
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return { error: 'Não autenticado' }
    }

    // ========================================
    // PASSO 3: Buscar contexto (empresa_id)
    // ========================================
    const { data: perfil, error: perfilError } = await supabase
      .from('perfis')
      .select('empresa_id, role')
      .eq('id', user.id)
      .single()

    if (perfilError || !perfil?.empresa_id) {
      return { error: 'Empresa não encontrada' }
    }

    // 🔒 Apenas Master e Admin Tenant podem ver a API Key
    if (perfil.role !== 'master' && perfil.role !== 'admin_tenant') {
      return { error: 'Sem permissão para acessar configurações de API Key' }
    }

    // ========================================
    // PASSO 4: Buscar API Key
    // ========================================
    // 🔒 RLS garante isolamento multi-tenant
    const { data, error } = await supabase
      .from('empresas')
      .select('api_key_encrypted')
      .eq('id', perfil.empresa_id)
      .single()

    if (error) {
      return { error: error.message }
    }

    // ========================================
    // PASSO 5: Retornar chave mascarada
    // ========================================
    if (data?.api_key_encrypted && isEncrypted(data.api_key_encrypted)) {
      const decrypted = decrypt(data.api_key_encrypted)
      return { data: { maskedKey: maskString(decrypted), hasKey: true } }
    }

    return { data: { maskedKey: null, hasKey: false } }
  } catch (error) {
    // ========================================
    // PASSO 6: Tratamento de erro global
    // ========================================
    console.error('[getApiKey]', error)
    return { error: 'Erro ao buscar API Key' }
  }
}

/**
 * Salva ou atualiza a API Key da empresa.
 *
 * Criptografa a chave com AES-256-GCM antes de salvar no banco.
 * Registra a ação na auditoria para rastreamento.
 *
 * @param formData - Formulário contendo 'api_key'
 * @returns { data: { success: true } } em sucesso ou { error: string } em falha
 */
export async function saveApiKey(
  formData: FormData
): Promise<{ data?: { success: true }; error?: string }> {
  try {
    // ========================================
    // PASSO 1: Criar cliente Supabase
    // ========================================
    const supabase = await createClient()

    // ========================================
    // PASSO 2: Verificar autenticação
    // ========================================
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return { error: 'Não autenticado' }
    }

    // ========================================
    // PASSO 3: Buscar contexto (empresa_id)
    // ========================================
    const { data: perfil, error: perfilError } = await supabase
      .from('perfis')
      .select('empresa_id, role')
      .eq('id', user.id)
      .single()

    if (perfilError || !perfil?.empresa_id) {
      return { error: 'Empresa não encontrada' }
    }

    // 🔒 Apenas Master e Admin Tenant podem alterar a API Key
    if (perfil.role !== 'master' && perfil.role !== 'admin_tenant') {
      return { error: 'Sem permissão para alterar API Key' }
    }

    // ========================================
    // PASSO 4: Validar API Key
    // ========================================
    const apiKey = formData.get('api_key') as string

    if (!apiKey || apiKey.trim().length === 0) {
      return { error: 'API Key é obrigatória' }
    }

    // ========================================
    // PASSO 5: Criptografar API Key
    // ========================================
    const encryptedKey = encrypt(apiKey)

    // ========================================
    // PASSO 6: Salvar no banco
    // ========================================
    // 🔒 RLS garante que apenas membros da empresa podem atualizar
    const { error: updateError } = await supabase
      .from('empresas')
      .update({ api_key_encrypted: encryptedKey })
      .eq('id', perfil.empresa_id)

    if (updateError) {
      return { error: updateError.message }
    }

    // ========================================
    // PASSO 7: Registrar auditoria
    // ========================================
    await supabase.from('auditoria').insert({
      empresa_id: perfil.empresa_id,
      usuario_id: user.id,
      acao: 'api_key_updated',
      detalhes: 'API Key atualizada (criptografada)',
    })

    // ========================================
    // PASSO 8: Revalidar cache e retornar
    // ========================================
    revalidatePath('/dashboard/settings')
    return { data: { success: true } }
  } catch (error) {
    // ========================================
    // Tratamento de erro global
    // ========================================
    console.error('[saveApiKey]', error)
    return { error: 'Erro ao salvar API Key' }
  }
}

/**
 * Remove a API Key da empresa.
 *
 * Define api_key_encrypted como null no banco de dados.
 * Registra a ação na auditoria para rastreamento.
 *
 * @returns { data: { success: true } } em sucesso ou { error: string } em falha
 */
export async function clearApiKey(): Promise<{
  data?: { success: true }
  error?: string
}> {
  try {
    // ========================================
    // PASSO 1: Criar cliente Supabase
    // ========================================
    const supabase = await createClient()

    // ========================================
    // PASSO 2: Verificar autenticação
    // ========================================
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return { error: 'Não autenticado' }
    }

    // ========================================
    // PASSO 3: Buscar contexto (empresa_id + role)
    // ========================================
    const { data: perfil, error: perfilError } = await supabase
      .from('perfis')
      .select('empresa_id, role')
      .eq('id', user.id)
      .single()

    if (perfilError || !perfil?.empresa_id) {
      return { error: 'Empresa não encontrada' }
    }

    // 🔒 Apenas Master e Admin Tenant podem remover a API Key
    if (perfil.role !== 'master' && perfil.role !== 'admin_tenant') {
      return { error: 'Sem permissão para remover API Key' }
    }

    // ========================================
    // PASSO 4: Remover API Key
    // ========================================
    // 🔒 RLS garante que apenas membros da empresa podem remover
    const { error: deleteError } = await supabase
      .from('empresas')
      .update({ api_key_encrypted: null })
      .eq('id', perfil.empresa_id)

    if (deleteError) {
      return { error: deleteError.message }
    }

    // ========================================
    // PASSO 5: Registrar auditoria
    // ========================================
    await supabase.from('auditoria').insert({
      empresa_id: perfil.empresa_id,
      usuario_id: user.id,
      acao: 'api_key_removed',
      detalhes: 'API Key removida',
    })

    // ========================================
    // PASSO 6: Revalidar cache e retornar
    // ========================================
    revalidatePath('/dashboard/settings')
    return { data: { success: true } }
  } catch (error) {
    // ========================================
    // Tratamento de erro global
    // ========================================
    console.error('[clearApiKey]', error)
    return { error: 'Erro ao remover API Key' }
  }
}

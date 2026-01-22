'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createWorkspace(formData: FormData) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const empresaNome = formData.get('empresa_nome') as string

  if (!empresaNome || empresaNome.trim().length === 0) {
    return { error: 'Nome da empresa é obrigatório' }
  }

  // Gerar slug automaticamente a partir do nome
  const slug = empresaNome
    .trim()
    .toLowerCase()
    .normalize('NFD') // Decompor caracteres acentuados
    .replace(/[\u0300-\u036f]/g, '') // Remover acentos
    .replace(/[^a-z0-9\s-]/g, '') // Remover caracteres especiais
    .replace(/\s+/g, '-') // Substituir espaços por hífens
    .replace(/-+/g, '-') // Remover hífens duplicados
    .replace(/^-|-$/g, '') // Remover hífens no início/fim

  // Inserir a nova empresa
  const { data: empresa, error: empresaError } = await supabase
    .from('empresas')
    .insert({
      nome: empresaNome.trim(),
      slug: slug,
    })
    .select()
    .single()

  if (empresaError || !empresa) {
    return { error: 'Erro ao criar empresa: ' + empresaError?.message }
  }

  // Atualizar o perfil do usuário com o empresa_id
  const { error: perfilError } = await supabase
    .from('perfis')
    .update({ empresa_id: empresa.id })
    .eq('id', user.id)

  if (perfilError) {
    return { error: 'Erro ao atualizar perfil: ' + perfilError.message }
  }

  revalidatePath('/dashboard')
  redirect('/dashboard')
}

export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/login')
}

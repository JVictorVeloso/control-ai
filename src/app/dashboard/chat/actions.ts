'use server'

import type { AgenteIA, Conversa, Mensagem } from '@/types/database'
import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

/**
 * Cria uma nova conversa para o usuário autenticado.
 *
 * RLS garante que a conversa é criada apenas para a empresa do usuário.
 *
 * @param titulo - Título da conversa (opcional, padrão: "Nova Conversa")
 * @returns { data: Conversa } em sucesso ou { error: string } em falha
 *
 * @example
 * const result = await createConversa('Minha conversa')
 * if ('data' in result) {
 *   // Conversa criada com sucesso: result.data.id
 * }
 */
export async function createConversa(
  titulo?: string,
  agenteId?: string
): Promise<{ data?: Conversa; error?: string }> {
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
      .select('empresa_id')
      .eq('id', user.id)
      .single()

    if (perfilError || !perfil?.empresa_id) {
      return { error: 'Empresa não encontrada' }
    }

    // ========================================
    // PASSO 4: Criar conversa
    // ========================================
    // 🔒 RLS garante isolamento multi-tenant
    const { data, error } = await supabase
      .from('conversas')
      .insert({
        empresa_id: perfil.empresa_id,
        usuario_id: user.id,
        titulo: titulo || 'Nova Conversa',
        agente_id: agenteId || null,
      })
      .select()
      .single()

    if (error) {
      return { error: error.message }
    }

    // ========================================
    // PASSO 5: Revalidar cache e retornar
    // ========================================
    revalidatePath('/dashboard/chat')
    return { data }
  } catch (error) {
    // ========================================
    // Tratamento de erro global
    // ========================================
    console.error('[createConversa]', error)
    return { error: 'Erro ao criar conversa' }
  }
}

// ============================================
// 🔒 SEGREGAÇÃO MULTI-TENANT:
// RLS garante que cada empresa só vê suas próprias conversas
// O filtro por empresa_id é AUTOMÁTICO no banco de dados
// ============================================

/**
 * Lista todas as conversas do usuário autenticado.
 *
 * RLS filtra automaticamente por empresa_id no banco.
 * Ordena por data de criação (mais recentes primeiro).
 *
 * @returns { data: Conversa[] } em sucesso ou { error: string } em falha
 */
export async function getConversas(): Promise<{
  data?: Conversa[]
  error?: string
}> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Não autenticado' }
  }

  const { data, error } = await supabase
    .from('conversas')
    .select('*')
    .eq('usuario_id', user.id)
    .order('created_at', { ascending: false })

  if (error) {
    return { error: error.message }
  }

  return { data: data as Conversa[] }
}

// Buscar mensagens de uma conversa
export async function getMensagens(
  conversaId: string
): Promise<{ data?: Mensagem[]; error?: string }> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Não autenticado' }
  }

  // Verificar se a conversa pertence ao usuário
  const { data: conversa } = await supabase
    .from('conversas')
    .select('usuario_id')
    .eq('id', conversaId)
    .single()

  if (!conversa || conversa.usuario_id !== user.id) {
    return { error: 'Conversa não encontrada' }
  }

  const { data, error } = await supabase
    .from('mensagens')
    .select('*')
    .eq('conversa_id', conversaId)
    .order('created_at', { ascending: true })

  if (error) {
    return { error: error.message }
  }

  return { data: data as Mensagem[] }
}

// Salvar uma mensagem do usuário
export async function saveMensagem(
  conversaId: string,
  role: 'user' | 'assistant' | 'system',
  content: string
): Promise<{ data?: Mensagem; error?: string }> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Não autenticado' }
  }

  // Verificar se a conversa pertence ao usuário
  const { data: conversa } = await supabase
    .from('conversas')
    .select('usuario_id, empresa_id')
    .eq('id', conversaId)
    .single()

  if (!conversa || conversa.usuario_id !== user.id) {
    return { error: 'Conversa não encontrada' }
  }

  const { data, error } = await supabase
    .from('mensagens')
    .insert({
      conversa_id: conversaId,
      role,
      conteudo: content,
    })
    .select()
    .single()

  if (error) {
    return { error: error.message }
  }

  // Log de auditoria
  await supabase.from('auditoria').insert({
    empresa_id: conversa.empresa_id,
    usuario_id: user.id,
    acao: 'chat_message',
    detalhes: JSON.stringify({ role, content_length: content.length }),
  })

  revalidatePath('/dashboard/chat')
  return { data }
}

// Enviar mensagem e obter resposta da IA
export async function sendChatMessage(conversaId: string, userMessage: string) {
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

  // Buscar API Key da empresa
  const { data: empresa } = await supabase
    .from('empresas')
    .select('api_key_encrypted')
    .eq('id', perfil.empresa_id)
    .single()

  // Buscar agente vinculado à conversa (se houver)
  const { data: conversa } = await supabase
    .from('conversas')
    .select('agente_id')
    .eq('id', conversaId)
    .single()

  let systemPrompt: string | undefined
  if (conversa?.agente_id) {
    const { data: agente } = await supabase
      .from('agentes_ia')
      .select('prompt, modelo')
      .eq('id', conversa.agente_id)
      .single()

    if (agente?.prompt) {
      systemPrompt = agente.prompt
    }
  }

  // Salvar mensagem do usuário
  const userMsgResult = await saveMensagem(conversaId, 'user', userMessage)

  if (userMsgResult.error) {
    return { error: userMsgResult.error }
  }

  // Se não houver API Key configurada, retornar mensagem informativa
  if (!empresa?.api_key_encrypted) {
    const assistantMessage =
      'Para utilizar o chat com IA, você precisa configurar uma API Key nas Configurações. Vá em Configurações > BYOK para adicionar sua chave do OpenAI ou Anthropic.'

    await saveMensagem(conversaId, 'assistant', assistantMessage)

    revalidatePath('/dashboard/chat')
    return {
      data: {
        role: 'assistant',
        content: assistantMessage,
      },
    }
  }

  // Descriptografar API Key antes de usar
  let apiKey: string
  try {
    const { decrypt, isEncrypted } = await import('@/lib/crypto')
    apiKey = isEncrypted(empresa.api_key_encrypted)
      ? decrypt(empresa.api_key_encrypted)
      : empresa.api_key_encrypted
  } catch {
    return { error: 'Erro ao processar API Key' }
  }

  // Buscar histórico da conversa para contexto
  const { data: mensagens } = await getMensagens(conversaId)

  // Detectar qual API usar baseado na chave
  let responseText: string
  try {
    if (apiKey.startsWith('sk-') && !apiKey.startsWith('sk-ant-')) {
      // OpenAI
      responseText = await callOpenAI(
        apiKey,
        'gpt-4o-mini',
        mensagens || [],
        systemPrompt
      )
    } else if (apiKey.startsWith('sk-ant-')) {
      // Anthropic
      responseText = await callAnthropic(
        apiKey,
        'claude-3-5-sonnet-20241022',
        mensagens || [],
        systemPrompt
      )
    } else if (apiKey.startsWith('AIza')) {
      // Google Gemini
      responseText = await callGemini(
        apiKey,
        'gemini-2.5-flash',
        mensagens || [],
        systemPrompt
      )
    } else {
      // Fallback para Gemini se não identificar
      responseText = await callGemini(
        apiKey,
        'gemini-2.5-flash',
        mensagens || [],
        systemPrompt
      )
    }

    // Salvar resposta da IA
    await saveMensagem(conversaId, 'assistant', responseText)

    revalidatePath('/dashboard/chat')
    return {
      data: {
        role: 'assistant',
        content: responseText,
      },
    }
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : 'Erro ao chamar API da IA'
    return { error: errorMessage }
  }
}

// Função auxiliar para chamar Google Gemini
async function callGemini(
  apiKey: string,
  model: string,
  historico: Mensagem[],
  systemPrompt?: string
): Promise<string> {
  // Converter histórico completo para o formato do Gemini
  const contents = historico.map((msg) => ({
    role: msg.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: msg.conteudo }],
  }))

  // Garantir que há pelo menos uma mensagem
  if (contents.length === 0) {
    contents.push({ role: 'user', parts: [{ text: 'Olá' }] })
  }

  const body: Record<string, unknown> = { contents }
  if (systemPrompt) {
    body.systemInstruction = { parts: [{ text: systemPrompt }] }
  }

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    }
  )

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error?.message || 'Erro ao chamar Google Gemini')
  }

  const data = await response.json()
  return data.candidates[0].content.parts[0].text
}

// Função auxiliar para chamar OpenAI
async function callOpenAI(
  apiKey: string,
  model: string,
  historico: Mensagem[],
  systemPrompt?: string
): Promise<string> {
  const messages: Array<{ role: string; content: string }> = []

  if (systemPrompt) {
    messages.push({ role: 'system', content: systemPrompt })
  }

  messages.push(
    ...historico.map((msg) => ({
      role: msg.role,
      content: msg.conteudo,
    }))
  )

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages,
      temperature: 0.7,
      max_tokens: 2000,
    }),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error?.message || 'Erro ao chamar OpenAI')
  }

  const data = await response.json()
  return data.choices[0].message.content
}

// Função auxiliar para chamar Anthropic
async function callAnthropic(
  apiKey: string,
  model: string,
  historico: Mensagem[],
  systemPrompt?: string
): Promise<string> {
  const messages = historico
    .filter((msg) => msg.role !== 'system')
    .map((msg) => ({
      role: msg.role,
      content: msg.conteudo,
    }))

  const body: Record<string, unknown> = {
    model,
    messages,
    max_tokens: 2000,
  }
  if (systemPrompt) {
    body.system = systemPrompt
  }

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify(body),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error?.message || 'Erro ao chamar Anthropic')
  }

  const data = await response.json()
  return data.content[0].text
}

/**
 * Lista agentes disponíveis para o usuário selecionar no chat.
 */
export async function getAgentesForChat(): Promise<{
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
    .order('nome', { ascending: true })

  if (error) return { error: error.message }

  return { data: data as AgenteIA[] }
}

/**
 * Deleta uma conversa do usuário autenticado.
 *
 * Cascade DELETE remove automaticamente todas as mensagens relacionadas.
 * RLS garante que apenas o dono da conversa pode deletá-la.
 *
 * @param conversaId - ID da conversa a ser deletada
 * @returns { data: { success: true } } em sucesso ou { error: string } em falha
 */
export async function deleteConversa(
  conversaId: string
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
    // PASSO 3: Validar parâmetro
    // ========================================
    if (!conversaId || conversaId.trim().length === 0) {
      return { error: 'ID da conversa inválido' }
    }

    // ========================================
    // PASSO 4: Deletar conversa
    // ========================================
    // 🔒 RLS garante que apenas o dono pode deletar
    // CASCADE remove automaticamente as mensagens
    const { error: deleteError } = await supabase
      .from('conversas')
      .delete()
      .eq('id', conversaId)
      .eq('usuario_id', user.id)

    if (deleteError) {
      return { error: deleteError.message }
    }

    // ========================================
    // PASSO 5: Revalidar cache e retornar
    // ========================================
    revalidatePath('/dashboard/chat')
    return { data: { success: true } }
  } catch (error) {
    // ========================================
    // Tratamento de erro global
    // ========================================
    console.error('[deleteConversa]', error)
    return { error: 'Erro ao deletar conversa' }
  }
}

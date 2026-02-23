'use client'

import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import type { AgenteIA, Conversa, Mensagem } from '@/types/database'
import {
  AlertCircle,
  Bot,
  ChevronDown,
  ChevronLeft,
  Loader2,
  MessageSquare,
  MessageSquarePlus,
  PanelLeftOpen,
  Send,
  Sparkles,
  Trash2,
  User,
} from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import {
  createConversa,
  deleteConversa,
  getAgentesForChat,
  getConversas,
  getMensagens,
  sendChatMessage,
} from './actions'

export default function ChatPage() {
  const [conversas, setConversas] = useState<Conversa[]>([])
  const [conversaAtual, setConversaAtual] = useState<string | null>(null)
  const [messages, setMessages] = useState<Mensagem[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loadingConversas, setLoadingConversas] = useState(true)
  const [showSidebar, setShowSidebar] = useState(false)
  const [agentes, setAgentes] = useState<AgenteIA[]>([])
  const [selectedAgente, setSelectedAgente] = useState<string>('')
  const [showAgentPicker, setShowAgentPicker] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Carregar conversas e agentes ao montar
  useEffect(() => {
    loadConversas()
    loadAgentes()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Carregar mensagens quando mudar a conversa
  useEffect(() => {
    if (conversaAtual) {
      loadMensagens(conversaAtual)
    } else {
      setMessages([])
    }
  }, [conversaAtual])

  // Auto-scroll para a última mensagem
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const loadConversas = async () => {
    setLoadingConversas(true)
    const result = await getConversas()
    if (result.error) {
      setError(result.error)
    } else if (result.data) {
      setConversas(result.data)
      if (result.data.length > 0 && !conversaAtual) {
        setConversaAtual(result.data[0].id)
      }
    }
    setLoadingConversas(false)
  }

  const loadAgentes = async () => {
    const result = await getAgentesForChat()
    if (result.data) {
      setAgentes(result.data)
    }
  }

  const loadMensagens = async (conversaId: string) => {
    const result = await getMensagens(conversaId)
    if (result.error) {
      setError(result.error)
    } else if (result.data) {
      setMessages(result.data)
    }
  }

  const handleNovaConversa = async () => {
    setError(null)
    const agentId = selectedAgente || undefined
    const agentName = agentes.find((a) => a.id === agentId)?.nome
    const titulo = agentName ? `Chat com ${agentName}` : 'Nova Conversa'
    const result = await createConversa(titulo, agentId)

    if (result.error) {
      setError(result.error)
    } else if (result.data) {
      await loadConversas()
      setConversaAtual(result.data.id)
      setShowAgentPicker(false)
    }
  }

  const handleDeleteConversa = async (conversaId: string) => {
    if (!confirm('Deseja realmente excluir esta conversa?')) return

    setError(null)
    const result = await deleteConversa(conversaId)

    if (result.error) {
      setError(result.error)
    } else {
      await loadConversas()
      if (conversaAtual === conversaId) {
        setConversaAtual(conversas[0]?.id || null)
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!input.trim() || isLoading) return

    let activeConversaId = conversaAtual

    if (!activeConversaId) {
      // Criar conversa automaticamente
      const agentId = selectedAgente || undefined
      const agentName = agentes.find((a) => a.id === agentId)?.nome
      const titulo = agentName ? `Chat com ${agentName}` : 'Nova Conversa'
      const result = await createConversa(titulo, agentId)
      if (result.error) {
        setError(result.error)
        return
      }
      if (result.data) {
        activeConversaId = result.data.id
        setConversaAtual(activeConversaId)
        await loadConversas()
      }
    }

    const userMessage = input.trim()
    setInput('')
    setIsLoading(true)
    setError(null)

    // Adicionar mensagem do usuário localmente (optimistic update)
    const tempUserMsg: Mensagem = {
      id: 'temp-' + Date.now(),
      conversa_id: activeConversaId!,
      role: 'user',
      conteudo: userMessage,
      created_at: new Date().toISOString(),
    }
    setMessages((prev) => [...prev, tempUserMsg])

    try {
      const result = await sendChatMessage(activeConversaId!, userMessage)

      if (result.error) {
        setError(result.error)
        // Remover mensagem temporária em caso de erro
        setMessages((prev) => prev.filter((m) => m.id !== tempUserMsg.id))
      } else {
        // Recarregar mensagens para pegar as atualizadas do banco
        await loadMensagens(activeConversaId!)
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erro ao enviar mensagem')
      setMessages((prev) => prev.filter((m) => m.id !== tempUserMsg.id))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex h-[calc(100vh-112px)] md:h-screen bg-linear-to-br from-gray-50 to-blue-50 dark:from-zinc-950 dark:to-blue-950/20 relative">
      {/* Mobile overlay */}
      {showSidebar && (
        <div
          className="md:hidden fixed inset-0 bg-black/40 z-30"
          onClick={() => setShowSidebar(false)}
        />
      )}

      {/* Sidebar com lista de conversas */}
      <aside
        className={`${showSidebar ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 fixed md:relative z-40 md:z-auto w-72 h-full border-r border-gray-200 dark:border-zinc-800 bg-white/95 dark:bg-zinc-900/95 md:bg-white/80 md:dark:bg-zinc-900/80 backdrop-blur-sm flex flex-col transition-transform duration-200`}
      >
        {/* Mobile close */}
        <button
          className="md:hidden absolute top-3 right-3 p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-zinc-800 z-10"
          onClick={() => setShowSidebar(false)}
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <div className="p-4 border-b border-gray-200 dark:border-zinc-800">
          <div className="flex items-center gap-2 mb-4">
            <MessageSquare className="h-5 w-5 text-blue-600" />
            <h2 className="font-bold bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Conversas
            </h2>
            <Badge variant="info" className="ml-auto text-xs">
              {conversas.length}
            </Badge>
          </div>
          <Button
            onClick={handleNovaConversa}
            className="w-full gap-2 bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            <MessageSquarePlus className="h-4 w-4" />
            Nova Conversa
          </Button>

          {/* Seletor de Agente */}
          {agentes.length > 0 && (
            <div className="mt-3">
              <button
                onClick={() => setShowAgentPicker(!showAgentPicker)}
                className="w-full flex items-center justify-between gap-2 px-3 py-2 text-xs rounded-lg border border-gray-200 dark:border-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <Bot className="h-3.5 w-3.5 text-blue-600 shrink-0" />
                  <span className="truncate text-muted-foreground">
                    {selectedAgente
                      ? agentes.find((a) => a.id === selectedAgente)?.nome
                      : 'Sem agente (padrão)'}
                  </span>
                </div>
                <ChevronDown
                  className={`h-3.5 w-3.5 text-muted-foreground shrink-0 transition-transform ${showAgentPicker ? 'rotate-180' : ''}`}
                />
              </button>
              {showAgentPicker && (
                <div className="mt-1 rounded-lg border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 shadow-lg overflow-hidden">
                  <button
                    onClick={() => {
                      setSelectedAgente('')
                      setShowAgentPicker(false)
                    }}
                    className={`w-full text-left px-3 py-2 text-xs hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors ${
                      !selectedAgente
                        ? 'bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-300 font-medium'
                        : 'text-muted-foreground'
                    }`}
                  >
                    Sem agente (padrão)
                  </button>
                  {agentes.map((agente) => (
                    <button
                      key={agente.id}
                      onClick={() => {
                        setSelectedAgente(agente.id)
                        setShowAgentPicker(false)
                      }}
                      className={`w-full text-left px-3 py-2 text-xs hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors border-t border-gray-100 dark:border-zinc-800 ${
                        selectedAgente === agente.id
                          ? 'bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-300 font-medium'
                          : 'text-muted-foreground'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Bot className="h-3.5 w-3.5 shrink-0" />
                        <span className="truncate">{agente.nome}</span>
                      </div>
                      <p className="text-[10px] opacity-60 mt-0.5 ml-5.5">
                        {agente.modelo}
                      </p>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        <ScrollArea className="flex-1">
          {loadingConversas ? (
            <div className="flex items-center justify-center p-8">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : conversas.length === 0 ? (
            <div className="p-4 text-center text-sm text-muted-foreground">
              <Bot className="h-12 w-12 text-blue-300 dark:text-blue-700 mx-auto mb-3" />
              <p className="font-medium">Nenhuma conversa ainda</p>
              <p className="text-xs mt-1">
                Clique em &quot;Nova Conversa&quot; para começar
              </p>
            </div>
          ) : (
            <div className="p-2 space-y-1">
              {conversas.map((conversa) => (
                <div
                  key={conversa.id}
                  className={`group flex items-center justify-between gap-2 p-3 rounded-xl cursor-pointer transition-all ${
                    conversaAtual === conversa.id
                      ? 'bg-linear-to-r from-blue-50 to-purple-50 dark:from-blue-950/50 dark:to-purple-950/50 border-2 border-blue-200 dark:border-blue-800 shadow-sm'
                      : 'hover:bg-gray-50 dark:hover:bg-zinc-800/50 border-2 border-transparent'
                  }`}
                  onClick={() => {
                    setConversaAtual(conversa.id)
                    setShowSidebar(false)
                  }}
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {conversa.titulo || 'Conversa sem título'}
                    </p>
                    {conversa.agente_id && (
                      <p className="text-[10px] text-blue-600 dark:text-blue-400 flex items-center gap-1">
                        <Bot className="h-2.5 w-2.5" />
                        {agentes.find((a) => a.id === conversa.agente_id)
                          ?.nome || 'Agente'}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground">
                      {new Date(conversa.created_at).toLocaleDateString(
                        'pt-BR'
                      )}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDeleteConversa(conversa.id)
                    }}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </aside>

      {/* Área principal do chat */}
      <div className="flex-1 flex flex-col">
        {/* Header com Gradiente */}
        <div className="relative overflow-hidden border-b border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
          <div className="absolute inset-0 bg-linear-to-r from-blue-500/5 to-purple-500/5"></div>
          <div className="relative px-4 md:px-6 py-3 md:py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 md:gap-3">
                <button
                  className="md:hidden p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-zinc-800"
                  onClick={() => setShowSidebar(true)}
                >
                  <PanelLeftOpen className="h-5 w-5" />
                </button>
                <div className="p-2 bg-linear-to-br from-blue-600 to-purple-600 rounded-xl">
                  <Sparkles className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Chat IA
                  </h1>
                  <p className="text-xs text-muted-foreground">
                    {conversaAtual
                      ? (() => {
                          const conversa = conversas.find(
                            (c) => c.id === conversaAtual
                          )
                          const agente = conversa?.agente_id
                            ? agentes.find((a) => a.id === conversa.agente_id)
                            : null
                          return agente
                            ? `Agente: ${agente.nome} · ${agente.modelo}`
                            : 'Converse com a inteligência artificial'
                        })()
                      : 'Selecione ou crie uma conversa'}
                  </p>
                </div>
              </div>
              {conversaAtual && (
                <Badge variant="success" className="gap-1.5">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  Online
                </Badge>
              )}
            </div>
          </div>
        </div>

        {/* Alerta de erro */}
        {error && (
          <div className="mx-6 mt-4 p-4 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-lg flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium text-red-900 dark:text-red-200">
                Erro
              </p>
              <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setError(null)}
              className="text-red-600 hover:text-red-700"
            >
              Fechar
            </Button>
          </div>
        )}

        {/* Área de Mensagens */}
        <ScrollArea className="flex-1 px-4">
          <div className="max-w-3xl mx-auto py-6 space-y-6">
            {!conversaAtual ? (
              <div className="flex flex-col items-center justify-center h-full text-center p-12">
                <div className="relative mb-6">
                  <div className="absolute inset-0 bg-linear-to-r from-blue-600 to-purple-600 blur-3xl opacity-20"></div>
                  <div className="relative p-6 bg-linear-to-br from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 rounded-3xl border-2 border-blue-200 dark:border-blue-800">
                    <Bot className="h-16 w-16 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
                <h2 className="text-2xl font-bold mb-2 bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Bem-vindo ao Chat IA
                </h2>
                <p className="text-muted-foreground mb-6 max-w-md">
                  Crie uma nova conversa para começar a interagir com a
                  inteligência artificial. Suas conversas são privadas e
                  seguras.
                </p>
                <Button
                  onClick={handleNovaConversa}
                  className="gap-2 bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  <MessageSquarePlus className="h-4 w-4" />
                  Criar Primeira Conversa
                </Button>
              </div>
            ) : messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center p-8">
                <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-2xl mb-4">
                  <Bot className="h-12 w-12 text-blue-600 dark:text-blue-400" />
                </div>
                <p className="text-muted-foreground font-medium">
                  Envie uma mensagem para começar a conversa
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  Digite sua pergunta ou solicitação abaixo
                </p>
              </div>
            ) : (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-4 ${
                    message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                  }`}
                >
                  {/* Avatar */}
                  <Avatar className="h-10 w-10 shrink-0">
                    <AvatarFallback
                      className={
                        message.role === 'assistant'
                          ? 'bg-linear-to-br from-blue-600 to-purple-600 text-white'
                          : 'bg-linear-to-br from-gray-600 to-gray-700 text-white'
                      }
                    >
                      {message.role === 'assistant' ? (
                        <Bot className="h-4 w-4" />
                      ) : (
                        <User className="h-4 w-4" />
                      )}
                    </AvatarFallback>
                  </Avatar>

                  {/* Mensagem */}
                  <div
                    className={`flex-1 ${
                      message.role === 'user' ? 'text-right' : 'text-left'
                    }`}
                  >
                    <div
                      className={`inline-block rounded-2xl px-4 py-3 max-w-[85%] shadow-sm ${
                        message.role === 'user'
                          ? 'bg-linear-to-r from-blue-600 to-purple-600 text-white'
                          : 'bg-white dark:bg-zinc-800 border-2 border-gray-200 dark:border-zinc-700 text-gray-900 dark:text-white'
                      }`}
                    >
                      {message.role === 'assistant' ? (
                        <div className="text-sm markdown-content">
                          <ReactMarkdown remarkPlugins={[remarkGfm]}>
                            {message.conteudo}
                          </ReactMarkdown>
                        </div>
                      ) : (
                        <p className="text-sm whitespace-pre-wrap wrap-break-word">
                          {message.conteudo}
                        </p>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 px-1">
                      {new Date(message.created_at).toLocaleTimeString(
                        'pt-BR',
                        {
                          hour: '2-digit',
                          minute: '2-digit',
                        }
                      )}
                    </p>
                  </div>
                </div>
              ))
            )}

            {/* Loading indicator */}
            {isLoading && (
              <div className="flex gap-4">
                <Avatar className="h-10 w-10 shrink-0">
                  <AvatarFallback className="bg-linear-to-br from-blue-600 to-purple-600 text-white">
                    <Bot className="h-5 w-5" />
                  </AvatarFallback>
                </Avatar>
                <div className="inline-block rounded-2xl px-4 py-3 bg-white dark:bg-zinc-800 border-2 border-gray-200 dark:border-zinc-700 shadow-sm">
                  <div className="flex gap-1.5">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce [animation-delay:0.2s]" />
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:0.4s]" />
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        {/* Input Fixo na Parte Inferior */}
        <div className="border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4">
          <form onSubmit={handleSubmit} className="max-w-3xl mx-auto">
            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={
                  conversaAtual
                    ? 'Digite sua mensagem...'
                    : 'Crie uma conversa para começar...'
                }
                disabled={isLoading}
                className="flex-1"
                autoFocus
              />
              <Button
                type="submit"
                disabled={isLoading || !input.trim()}
                size="icon"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground text-center mt-2">
              Pressione Enter para enviar
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}

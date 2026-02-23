'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ConfirmDialog } from '@/components/ui/confirm-dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Skeleton } from '@/components/ui/skeleton'
import { useToast } from '@/hooks/use-toast'
import type { AgenteIA } from '@/types/database'
import { Bot, Edit, Loader2, Plus, Sparkles, Trash2, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { createAgente, deleteAgente, getAgentes, updateAgente } from './actions'

const MODELOS_DISPONIVEIS = [
  { value: 'gpt-4o-mini', label: 'GPT-4o Mini', provider: 'OpenAI' },
  { value: 'gpt-4', label: 'GPT-4', provider: 'OpenAI' },
  {
    value: 'claude-3-5-sonnet-20241022',
    label: 'Claude 3.5 Sonnet',
    provider: 'Anthropic',
  },
  { value: 'gemini-2.5-flash', label: 'Gemini 2.5 Flash', provider: 'Google' },
]

export default function AgentesPage() {
  const { toast } = useToast()
  const [agentes, setAgentes] = useState<AgenteIA[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingAgente, setEditingAgente] = useState<AgenteIA | null>(null)
  const [saving, setSaving] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [deleteLoading, setDeleteLoading] = useState(false)

  const loadAgentes = async () => {
    setLoading(true)
    const result = await getAgentes()

    if (result.error) {
      toast({
        title: 'Erro ao carregar agentes',
        description: result.error,
        variant: 'destructive',
      })
    } else if (result.data) {
      setAgentes(result.data)
    }

    setLoading(false)
  }

  useEffect(() => {
    void loadAgentes()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSaving(true)

    const formData = new FormData(e.currentTarget)

    if (editingAgente) {
      const result = await updateAgente(editingAgente.id, formData)
      if (result.error) {
        toast({
          title: 'Erro ao atualizar agente',
          description: result.error,
          variant: 'destructive',
        })
      } else {
        toast({
          title: 'Agente atualizado!',
          description: 'As configurações do agente foram salvas.',
          variant: 'success',
        })
        setShowModal(false)
        setEditingAgente(null)
        await loadAgentes()
      }
    } else {
      const result = await createAgente(formData)
      if (result.error) {
        toast({
          title: 'Erro ao criar agente',
          description: result.error,
          variant: 'destructive',
        })
      } else {
        toast({
          title: 'Agente criado!',
          description: 'O novo agente de IA está pronto para uso.',
          variant: 'success',
        })
        setShowModal(false)
        await loadAgentes()
      }
    }

    setSaving(false)
  }

  const confirmDelete = async () => {
    if (!deleteId) return
    setDeleteLoading(true)

    const result = await deleteAgente(deleteId)
    if (result.error) {
      toast({
        title: 'Erro ao remover agente',
        description: result.error,
        variant: 'destructive',
      })
    } else {
      toast({
        title: 'Agente removido!',
        description: 'O agente foi removido com sucesso.',
        variant: 'success',
      })
      await loadAgentes()
    }

    setDeleteLoading(false)
    setDeleteId(null)
  }

  const openEdit = (agente: AgenteIA) => {
    setEditingAgente(agente)
    setShowModal(true)
  }

  const openCreate = () => {
    setEditingAgente(null)
    setShowModal(true)
  }

  const getModelLabel = (modelo: string) => {
    return MODELOS_DISPONIVEIS.find((m) => m.value === modelo)?.label || modelo
  }

  const getProviderBadge = (modelo: string) => {
    const m = MODELOS_DISPONIVEIS.find((mod) => mod.value === modelo)
    if (!m) return <Badge variant="secondary">{modelo}</Badge>

    const variants: Record<string, 'info' | 'purple' | 'success'> = {
      OpenAI: 'info',
      Anthropic: 'purple',
      Google: 'success',
    }

    return (
      <Badge variant={variants[m.provider] || 'secondary'}>{m.provider}</Badge>
    )
  }

  // Loading skeleton
  if (loading) {
    return (
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-5 w-80" />
          </div>
          <Skeleton className="h-10 w-36" />
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700"
            >
              <div className="space-y-3">
                <Skeleton className="h-12 w-12 rounded-xl" />
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
                <div className="flex gap-2">
                  <Skeleton className="h-6 w-16 rounded-full" />
                  <Skeleton className="h-6 w-20 rounded-full" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Cabeçalho */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
            Agentes de IA
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm md:text-base">
            Crie e gerencie agentes com prompts personalizados.
          </p>
        </div>
        <Button onClick={openCreate} className="gap-2 w-full sm:w-auto">
          <Plus className="w-4 h-4" />
          Novo Agente
        </Button>
      </div>

      {/* Lista de Agentes */}
      {agentes.length === 0 ? (
        <div className="text-center py-16 px-4">
          <div className="inline-flex p-4 bg-blue-50 dark:bg-blue-950/30 rounded-2xl mb-4">
            <Bot className="h-12 w-12 text-blue-500 dark:text-blue-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Nenhum agente criado
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md mx-auto text-sm">
            Agentes permitem personalizar o comportamento da IA com prompts de
            sistema específicos para diferentes casos de uso.
          </p>
          <Button onClick={openCreate} className="gap-2">
            <Sparkles className="w-4 h-4" />
            Criar Primeiro Agente
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {agentes.map((agente) => (
            <div
              key={agente.id}
              className="group relative p-6 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl shadow-sm hover:shadow-md hover:border-blue-300 dark:hover:border-blue-700 transition-all"
            >
              {/* Ícone + Provider Badge */}
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-linear-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl">
                  <Bot className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                {getProviderBadge(agente.modelo)}
              </div>

              {/* Info */}
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1 truncate">
                {agente.nome}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-3 line-clamp-2">
                {agente.prompt}
              </p>

              {/* Modelo + Data */}
              <div className="flex items-center justify-between text-xs text-gray-400 dark:text-gray-500 mb-4">
                <span>{getModelLabel(agente.modelo)}</span>
                <span>
                  {new Date(agente.created_at).toLocaleDateString('pt-BR')}
                </span>
              </div>

              {/* Ações */}
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 gap-1"
                  onClick={() => openEdit(agente)}
                >
                  <Edit className="w-3.5 h-3.5" />
                  Editar
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/30"
                  onClick={() => setDeleteId(agente.id)}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Criar/Editar Agente */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl max-w-lg w-full p-6 space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  {editingAgente ? 'Editar Agente' : 'Novo Agente de IA'}
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {editingAgente
                    ? 'Atualize as configurações do agente.'
                    : 'Configure um agente com prompt personalizado.'}
                </p>
              </div>
              <button
                onClick={() => {
                  setShowModal(false)
                  setEditingAgente(null)
                }}
                className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-zinc-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="nome">Nome do Agente</Label>
                <Input
                  id="nome"
                  name="nome"
                  type="text"
                  placeholder="Ex: Assistente de Vendas"
                  defaultValue={editingAgente?.nome || ''}
                  required
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="prompt">Prompt do Sistema</Label>
                <textarea
                  id="prompt"
                  name="prompt"
                  placeholder="Ex: Você é um assistente especializado em vendas B2B. Sempre responda de forma profissional e objetiva..."
                  defaultValue={editingAgente?.prompt || ''}
                  required
                  rows={5}
                  className="mt-1 w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-white text-sm resize-none"
                />
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Este prompt será enviado como instrução de sistema em todas as
                  conversas com este agente.
                </p>
              </div>

              <div>
                <Label htmlFor="modelo">Modelo de IA</Label>
                <select
                  id="modelo"
                  name="modelo"
                  defaultValue={editingAgente?.modelo || 'gpt-4o-mini'}
                  required
                  className="mt-1 w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-white"
                >
                  {MODELOS_DISPONIVEIS.map((m) => (
                    <option key={m.value} value={m.value}>
                      {m.label} ({m.provider})
                    </option>
                  ))}
                </select>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  A API Key configurada deve ser compatível com o provider
                  selecionado.
                </p>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowModal(false)
                    setEditingAgente(null)
                  }}
                  disabled={saving}
                  className="flex-1"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={saving}
                  className="flex-1 gap-2"
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Salvando...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      {editingAgente ? 'Salvar Alterações' : 'Criar Agente'}
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de Confirmação de Exclusão */}
      <ConfirmDialog
        open={deleteId !== null}
        onOpenChange={(open) => !open && setDeleteId(null)}
        onConfirm={confirmDelete}
        title="Remover Agente"
        description="Deseja realmente remover este agente? Conversas existentes vinculadas a ele não serão afetadas, mas novas conversas não poderão usá-lo."
        confirmText="Remover"
        cancelText="Cancelar"
        variant="danger"
        isLoading={deleteLoading}
      />
    </div>
  )
}

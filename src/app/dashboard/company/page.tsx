'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Skeleton } from '@/components/ui/skeleton'
import { useToast } from '@/hooks/use-toast'
import type { Empresa } from '@/types/database'
import {
  AlertCircle,
  Building2,
  Calendar,
  Key,
  Loader2,
  MessageSquare,
  Save,
  Sparkles,
  Trash2,
  Users,
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import {
  deleteCompany,
  getCompanyInfo,
  getCompanyUsageStats,
  updateCompanyName,
  updateCompanySlug,
} from './actions'

export default function CompanyPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [company, setCompany] = useState<Empresa | null>(null)
  const [stats, setStats] = useState({
    totalConversas: 0,
    totalMensagens: 0,
    totalMembros: 0,
    hasApiKey: false,
    createdAt: '',
  })
  const [loading, setLoading] = useState(true)
  const [editingName, setEditingName] = useState(false)
  const [editingSlug, setEditingSlug] = useState(false)
  const [newName, setNewName] = useState('')
  const [newSlug, setNewSlug] = useState('')
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const loadData = async () => {
    setLoading(true)

    const [companyResult, statsResult] = await Promise.all([
      getCompanyInfo(),
      getCompanyUsageStats(),
    ])

    if (companyResult.error) {
      toast({
        title: 'Erro ao carregar dados',
        description: companyResult.error,
        variant: 'destructive',
      })
    } else if (companyResult.data) {
      setCompany(companyResult.data)
      setNewName(companyResult.data.nome)
      setNewSlug(companyResult.data.slug || '')
    }

    if (statsResult.data) {
      setStats(statsResult.data)
    }

    setLoading(false)
  }

  useEffect(() => {
    void loadData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleUpdateName = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    const formData = new FormData()
    formData.append('nome', newName)

    const result = await updateCompanyName(formData)

    if (result.error) {
      toast({
        title: 'Erro ao atualizar nome',
        description: result.error,
        variant: 'destructive',
      })
    } else {
      toast({
        title: 'Nome atualizado!',
        description: 'O nome da empresa foi atualizado com sucesso.',
        variant: 'success',
      })
      setEditingName(false)
      await loadData()
    }

    setSaving(false)
  }

  const handleUpdateSlug = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    const formData = new FormData()
    formData.append('slug', newSlug)

    const result = await updateCompanySlug(formData)

    if (result.error) {
      toast({
        title: 'Erro ao atualizar slug',
        description: result.error,
        variant: 'destructive',
      })
    } else {
      toast({
        title: 'Slug atualizado!',
        description: 'O slug da empresa foi atualizado com sucesso.',
        variant: 'success',
      })
      setEditingSlug(false)
      await loadData()
    }

    setSaving(false)
  }

  const handleDelete = async () => {
    const confirmed = confirm(
      'ATENÇÃO! Esta ação irá deletar permanentemente sua empresa e TODOS os dados (membros, conversas, mensagens, API keys). Esta ação NÃO PODE ser desfeita. Deseja continuar?'
    )

    if (!confirmed) return

    const doubleConfirmed = confirm(
      'Confirmação final: Tem certeza absoluta que deseja deletar esta empresa?'
    )

    if (!doubleConfirmed) return

    setDeleting(true)

    const result = await deleteCompany()

    if (result.error) {
      toast({
        title: 'Erro ao deletar empresa',
        description: result.error,
        variant: 'destructive',
      })
      setDeleting(false)
    } else {
      toast({
        title: 'Empresa deletada',
        description: 'Redirecionando para login...',
        variant: 'success',
      })
      // Redirecionar para login
      router.push('/login')
    }
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Cabeçalho Skeleton */}
        <div className="space-y-2">
          <Skeleton className="h-9 w-64" />
          <Skeleton className="h-5 w-96" />
        </div>

        {/* Estatísticas Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center gap-3">
                <Skeleton className="h-12 w-12 rounded-lg" />
                <div className="space-y-2">
                  <Skeleton className="h-8 w-12" />
                  <Skeleton className="h-4 w-20" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Card de Informações Skeleton */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-gray-200 dark:border-gray-700">
            <Skeleton className="h-6 w-6" />
            <Skeleton className="h-6 w-48" />
          </div>
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-11 w-full" />
            </div>
          ))}
        </div>

        {/* Zona de Perigo Skeleton */}
        <div className="bg-red-50 dark:bg-red-900/10 rounded-lg border border-red-200 dark:border-red-800 p-6 space-y-4">
          <div className="space-y-2">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-4 w-96" />
          </div>
          <Skeleton className="h-20 w-full rounded-lg" />
        </div>
      </div>
    )
  }

  if (!company) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">
            Empresa não encontrada
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Cabeçalho com Identidade Visual */}
      <div className="relative overflow-hidden rounded-2xl bg-linear-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-950/30 dark:via-indigo-950/30 dark:to-purple-950/30 p-5 md:p-8 border border-blue-100 dark:border-blue-900/50">
        <div className="absolute top-0 right-0 w-64 h-64 bg-linear-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-3xl"></div>
        <div className="relative">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 md:gap-3 mb-2">
                <Building2 className="h-6 w-6 md:h-8 md:w-8 text-blue-600 dark:text-blue-400" />
                <h1 className="text-2xl md:text-3xl font-bold bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Gestão da Empresa
                </h1>
              </div>
              <p className="text-gray-600 dark:text-gray-300 text-sm md:text-base">
                Configure e gerencie as informações do seu workspace
              </p>
            </div>
            <Badge variant="info" className="gap-1">
              <Sparkles className="h-3 w-3" />
              Ativo
            </Badge>
          </div>
        </div>
      </div>

      {/* Estatísticas de Uso */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        <div className="p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats.totalMembros}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Membros
              </p>
            </div>
          </div>
        </div>

        <div className="p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
              <MessageSquare className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats.totalConversas}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Conversas
              </p>
            </div>
          </div>
        </div>

        <div className="p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <MessageSquare className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats.totalMensagens}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Mensagens
              </p>
            </div>
          </div>
        </div>

        <div className="p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div
              className={`p-3 rounded-lg ${stats.hasApiKey ? 'bg-green-100 dark:bg-green-900/30' : 'bg-gray-100 dark:bg-gray-700/30'}`}
            >
              <Key
                className={`w-6 h-6 ${stats.hasApiKey ? 'text-green-600 dark:text-green-400' : 'text-gray-400'}`}
              />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats.hasApiKey ? '✔' : '✗'}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                API Key
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Informações da Empresa */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-gray-200 dark:border-gray-700">
          <Building2 className="w-6 h-6 text-gray-600 dark:text-gray-400" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Informações do Workspace
          </h2>
        </div>

        {/* Nome da Empresa */}
        <div>
          <Label>Nome da Empresa</Label>
          {editingName ? (
            <form onSubmit={handleUpdateName} className="mt-2 space-y-3">
              <Input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Nome da empresa"
                required
                minLength={3}
              />
              <div className="flex gap-2">
                <Button type="submit" disabled={saving} className="gap-2">
                  {saving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Salvando...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      Salvar
                    </>
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setEditingName(false)
                    setNewName(company.nome)
                  }}
                  disabled={saving}
                >
                  Cancelar
                </Button>
              </div>
            </form>
          ) : (
            <div className="mt-2 flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded-md">
              <span className="text-gray-900 dark:text-white font-medium">
                {company.nome}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setEditingName(true)}
              >
                Editar
              </Button>
            </div>
          )}
        </div>

        {/* Slug */}
        <div>
          <Label>Slug (URL amigável)</Label>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Apenas letras minúsculas, números e hífen
          </p>
          {editingSlug ? (
            <form onSubmit={handleUpdateSlug} className="mt-2 space-y-3">
              <Input
                type="text"
                value={newSlug}
                onChange={(e) => setNewSlug(e.target.value.toLowerCase())}
                placeholder="minha-empresa"
                required
                pattern="[a-z0-9-]{3,}"
              />
              <div className="flex gap-2">
                <Button type="submit" disabled={saving} className="gap-2">
                  {saving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Salvando...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      Salvar
                    </>
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setEditingSlug(false)
                    setNewSlug(company.slug || '')
                  }}
                  disabled={saving}
                >
                  Cancelar
                </Button>
              </div>
            </form>
          ) : (
            <div className="mt-2 flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded-md">
              <span className="text-gray-900 dark:text-white font-mono">
                {company.slug || 'Não configurado'}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setEditingSlug(true)}
              >
                Editar
              </Button>
            </div>
          )}
        </div>

        {/* Data de Criação */}
        <div>
          <Label>Data de Criação</Label>
          <div className="mt-2 flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-900 rounded-md">
            <Calendar className="w-4 h-4 text-gray-500" />
            <span className="text-gray-900 dark:text-white">
              {new Date(stats.createdAt).toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: 'long',
                year: 'numeric',
              })}
            </span>
          </div>
        </div>

        {/* Status da Subscription */}
        <div>
          <Label>Status da Assinatura</Label>
          <div className="mt-2 flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-900 rounded-md">
            <span
              className={`px-3 py-1 text-xs font-medium rounded-full ${
                company.subscription_status === 'active'
                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                  : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
              }`}
            >
              {company.subscription_status === 'active' ? 'Ativa' : 'Inativa'}
            </span>
          </div>
        </div>
      </div>

      {/* Zona de Perigo */}
      <div className="bg-red-50 dark:bg-red-900/10 rounded-lg border border-red-200 dark:border-red-800 p-6 space-y-4">
        <div>
          <h3 className="text-lg font-semibold text-red-900 dark:text-red-300">
            Zona de Perigo
          </h3>
          <p className="text-sm text-red-700 dark:text-red-400 mt-1">
            Ações irreversíveis que afetam permanentemente sua empresa.
          </p>
        </div>

        <div className="flex items-start justify-between p-4 bg-white dark:bg-gray-800 rounded-lg border border-red-300 dark:border-red-700">
          <div>
            <p className="font-medium text-gray-900 dark:text-white">
              Deletar Empresa
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Remove permanentemente todos os dados, membros, conversas e
              configurações.
            </p>
          </div>
          <Button
            variant="outline"
            onClick={handleDelete}
            disabled={deleting}
            className="bg-red-500 text-white hover:bg-red-600 border-red-600 gap-2 shrink-0 ml-4"
          >
            {deleting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Deletando...
              </>
            ) : (
              <>
                <Trash2 className="w-4 h-4" />
                Deletar
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}

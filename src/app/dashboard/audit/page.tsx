'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Skeleton } from '@/components/ui/skeleton'
import { useToast } from '@/hooks/use-toast'
import {
  Activity,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Download,
  Filter,
  Loader2,
  Search,
  TrendingUp,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import type { AuditLog } from './actions'
import {
  exportAuditLogs,
  getActionTypes,
  getAuditLogs,
  getAuditStats,
} from './actions'

export default function AuditPage() {
  const { toast } = useToast()
  const [logs, setLogs] = useState<AuditLog[]>([])
  const [stats, setStats] = useState({
    total: 0,
    today: 0,
    thisWeek: 0,
    thisMonth: 0,
    actionCounts: {} as Record<string, number>,
  })
  const [actionTypes, setActionTypes] = useState<string[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalLogs, setTotalLogs] = useState(0)
  const [filterAction, setFilterAction] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)
  const [exporting, setExporting] = useState(false)

  const logsPerPage = 50
  const totalPages = Math.ceil(totalLogs / logsPerPage)

  const loadData = async () => {
    setLoading(true)

    const [logsResult, statsResult, actionsResult] = await Promise.all([
      getAuditLogs(currentPage, logsPerPage, filterAction),
      getAuditStats(),
      getActionTypes(),
    ])

    if (logsResult.error) {
      toast({
        title: 'Erro ao carregar logs',
        description: logsResult.error,
        variant: 'destructive',
      })
    } else if (logsResult.data) {
      setLogs(logsResult.data)
      setTotalLogs(logsResult.total || 0)
    }

    if (statsResult.data) {
      setStats(statsResult.data)
    }

    if (actionsResult.data) {
      setActionTypes(actionsResult.data)
    }

    setLoading(false)
  }

  useEffect(() => {
    loadData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, filterAction])

  const handleExport = async () => {
    setExporting(true)

    const result = await exportAuditLogs()

    if (result.error) {
      toast({
        title: 'Erro ao exportar logs',
        description: result.error,
        variant: 'destructive',
      })
    } else if (result.data) {
      // Criar download do CSV
      const blob = new Blob([result.data], { type: 'text/csv;charset=utf-8;' })
      const link = document.createElement('a')
      link.href = URL.createObjectURL(blob)
      link.download = `audit-logs-${new Date().toISOString().split('T')[0]}.csv`
      link.click()
      toast({
        title: 'Logs exportados!',
        description: 'O arquivo CSV foi baixado com sucesso.',
        variant: 'success',
      })
    }

    setExporting(false)
  }

  const getActionBadgeVariant = (
    action: string
  ):
    | 'success'
    | 'info'
    | 'destructive'
    | 'warning'
    | 'purple'
    | 'secondary' => {
    const variants: Record<
      string,
      'success' | 'info' | 'destructive' | 'warning' | 'purple' | 'secondary'
    > = {
      CREATE: 'success',
      UPDATE: 'info',
      DELETE: 'destructive',
      LOGIN: 'purple',
      LOGOUT: 'secondary',
      INVITE_SENT: 'warning',
      MEMBER_ROLE_UPDATED: 'warning',
      MEMBER_REMOVED: 'destructive',
      API_KEY_CREATED: 'info',
      API_KEY_UPDATED: 'info',
      API_KEY_DELETED: 'destructive',
    }

    return variants[action] || 'secondary'
  }

  const formatActionLabel = (action: string) => {
    const labels: Record<string, string> = {
      CREATE: 'Criação',
      UPDATE: 'Atualização',
      DELETE: 'Exclusão',
      LOGIN: 'Login',
      LOGOUT: 'Logout',
      INVITE_SENT: 'Convite Enviado',
      MEMBER_ROLE_UPDATED: 'Role Alterado',
      MEMBER_REMOVED: 'Membro Removido',
      API_KEY_CREATED: 'API Key Criada',
      API_KEY_UPDATED: 'API Key Atualizada',
      API_KEY_DELETED: 'API Key Deletada',
      MESSAGE_SENT: 'Mensagem Enviada',
    }

    return labels[action] || action
  }

  const filteredLogs = logs.filter((log) => {
    if (!searchTerm) return true
    const search = searchTerm.toLowerCase()
    return (
      log.acao.toLowerCase().includes(search) ||
      log.usuario_nome?.toLowerCase().includes(search) ||
      log.usuario_email?.toLowerCase().includes(search) ||
      log.detalhes?.toLowerCase().includes(search)
    )
  })

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Cabeçalho Skeleton */}
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <Skeleton className="h-9 w-72" />
            <Skeleton className="h-5 w-96" />
          </div>
          <Skeleton className="h-10 w-40" />
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
                  <Skeleton className="h-8 w-16" />
                  <Skeleton className="h-4 w-24" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Filtros Skeleton */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex gap-4">
            <Skeleton className="h-10 flex-1" />
            <Skeleton className="h-10 w-40" />
          </div>
        </div>

        {/* Lista Skeleton */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <Skeleton className="h-6 w-48" />
          </div>
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <Skeleton className="h-6 w-32" />
                    <Skeleton className="h-4 w-64" />
                    <Skeleton className="h-4 w-48" />
                  </div>
                  <Skeleton className="h-6 w-24 rounded-full" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Cabeçalho */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
            Auditoria & Compliance
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm md:text-base">
            Rastreie todas as ações e mudanças no sistema.
          </p>
        </div>
        <Button
          onClick={handleExport}
          disabled={exporting || logs.length === 0}
          className="gap-2 w-full sm:w-auto"
        >
          {exporting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Exportando...
            </>
          ) : (
            <>
              <Download className="w-4 h-4" />
              Exportar CSV
            </>
          )}
        </Button>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        <div className="p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <Activity className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats.total}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Total de Logs
              </p>
            </div>
          </div>
        </div>

        <div className="p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <Calendar className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats.today}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Hoje</p>
            </div>
          </div>
        </div>

        <div className="p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
              <TrendingUp className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats.thisWeek}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Últimos 7 dias
              </p>
            </div>
          </div>
        </div>

        <div className="p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
              <Activity className="w-6 h-6 text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats.thisMonth}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Últimos 30 dias
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filtros & Busca */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Buscar por ação, usuário ou detalhes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="flex gap-2">
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <select
                value={filterAction}
                onChange={(e) => {
                  setFilterAction(e.target.value)
                  setCurrentPage(1)
                }}
                className="pl-10 pr-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-white"
              >
                <option value="all">Todas as ações</option>
                {actionTypes.map((action) => (
                  <option key={action} value={action}>
                    {formatActionLabel(action)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Lista de Logs */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Logs de Auditoria ({filteredLogs.length})
          </h2>
        </div>

        <ScrollArea className="h-150">
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {filteredLogs.length === 0 ? (
              <div className="p-12 text-center">
                <Activity className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400">
                  Nenhum log encontrado.
                </p>
              </div>
            ) : (
              filteredLogs.map((log) => (
                <div
                  key={log.id}
                  className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Badge variant={getActionBadgeVariant(log.acao)}>
                          {formatActionLabel(log.acao)}
                        </Badge>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {new Date(log.created_at).toLocaleString('pt-BR')}
                        </span>
                      </div>

                      <p className="text-sm text-gray-700 dark:text-gray-300 mb-1">
                        <span className="font-medium">
                          {log.usuario_nome || 'Sistema'}
                        </span>
                        {log.usuario_email && (
                          <span className="text-gray-500 dark:text-gray-400">
                            {' '}
                            ({log.usuario_email})
                          </span>
                        )}
                      </p>

                      {log.detalhes && (
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 font-mono bg-gray-50 dark:bg-gray-900 p-2 rounded">
                          {log.detalhes}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>

        {/* Paginação */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Página {currentPage} de {totalPages} ({totalLogs} logs no total)
            </p>

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="w-4 h-4" />
                Anterior
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages}
              >
                Próxima
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

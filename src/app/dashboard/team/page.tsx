'use client'

import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ConfirmDialog } from '@/components/ui/confirm-dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Skeleton } from '@/components/ui/skeleton'
import { useToast } from '@/hooks/use-toast'
import type { Perfil } from '@/types/database'
import {
  Crown,
  Loader2,
  Mail,
  MoreVertical,
  Shield,
  Trash2,
  User,
  UserPlus,
  Users,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import {
  getTeamMembers,
  getTeamStats,
  inviteTeamMember,
  removeMember,
  updateMemberRole,
} from './actions'

export default function TeamPage() {
  const { toast } = useToast()
  const [members, setMembers] = useState<Perfil[]>([])
  const [stats, setStats] = useState({
    total: 0,
    masters: 0,
    admins: 0,
    colaboradores: 0,
  })
  const [loading, setLoading] = useState(true)
  const [showInviteModal, setShowInviteModal] = useState(false)
  const [inviteLoading, setInviteLoading] = useState(false)
  const [actionMemberId, setActionMemberId] = useState<string | null>(null)
  const [removeMemberId, setRemoveMemberId] = useState<string | null>(null)
  const [removeLoading, setRemoveLoading] = useState(false)

  const loadData = async () => {
    setLoading(true)
    const [membersResult, statsResult] = await Promise.all([
      getTeamMembers(),
      getTeamStats(),
    ])

    if (membersResult.error) {
      toast({
        title: 'Erro ao carregar membros',
        description: membersResult.error,
        variant: 'destructive',
      })
    } else if (membersResult.data) {
      setMembers(membersResult.data)
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

  const handleInvite = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setInviteLoading(true)

    const formData = new FormData(e.currentTarget)
    const result = await inviteTeamMember(formData)

    if (result.error) {
      toast({
        title: 'Erro ao convidar membro',
        description: result.error,
        variant: 'destructive',
      })
    } else {
      toast({
        title: 'Convite enviado!',
        description: result.data?.message || 'Convite enviado com sucesso!',
        variant: 'success',
      })
      setShowInviteModal(false)
      await loadData()
    }

    setInviteLoading(false)
  }

  const handleRemove = async (memberId: string) => {
    setRemoveMemberId(memberId)
  }

  const confirmRemove = async () => {
    if (!removeMemberId) return

    setRemoveLoading(true)

    const result = await removeMember(removeMemberId)

    if (result.error) {
      toast({
        title: 'Erro ao remover membro',
        description: result.error,
        variant: 'destructive',
      })
    } else {
      toast({
        title: 'Membro removido!',
        description: 'O membro foi removido com sucesso.',
        variant: 'success',
      })
      await loadData()
    }

    setRemoveLoading(false)
    setRemoveMemberId(null)
  }

  const handleChangeRole = async (memberId: string, newRole: string) => {
    const result = await updateMemberRole(memberId, newRole)

    if (result.error) {
      toast({
        title: 'Erro ao atualizar role',
        description: result.error,
        variant: 'destructive',
      })
    } else {
      toast({
        title: 'Role atualizado!',
        description: 'O role do membro foi atualizado com sucesso.',
        variant: 'success',
      })
      await loadData()
      setActionMemberId(null)
    }
  }

  const getRoleBadge = (role: string) => {
    const variants = {
      master: 'purple',
      admin_tenant: 'info',
      colaborador: 'secondary',
    } as const

    const labels = {
      master: 'Master',
      admin_tenant: 'Admin',
      colaborador: 'Colaborador',
    }

    const icons = {
      master: Crown,
      admin_tenant: Shield,
      colaborador: User,
    }

    const Icon = icons[role as keyof typeof icons] || User

    return (
      <Badge
        variant={variants[role as keyof typeof variants] || 'secondary'}
        className="gap-1"
      >
        <Icon className="w-3 h-3" />
        {labels[role as keyof typeof labels] || role}
      </Badge>
    )
  }

  const getInitials = (name: string | null, email: string | null) => {
    if (name) {
      return name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    }
    if (email) {
      return email.slice(0, 2).toUpperCase()
    }
    return 'U'
  }

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Cabeçalho Skeleton */}
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <Skeleton className="h-9 w-64" />
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
                  <Skeleton className="h-8 w-12" />
                  <Skeleton className="h-4 w-24" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Lista Skeleton */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <Skeleton className="h-6 w-32" />
          </div>
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div className="space-y-2">
                      <Skeleton className="h-5 w-32" />
                      <Skeleton className="h-4 w-48" />
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-6 w-20 rounded-full" />
                    <Skeleton className="h-8 w-8 rounded" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Cabeçalho */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
            Gestão de Equipe
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm md:text-base">
            Gerencie membros, roles e permissões do seu workspace.
          </p>
        </div>
        <Button
          onClick={() => setShowInviteModal(true)}
          className="gap-2 w-full sm:w-auto"
        >
          <UserPlus className="w-4 h-4" />
          Convidar Membro
        </Button>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        <div className="p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats.total}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total</p>
            </div>
          </div>
        </div>

        <div className="p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
              <Crown className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats.masters}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Masters
              </p>
            </div>
          </div>
        </div>

        <div className="p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <Shield className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats.admins}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Admins</p>
            </div>
          </div>
        </div>

        <div className="p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gray-100 dark:bg-gray-700/30 rounded-lg">
              <User className="w-6 h-6 text-gray-600 dark:text-gray-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats.colaboradores}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Colaboradores
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Lista de Membros */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Membros ({members.length})
          </h2>
        </div>

        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {members.map((member) => (
            <div
              key={member.id}
              className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                  <Avatar className="w-10 h-10 sm:w-12 sm:h-12 shrink-0">
                    <AvatarFallback className="bg-blue-500 text-white font-semibold text-sm">
                      {getInitials(member.nome, member.email)}
                    </AvatarFallback>
                  </Avatar>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-medium text-gray-900 dark:text-white truncate">
                        {member.nome || 'Sem nome'}
                      </p>
                      {getRoleBadge(member.role)}
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                      {member.email || 'Sem email'}
                    </p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                      Membro desde{' '}
                      {new Date(member.created_at).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {/* Dropdown de ações */}
                  <div className="relative">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setActionMemberId(
                          actionMemberId === member.id ? null : member.id
                        )
                      }
                    >
                      <MoreVertical className="w-4 h-4" />
                    </Button>

                    {actionMemberId === member.id && (
                      <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl z-10">
                        <div className="p-2 space-y-1">
                          <p className="px-3 py-1 text-xs font-medium text-gray-500 dark:text-gray-400">
                            Alterar Role
                          </p>
                          {['master', 'admin_tenant', 'colaborador'].map(
                            (role) => (
                              <button
                                key={role}
                                onClick={() =>
                                  handleChangeRole(member.id, role)
                                }
                                disabled={member.role === role}
                                className={`w-full text-left px-3 py-2 text-sm rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                                  member.role === role
                                    ? 'opacity-50 cursor-not-allowed'
                                    : ''
                                }`}
                              >
                                {role === 'master' && 'Master'}
                                {role === 'admin_tenant' && 'Admin'}
                                {role === 'colaborador' && 'Colaborador'}
                              </button>
                            )
                          )}

                          <div className="border-t border-gray-200 dark:border-gray-700 my-1"></div>

                          <button
                            onClick={() => {
                              setActionMemberId(null)
                              handleRemove(member.id)
                            }}
                            className="w-full text-left px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors flex items-center gap-2"
                          >
                            <Trash2 className="w-4 h-4" />
                            Remover
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal de Convite */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6 space-y-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Convidar Novo Membro
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Adicione um novo membro ao seu workspace.
              </p>
            </div>

            <form onSubmit={handleInvite} className="space-y-4">
              <div>
                <Label htmlFor="nome">Nome Completo</Label>
                <Input
                  id="nome"
                  name="nome"
                  type="text"
                  placeholder="João Silva"
                  required
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="joao@empresa.com"
                  required
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="role">Role</Label>
                <select
                  id="role"
                  name="role"
                  required
                  className="mt-1 w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-white"
                >
                  <option value="colaborador">Colaborador</option>
                  <option value="admin_tenant">Admin</option>
                </select>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Master só pode ser atribuído manualmente
                </p>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowInviteModal(false)}
                  disabled={inviteLoading}
                  className="flex-1"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={inviteLoading}
                  className="flex-1 gap-2"
                >
                  {inviteLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    <>
                      <Mail className="w-4 h-4" />
                      Enviar Convite
                    </>
                  )}
                </Button>
              </div>
            </form>

            <p className="text-xs text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded border border-yellow-200 dark:border-yellow-800">
              ⚠️ Nota: A funcionalidade de envio de email não está implementada.
              O convite será apenas registrado no sistema.
            </p>
          </div>
        </div>
      )}

      {/* Modal de Confirmação de Remoção */}
      <ConfirmDialog
        open={removeMemberId !== null}
        onOpenChange={(open) => !open && setRemoveMemberId(null)}
        onConfirm={confirmRemove}
        title="Remover Membro"
        description="Deseja realmente remover este membro? Esta ação não pode ser desfeita e o usuário perderá acesso ao workspace."
        confirmText="Remover"
        cancelText="Cancelar"
        variant="danger"
        isLoading={removeLoading}
      />
    </div>
  )
}

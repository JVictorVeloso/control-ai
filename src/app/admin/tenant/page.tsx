import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { createClient } from '@/utils/supabase/server'
import {
  Activity,
  AlertCircle,
  BarChart3,
  CheckCircle,
  Key,
  MessageSquare,
  Shield,
  TrendingUp,
  Users,
} from 'lucide-react'
import Link from 'next/link'
import { redirect } from 'next/navigation'

export default async function TenantAdminDashboard() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Buscar perfil do usuário
  const { data: perfil } = await supabase
    .from('perfis')
    .select('empresa_id, role')
    .eq('id', user.id)
    .single()

  // Verificar se é admin_tenant
  if (perfil?.role !== 'admin_tenant') {
    redirect('/dashboard')
  }

  if (!perfil.empresa_id) {
    redirect('/dashboard')
  }

  // Buscar informações da empresa
  const { data: empresa } = await supabase
    .from('empresas')
    .select('nome, created_at, api_key_encrypted, subscription_status')
    .eq('id', perfil.empresa_id)
    .single()

  // Estatísticas da empresa
  const { count: totalMembros } = await supabase
    .from('perfis')
    .select('*', { count: 'exact', head: true })
    .eq('empresa_id', perfil.empresa_id)

  const { count: totalConversas } = await supabase
    .from('conversas')
    .select('*', { count: 'exact', head: true })
    .eq('empresa_id', perfil.empresa_id)

  // Buscar IDs das conversas da empresa
  const { data: conversasData } = await supabase
    .from('conversas')
    .select('id')
    .eq('empresa_id', perfil.empresa_id)

  const conversasIds = conversasData?.map((c) => c.id) || []

  // Contar mensagens das conversas da empresa
  const { count: totalMensagens } =
    conversasIds.length > 0
      ? await supabase
          .from('mensagens')
          .select('*', { count: 'exact', head: true })
          .in('conversa_id', conversasIds)
      : { count: 0 }

  // Buscar membros da equipe
  const { data: membros } = await supabase
    .from('perfis')
    .select('id, nome, email, role, created_at')
    .eq('empresa_id', perfil.empresa_id)
    .order('created_at', { ascending: false })

  // Buscar logs de auditoria recentes
  const { data: logs } = await supabase
    .from('auditoria')
    .select('acao, detalhes, created_at')
    .eq('empresa_id', perfil.empresa_id)
    .order('created_at', { ascending: false })
    .limit(5)

  const hasApiKey = !!empresa?.api_key_encrypted

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-linear-to-br from-blue-500 to-purple-500 rounded-lg">
            <BarChart3 className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Admin Dashboard - {empresa?.nome}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Gerencie sua empresa e equipe
            </p>
          </div>
        </div>
      </div>

      {/* Alerta de configuração */}
      {!hasApiKey && (
        <div className="bg-amber-50 dark:bg-amber-900/20 border-2 border-amber-300 dark:border-amber-700 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-semibold text-amber-900 dark:text-amber-100">
                Configuração Necessária
              </h3>
              <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
                Sua empresa ainda não configurou uma API Key. Configure agora
                para começar a usar o chat com IA.
              </p>
              <Link href="/dashboard/settings">
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-3 border-amber-400 text-amber-700 hover:bg-amber-100 dark:text-amber-300 dark:hover:bg-amber-900/40"
                >
                  <Key className="h-4 w-4 mr-2" />
                  Configurar Agora
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Métricas da Empresa */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card className="border-2 hover:border-blue-400 dark:hover:border-blue-500 transition-all hover:shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Membros da Equipe
            </CardTitle>
            <Users className="h-5 w-5 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900 dark:text-white">
              {totalMembros || 0}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Usuários cadastrados
            </p>
            <Link href="/dashboard/team">
              <Button variant="link" size="sm" className="p-0 h-auto mt-2">
                Gerenciar equipe →
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="border-2 hover:border-purple-400 dark:hover:border-purple-500 transition-all hover:shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Conversas Criadas
            </CardTitle>
            <MessageSquare className="h-5 w-5 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900 dark:text-white">
              {totalConversas || 0}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Total de sessões de chat
            </p>
          </CardContent>
        </Card>

        <Card className="border-2 hover:border-green-400 dark:hover:border-green-500 transition-all hover:shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Mensagens Enviadas
            </CardTitle>
            <Activity className="h-5 w-5 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900 dark:text-white">
              {totalMensagens || 0}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Interações com IA
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Status e Segurança */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-blue-500" />
              Status da Empresa
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Assinatura
                </span>
                <Badge
                  variant={
                    empresa?.subscription_status === 'active'
                      ? 'success'
                      : 'secondary'
                  }
                >
                  {empresa?.subscription_status === 'active'
                    ? 'Ativa'
                    : 'Inativa'}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  API Key Configurada
                </span>
                {hasApiKey ? (
                  <Badge variant="success">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Sim
                  </Badge>
                ) : (
                  <Badge variant="destructive">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    Não
                  </Badge>
                )}
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Cadastrada em
                </span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {empresa?.created_at
                    ? new Date(empresa.created_at).toLocaleDateString('pt-BR')
                    : '-'}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-500" />
              Ações Rápidas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Link href="/dashboard/team">
                <Button variant="outline" className="w-full justify-start">
                  <Users className="h-4 w-4 mr-2" />
                  Gerenciar Equipe
                </Button>
              </Link>
              <Link href="/dashboard/settings">
                <Button variant="outline" className="w-full justify-start">
                  <Key className="h-4 w-4 mr-2" />
                  Configurar API Key
                </Button>
              </Link>
              <Link href="/dashboard/audit">
                <Button variant="outline" className="w-full justify-start">
                  <Shield className="h-4 w-4 mr-2" />
                  Ver Auditoria
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Membros da Equipe */}
      <Card>
        <CardHeader>
          <CardTitle>Membros da Equipe</CardTitle>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Usuários cadastrados na sua empresa
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {membros && membros.length > 0 ? (
              membros.map((membro) => (
                <div
                  key={membro.id}
                  className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg"
                >
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {membro.nome || membro.email}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {membro.email}
                    </p>
                  </div>
                  <Badge
                    variant={
                      membro.role === 'admin_tenant'
                        ? 'info'
                        : membro.role === 'master'
                          ? 'purple'
                          : 'secondary'
                    }
                  >
                    {membro.role === 'admin_tenant'
                      ? 'Admin'
                      : membro.role === 'master'
                        ? 'Master'
                        : 'Colaborador'}
                  </Badge>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500 dark:text-gray-400 py-8">
                Nenhum membro cadastrado
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Auditoria Recente */}
      {logs && logs.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Atividade Recente</CardTitle>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Últimas ações realizadas
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {logs.map((log, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                >
                  <Activity className="h-4 w-4 text-gray-500 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {log.acao}
                    </p>
                    {log.detalhes && (
                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                        {log.detalhes}
                      </p>
                    )}
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                      {new Date(log.created_at).toLocaleString('pt-BR')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

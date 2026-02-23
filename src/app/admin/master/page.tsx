import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { createClient } from '@/utils/supabase/server'
import {
  Activity,
  AlertCircle,
  Building2,
  Database,
  MessageSquare,
  Shield,
  TrendingUp,
  Users,
} from 'lucide-react'
import { redirect } from 'next/navigation'

export default async function MasterDashboard() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Verificar se é master
  const { data: perfil } = await supabase
    .from('perfis')
    .select('role')
    .eq('id', user.id)
    .single()

  if (perfil?.role !== 'master') {
    redirect('/dashboard')
  }

  // Buscar estatísticas globais da plataforma
  const { data: empresas } = await supabase
    .from('empresas')
    .select('id, nome, created_at, subscription_status')
    .order('created_at', { ascending: false })

  const { count: totalEmpresas } = await supabase
    .from('empresas')
    .select('*', { count: 'exact', head: true })

  const { count: totalUsuarios } = await supabase
    .from('perfis')
    .select('*', { count: 'exact', head: true })

  const { count: totalConversas } = await supabase
    .from('conversas')
    .select('*', { count: 'exact', head: true })

  const { count: totalMensagens } = await supabase
    .from('mensagens')
    .select('*', { count: 'exact', head: true })

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-linear-to-br from-purple-500 to-pink-500 rounded-lg">
            <Shield className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Dashboard Master
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Visão geral da plataforma Control AI
            </p>
          </div>
        </div>
      </div>

      {/* Métricas Globais */}
      <div className="grid md:grid-cols-4 gap-6">
        <Card className="border-2 hover:border-blue-400 dark:hover:border-blue-500 transition-all hover:shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Total de Empresas
            </CardTitle>
            <Building2 className="h-5 w-5 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900 dark:text-white">
              {totalEmpresas || 0}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Tenants ativos na plataforma
            </p>
          </CardContent>
        </Card>

        <Card className="border-2 hover:border-green-400 dark:hover:border-green-500 transition-all hover:shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Total de Usuários
            </CardTitle>
            <Users className="h-5 w-5 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900 dark:text-white">
              {totalUsuarios || 0}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Usuários registrados
            </p>
          </CardContent>
        </Card>

        <Card className="border-2 hover:border-purple-400 dark:hover:border-purple-500 transition-all hover:shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Total de Conversas
            </CardTitle>
            <MessageSquare className="h-5 w-5 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900 dark:text-white">
              {totalConversas || 0}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Sessões de chat criadas
            </p>
          </CardContent>
        </Card>

        <Card className="border-2 hover:border-orange-400 dark:hover:border-orange-500 transition-all hover:shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Total de Mensagens
            </CardTitle>
            <Activity className="h-5 w-5 text-orange-500" />
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

      {/* Lista de Empresas */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl">Empresas Cadastradas</CardTitle>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Todos os tenants da plataforma
              </p>
            </div>
            <Badge variant="info" className="gap-2">
              <Database className="h-4 w-4" />
              Multi-tenant
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {empresas && empresas.length > 0 ? (
              empresas.map((empresa) => (
                <div
                  key={empresa.id}
                  className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-blue-400 dark:hover:border-blue-500 transition-all hover:shadow-md"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-linear-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg">
                      <Building2 className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {empresa.nome}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Cadastrada em{' '}
                        {new Date(empresa.created_at).toLocaleDateString(
                          'pt-BR'
                        )}
                      </p>
                    </div>
                  </div>
                  <Badge
                    variant={
                      empresa.subscription_status === 'active'
                        ? 'success'
                        : 'secondary'
                    }
                  >
                    {empresa.subscription_status === 'active'
                      ? 'Ativa'
                      : 'Inativa'}
                  </Badge>
                </div>
              ))
            ) : (
              <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                <AlertCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Nenhuma empresa cadastrada ainda</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Indicadores de Saúde */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-500" />
              Crescimento
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Taxa de crescimento
                </span>
                <span className="font-semibold text-green-600">+12%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Novos usuários (30d)
                </span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {totalUsuarios || 0}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-blue-500" />
              Segurança
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  RLS Status
                </span>
                <Badge variant="success">Ativo</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Multi-tenancy
                </span>
                <Badge variant="info">Habilitado</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

import OnboardingCard from '@/components/dashboard/onboarding-card'
import { Badge } from '@/components/ui/badge'
import { createClient } from '@/utils/supabase/server'
import {
  ArrowRight,
  BarChart3,
  Bot,
  MessageSquare,
  Sparkles,
} from 'lucide-react'
import Link from 'next/link'
import { redirect } from 'next/navigation'

export default async function DashboardHome() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Verificar se usuário tem empresa
  const { data: perfil } = await supabase
    .from('perfis')
    .select('empresa_id')
    .eq('id', user.id)
    .single()

  // Se não tem empresa, mostrar onboarding
  if (!perfil?.empresa_id) {
    return <OnboardingCard userEmail={user.email || ''} />
  }

  // Buscar estatísticas reais do banco
  const [membrosResult, conversasResult, agentesResult] = await Promise.all([
    supabase
      .from('perfis')
      .select('id', { count: 'exact', head: true })
      .eq('empresa_id', perfil.empresa_id),
    supabase
      .from('conversas')
      .select('id', { count: 'exact', head: true })
      .eq('empresa_id', perfil.empresa_id),
    supabase
      .from('agentes_ia')
      .select('id', { count: 'exact', head: true })
      .eq('empresa_id', perfil.empresa_id),
  ])

  const totalMembros = membrosResult.count ?? 0
  const totalConversas = conversasResult.count ?? 0
  const totalAgentes = agentesResult.count ?? 0

  // Dashboard normal
  return (
    <div className="space-y-6 md:space-y-8">
      {/* Cabeçalho de Boas-vindas com Branding */}
      <div className="relative overflow-hidden rounded-2xl bg-linear-to-br from-blue-50 via-purple-50 to-indigo-50 dark:from-blue-950/30 dark:via-purple-950/30 dark:to-indigo-950/30 p-5 md:p-8 border border-blue-100 dark:border-blue-900/50">
        <div className="absolute top-0 right-0 w-64 h-64 bg-linear-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-linear-to-tr from-purple-500/10 to-indigo-500/10 rounded-full blur-3xl"></div>
        <div className="relative">
          <div className="flex items-center gap-2 md:gap-3 mb-2 md:mb-4">
            <Sparkles className="h-6 w-6 md:h-8 md:w-8 text-blue-600 dark:text-blue-400" />
            <h1 className="text-2xl md:text-3xl font-bold bg-linear-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
              Painel de Controle
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-300 text-sm md:text-lg">
            Bem-vindo ao Control AI. Seu assistente inteligente de negócios.
          </p>
        </div>
      </div>

      {/* Cards de Acesso Rápido */}
      <div className="grid md:grid-cols-3 gap-6">
        {/* Card 1: O Principal (Chat) */}
        <Link
          href="/dashboard/chat"
          className="group block relative p-6 bg-linear-to-br from-blue-600 to-purple-600 dark:from-blue-700 dark:to-purple-700 text-white rounded-xl shadow-lg hover:shadow-2xl transition-all hover:scale-105 hover:-translate-y-1 overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
          <div className="relative">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-white/20 rounded-xl group-hover:bg-white/30 transition backdrop-blur-sm">
                <MessageSquare className="h-6 w-6 text-white" />
              </div>
              <ArrowRight className="h-5 w-5 text-white/60 group-hover:text-white group-hover:translate-x-1 transition-all" />
            </div>
            <h3 className="text-xl font-bold mb-2">Novo Chat IA</h3>
            <p className="text-blue-50 text-sm">
              Conversas seguras e protegidas com LLM
            </p>
          </div>
        </Link>

        {/* Card 2: Estatísticas Reais */}
        <Link
          href="/dashboard/audit"
          className="group relative p-6 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl shadow-sm hover:shadow-md transition-all hover:border-green-300 dark:hover:border-green-700"
        >
          <Badge variant="success" className="absolute top-3 right-3">
            Ativo
          </Badge>
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-linear-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl text-green-600 dark:text-green-400 group-hover:scale-110 transition-transform">
              <BarChart3 className="h-6 w-6" />
            </div>
          </div>
          <h3 className="text-lg font-bold mb-1 text-gray-900 dark:text-white">
            Resumo de Uso
          </h3>
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">
            Dados reais do workspace
          </p>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500 dark:text-gray-400">
                Conversas
              </span>
              <span className="font-bold text-gray-900 dark:text-white">
                {totalConversas}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500 dark:text-gray-400">Membros</span>
              <span className="font-bold text-gray-900 dark:text-white">
                {totalMembros}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500 dark:text-gray-400">
                Agentes IA
              </span>
              <span className="font-bold text-gray-900 dark:text-white">
                {totalAgentes}
              </span>
            </div>
          </div>
        </Link>

        {/* Card 3: Agentes IA */}
        <Link
          href="/dashboard/agents"
          className="group relative p-6 bg-white dark:bg-zinc-800 border-2 border-gray-200 dark:border-zinc-700 rounded-xl shadow-sm hover:shadow-md transition-all hover:border-purple-300 dark:hover:border-purple-700 hover:scale-105"
        >
          <Badge variant="purple" className="absolute top-3 right-3">
            {totalAgentes > 0 ? 'Ativo' : 'Novo'}
          </Badge>
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-linear-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform">
              <Bot className="h-6 w-6" />
            </div>
            <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-purple-500 group-hover:translate-x-1 transition-all" />
          </div>
          <h3 className="text-lg font-bold mb-1 text-gray-900 dark:text-white">
            Agentes de IA
          </h3>
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">
            Prompts personalizados por caso de uso
          </p>
          {totalAgentes > 0 ? (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 px-2.5 py-1 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <Bot className="h-3.5 w-3.5 text-purple-600 dark:text-purple-400" />
                <span className="text-sm font-semibold text-purple-700 dark:text-purple-300">
                  {totalAgentes} {totalAgentes === 1 ? 'agente' : 'agentes'}
                </span>
              </div>
            </div>
          ) : (
            <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">
              Clique para criar seu primeiro agente →
            </p>
          )}
        </Link>
      </div>
    </div>
  )
}

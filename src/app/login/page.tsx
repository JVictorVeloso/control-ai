'use client'

import { Logo } from '@/components/brand/logo'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  ArrowRight,
  BarChart3,
  Check,
  Database,
  Lock,
  Shield,
  Sparkles,
  Users,
  Zap,
} from 'lucide-react'
import Link from 'next/link'

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-zinc-950 dark:via-blue-950/20 dark:to-purple-950/20">
      {/* Header / Navbar */}
      <header className="container mx-auto py-6 px-4">
        <div className="flex items-center justify-between">
          <Logo size="md" showText={true} />
          <div className="flex items-center gap-4">
            <Badge variant="success" className="gap-1.5 hidden sm:flex">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              Sistema Online
            </Badge>
            <Link
              href="/auth"
              className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition"
            >
              Já tem conta? Entrar
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section - CTA Principal */}
      <section className="container mx-auto px-4 py-12 md:py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
          {/* Left: Copy */}
          <div className="text-left">
            <div className="inline-flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 px-4 py-2 rounded-full text-sm font-medium text-blue-700 dark:text-blue-300 mb-6">
              <Sparkles className="w-4 h-4" />
              Plataforma de IA Segura para Empresas
            </div>

            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-linear-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent leading-tight">
              Sua IA, Seus Dados, Seu Controle
            </h1>

            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
              Converse com LLMs mantendo{' '}
              <span className="font-semibold text-gray-900 dark:text-white">
                total controle e segurança
              </span>{' '}
              dos seus dados. Multi-tenancy, auditoria completa e BYOK.
            </p>

            {/* CTAs Principais */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <Link href="/auth">
                <Button
                  size="lg"
                  className="w-full text-lg px-8 py-6 bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-xl hover:shadow-2xl transition-all hover:scale-105"
                >
                  Criar Conta Gratuita
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Button
                variant="outline"
                size="lg"
                className="text-lg px-8 py-6 border-2"
                onClick={() =>
                  document
                    .getElementById('how-it-works')
                    ?.scrollIntoView({ behavior: 'smooth' })
                }
              >
                Ver como funciona
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap gap-6 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-500" />
                Sem cartão de crédito
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-500" />
                Setup em 2 minutos
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-500" />
                Conformidade LGPD
              </div>
            </div>
          </div>

          {/* Right: Dashboard Mockup */}
          <div className="relative">
            <div className="absolute inset-0 bg-linear-to-r from-blue-600 to-purple-600 blur-3xl opacity-20"></div>
            <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border-2 border-gray-200 dark:border-gray-700 p-6 transform hover:scale-105 transition-transform">
              {/* Mockup Header */}
              <div className="flex items-center gap-2 mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-400"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                  <div className="w-3 h-3 rounded-full bg-green-400"></div>
                </div>
                <div className="flex-1 text-center text-xs font-medium text-gray-500">
                  Control AI Dashboard
                </div>
              </div>

              {/* Mockup Content */}
              <div className="space-y-4">
                {/* Stats Cards */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-linear-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 rounded-lg p-3">
                    <Users className="w-4 h-4 text-blue-600 mb-1" />
                    <div className="text-lg font-bold text-gray-900 dark:text-white">
                      12
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">
                      Membros
                    </div>
                  </div>
                  <div className="bg-linear-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 rounded-lg p-3">
                    <BarChart3 className="w-4 h-4 text-purple-600 mb-1" />
                    <div className="text-lg font-bold text-gray-900 dark:text-white">
                      847
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">
                      Msgs
                    </div>
                  </div>
                  <div className="bg-linear-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 rounded-lg p-3">
                    <Database className="w-4 h-4 text-green-600 mb-1" />
                    <div className="text-lg font-bold text-gray-900 dark:text-white">
                      100%
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">
                      Uptime
                    </div>
                  </div>
                </div>

                {/* Chat Simulation */}
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <div className="w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-600 shrink-0"></div>
                    <div className="flex-1 bg-gray-100 dark:bg-gray-700 rounded-xl p-3">
                      <div className="h-2 bg-gray-300 dark:bg-gray-600 rounded w-3/4 mb-2"></div>
                      <div className="h-2 bg-gray-300 dark:bg-gray-600 rounded w-1/2"></div>
                    </div>
                  </div>
                  <div className="flex gap-2 justify-end">
                    <div className="flex-1 bg-linear-to-r from-blue-500 to-purple-500 rounded-xl p-3 max-w-[70%]">
                      <div className="h-2 bg-white/60 rounded w-2/3"></div>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-linear-to-br from-blue-600 to-purple-600 shrink-0"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section
        id="features"
        className="bg-linear-to-b from-gray-50 to-white dark:from-gray-900 dark:to-zinc-950 py-16 md:py-24"
      >
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">
                Por que escolher Control AI?
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                A única plataforma de IA com segurança enterprise e simplicidade
                startup
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="group p-8 bg-white dark:bg-gray-800 rounded-2xl border-2 border-gray-200 dark:border-gray-700 hover:border-blue-400 dark:hover:border-blue-500 transition-all hover:shadow-2xl shadow-lg hover:-translate-y-2">
                <div className="w-14 h-14 bg-linear-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Shield className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">
                  Multi-Tenancy Nativo
                </h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  Cada empresa isolada com RLS. Seus dados nunca se misturam com
                  outros clientes.
                </p>
              </div>

              <div className="group p-8 bg-white dark:bg-gray-800 rounded-2xl border-2 border-gray-200 dark:border-gray-700 hover:border-purple-400 dark:hover:border-purple-500 transition-all hover:shadow-2xl shadow-lg hover:-translate-y-2">
                <div className="w-14 h-14 bg-linear-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Lock className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">
                  BYOK - Sua Chave
                </h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  Use sua própria chave da OpenAI. Você mantém 100% do controle
                  e propriedade.
                </p>
              </div>

              <div className="group p-8 bg-white dark:bg-gray-800 rounded-2xl border-2 border-gray-200 dark:border-gray-700 hover:border-indigo-400 dark:hover:border-indigo-500 transition-all hover:shadow-2xl shadow-lg hover:-translate-y-2">
                <div className="w-14 h-14 bg-linear-to-br from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Database className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">
                  Auditoria Completa
                </h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  Logs detalhados de todas as ações. Conformidade com LGPD e
                  regulamentações.
                </p>
              </div>

              <div className="group p-8 bg-white dark:bg-gray-800 rounded-2xl border-2 border-gray-200 dark:border-gray-700 hover:border-green-400 dark:hover:border-green-500 transition-all hover:shadow-2xl shadow-lg hover:-translate-y-2">
                <div className="w-14 h-14 bg-linear-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Users className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">
                  Gestão de Equipes
                </h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  Convide membros, defina permissões e controle acessos
                  granulares.
                </p>
              </div>

              <div className="group p-8 bg-white dark:bg-gray-800 rounded-2xl border-2 border-gray-200 dark:border-gray-700 hover:border-yellow-400 dark:hover:border-yellow-500 transition-all hover:shadow-2xl shadow-lg hover:-translate-y-2">
                <div className="w-14 h-14 bg-linear-to-br from-yellow-500 to-yellow-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Zap className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">
                  Alta Performance
                </h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  Respostas rápidas e streaming. Infraestrutura otimizada para
                  escala.
                </p>
              </div>

              <div className="group p-8 bg-white dark:bg-gray-800 rounded-2xl border-2 border-gray-200 dark:border-gray-700 hover:border-pink-400 dark:hover:border-pink-500 transition-all hover:shadow-2xl shadow-lg hover:-translate-y-2">
                <div className="w-14 h-14 bg-linear-to-br from-pink-500 to-pink-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <BarChart3 className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">
                  Analytics Real-time
                </h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  Acompanhe uso, custos e performance com dashboards detalhados.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section
        id="how-it-works"
        className="container mx-auto px-4 py-16 md:py-24"
      >
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">
              Como funciona?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Em 4 passos simples, você já está conversando com IA segura
            </p>
          </div>

          <div className="grid md:grid-cols-7 gap-4 items-start">
            {/* Step 1 */}
            <div className="text-center md:col-span-1">
              <div className="mx-auto w-20 h-20 bg-linear-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6 shadow-xl transform hover:scale-110 transition-transform">
                <div className="text-3xl font-bold text-white">1</div>
              </div>
              <h3 className="text-lg font-bold mb-3 text-gray-900 dark:text-white">
                Crie sua Empresa
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                Cadastre-se gratuitamente e crie o workspace da sua empresa em
                segundos
              </p>
            </div>

            {/* Arrow 1→2 */}
            <div className="hidden md:flex items-center justify-center md:col-span-1 pt-6">
              <ArrowRight className="text-blue-300 dark:text-blue-700 w-6 h-6" />
            </div>

            {/* Step 2 */}
            <div className="text-center md:col-span-1">
              <div className="mx-auto w-20 h-20 bg-linear-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 shadow-xl transform hover:scale-110 transition-transform">
                <div className="text-3xl font-bold text-white">2</div>
              </div>
              <h3 className="text-lg font-bold mb-3 text-gray-900 dark:text-white">
                Configure sua Chave
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                Adicione sua API key da OpenAI. Você mantém controle total dos
                seus dados
              </p>
            </div>

            {/* Arrow 2→3 */}
            <div className="hidden md:flex items-center justify-center md:col-span-1 pt-6">
              <ArrowRight className="text-purple-300 dark:text-purple-700 w-6 h-6" />
            </div>

            {/* Step 3 */}
            <div className="text-center md:col-span-1">
              <div className="mx-auto w-20 h-20 bg-linear-to-br from-indigo-500 to-indigo-600 rounded-2xl flex items-center justify-center mb-6 shadow-xl transform hover:scale-110 transition-transform">
                <div className="text-3xl font-bold text-white">3</div>
              </div>
              <h3 className="text-lg font-bold mb-3 text-gray-900 dark:text-white">
                Convide sua Equipe
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                Adicione membros com diferentes permissões e organize seu time
              </p>
            </div>

            {/* Arrow 3→4 */}
            <div className="hidden md:flex items-center justify-center md:col-span-1 pt-6">
              <ArrowRight className="text-indigo-300 dark:text-indigo-700 w-6 h-6" />
            </div>

            {/* Step 4 */}
            <div className="text-center md:col-span-1">
              <div className="mx-auto w-20 h-20 bg-linear-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mb-6 shadow-xl transform hover:scale-110 transition-transform">
                <div className="text-3xl font-bold text-white">4</div>
              </div>
              <h3 className="text-lg font-bold mb-3 text-gray-900 dark:text-white">
                Monitore Conversas
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                Acompanhe uso, audite ações e veja analytics em tempo real
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section
        id="pricing"
        className="container mx-auto px-4 py-16 md:py-24 bg-linear-to-br from-gray-50 to-blue-50 dark:from-gray-900/50 dark:to-blue-950/30"
      >
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">
              Planos Transparentes
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Comece grátis, escale quando precisar
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Free Plan */}
            <Card className="border-2 hover:border-blue-300 dark:hover:border-blue-700 transition-all hover:shadow-xl">
              <CardHeader>
                <Badge variant="secondary" className="w-fit mb-2">
                  Trial Gratuito
                </Badge>
                <CardTitle className="text-3xl">Starter</CardTitle>
                <CardDescription className="text-lg">
                  Perfeito para testar e validar
                </CardDescription>
                <div className="mt-4">
                  <span className="text-5xl font-bold">R$ 0</span>
                  <span className="text-gray-600 dark:text-gray-400">/mês</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 mb-6">
                  {[
                    'Até 3 membros',
                    '100 mensagens/mês',
                    'Auditoria básica',
                    'Suporte por email',
                    'BYOK incluído',
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <Check className="w-5 h-5 text-green-500" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <Link href="/auth">
                  <Button className="w-full" variant="outline">
                    Começar Grátis
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Pro Plan */}
            <Card className="border-2 border-blue-500 dark:border-blue-600 relative hover:shadow-2xl transition-all transform hover:scale-105">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <Badge className="bg-linear-to-r from-blue-600 to-purple-600 text-white px-4 py-1">
                  Recomendado
                </Badge>
              </div>
              <CardHeader>
                <Badge variant="purple" className="w-fit mb-2">
                  Produção
                </Badge>
                <CardTitle className="text-3xl">Professional</CardTitle>
                <CardDescription className="text-lg">
                  Para equipes que levam IA a sério
                </CardDescription>
                <div className="mt-4">
                  <span className="text-5xl font-bold bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    R$ 297
                  </span>
                  <span className="text-gray-600 dark:text-gray-400">/mês</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 mb-6">
                  {[
                    'Membros ilimitados',
                    'Mensagens ilimitadas',
                    'Auditoria completa + Export CSV',
                    'Suporte prioritário',
                    'Múltiplas API Keys',
                    'White-label (em breve)',
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <Check className="w-5 h-5 text-blue-500" />
                      <span className="font-medium">{item}</span>
                    </li>
                  ))}
                </ul>
                <Link href="/auth">
                  <Button className="w-full bg-linear-to-r from-gray-700 to-gray-800 hover:from-gray-800 hover:to-gray-900">
                    Criar Conta Gratuita
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>

          <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-8">
            💡 Você paga apenas pela plataforma. Custos da OpenAI são diretos na
            sua conta (BYOK).
          </p>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-3xl mx-auto bg-linear-to-r from-blue-600 to-purple-600 rounded-3xl p-12 text-white shadow-2xl">
          <h2 className="text-4xl font-bold mb-4">Pronto para começar?</h2>
          <p className="text-xl mb-8 text-blue-50">
            Crie sua conta gratuita em menos de 2 minutos
          </p>
          <Link href="/auth">
            <Button
              size="lg"
              className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 py-6 shadow-xl hover:shadow-2xl transition-all hover:scale-105"
            >
              Criar Conta Gratuita
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}

import { Building2, Lock, Shield, Zap } from 'lucide-react'
import Link from 'next/link'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* 1. Cabeçalho (Topo da página) */}
      <header className="border-b py-4 px-6 flex justify-between items-center">
        <div className="flex items-center gap-2">
          {/* Logo simples */}
          <div className="p-2 bg-black rounded-lg text-white">
            <Building2 className="h-5 w-5" />
          </div>
          <span className="font-bold text-xl">Control AI</span>
        </div>

        {/* Botão que leva para o Login */}
        <Link
          href="/login"
          className="bg-black text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition"
        >
          Acessar Plataforma
        </Link>
      </header>

      {/* 2. Conteúdo Principal (A propaganda) */}
      <main className="flex flex-col items-center justify-center text-center px-4 py-20 max-w-4xl mx-auto">
        {/* Selo de qualidade visual */}
        <div className="inline-flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full text-xs font-medium text-gray-600 mb-6">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
          Sistema Online
        </div>

        <h1 className="text-5xl font-extrabold tracking-tight text-gray-900 mb-6">
          Inteligência Artificial Privada para sua Empresa
        </h1>

        <p className="text-xl text-gray-500 mb-10 max-w-2xl">
          Utilize IAs de forma segura e controlada. Mantenha os dados da sua
          empresa protegidos com nossa tecnologia exclusiva.
        </p>

        {/* Botões de Ação */}
        <div className="flex gap-4">
          <Link
            href="/login"
            className="bg-black text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-800 transition shadow-lg"
          >
            Começar Agora
          </Link>
          <div className="text-gray-600 px-8 py-4 rounded-xl font-medium border cursor-not-allowed opacity-50">
            Ver Planos
          </div>
        </div>

        {/* 3. Ícones de Funcionalidades (Para mostrar que atende o PDF) */}
        <div className="grid md:grid-cols-3 gap-8 mt-20 w-full text-left">
          <div className="p-6 border rounded-2xl bg-gray-50">
            <Shield className="h-8 w-8 text-blue-600 mb-4" />
            <h3 className="font-bold text-lg mb-2">Segurança Total</h3>
            <p className="text-sm text-gray-500">
              Seus dados ficam isolados e protegidos.
            </p>
          </div>
          <div className="p-6 border rounded-2xl bg-gray-50">
            <Lock className="h-8 w-8 text-purple-600 mb-4" />
            <h3 className="font-bold text-lg mb-2">Chave Própria (BYOK)</h3>
            <p className="text-sm text-gray-500">
              Use sua própria chave da OpenAI com segurança.
            </p>
          </div>
          <div className="p-6 border rounded-2xl bg-gray-50">
            <Zap className="h-8 w-8 text-yellow-500 mb-4" />
            <h3 className="font-bold text-lg mb-2">Alta Performance</h3>
            <p className="text-sm text-gray-500">
              Respostas rápidas e auditoria de uso.
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}

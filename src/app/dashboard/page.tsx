import { ArrowRight, BarChart3, MessageSquare, Users } from 'lucide-react'
import Link from 'next/link'

export default function DashboardHome() {
  return (
    <div className="space-y-8">
      {/* Cabeçalho de Boas-vindas */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Painel de Controle</h1>
        <p className="text-gray-500 mt-2">
          Bem-vindo ao Control AI. Selecione uma ferramenta para começar.
        </p>
      </div>

      {/* Cards de Acesso Rápido */}
      <div className="grid md:grid-cols-3 gap-6">
        {/* Card 1: O Principal (Chat) */}
        <Link
          href="/dashboard/chat"
          className="group block p-6 bg-black text-white rounded-xl shadow-lg hover:shadow-xl transition-all"
        >
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-gray-800 rounded-lg group-hover:bg-gray-700 transition">
              <MessageSquare className="h-6 w-6 text-blue-400" />
            </div>
            <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-white transition" />
          </div>
          <h3 className="text-lg font-bold mb-1">Novo Chat Seguro</h3>
          <p className="text-gray-400 text-sm">
            Inicie uma nova conversa protegida com LLM.
          </p>
        </Link>

        {/* Card 2: Fake Analytics (Para encher linguiça profissional) */}
        <div className="p-6 bg-white border rounded-xl shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-green-50 rounded-lg text-green-600">
              <BarChart3 className="h-6 w-6" />
            </div>
          </div>
          <h3 className="text-lg font-bold mb-1 text-gray-900">
            Uso de Tokens
          </h3>
          <p className="text-gray-500 text-sm mb-4">
            Consumo mensal da equipe.
          </p>
          <div className="flex items-end gap-2">
            <span className="text-2xl font-bold text-gray-900">12.4k</span>
            <span className="text-xs text-green-600 font-medium mb-1">
              +12%
            </span>
          </div>
        </div>

        {/* Card 3: Fake Equipe */}
        <div className="p-6 bg-white border rounded-xl shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-purple-50 rounded-lg text-purple-600">
              <Users className="h-6 w-6" />
            </div>
          </div>
          <h3 className="text-lg font-bold mb-1 text-gray-900">
            Membros Ativos
          </h3>
          <p className="text-gray-500 text-sm mb-4">
            Colaboradores no workspace.
          </p>
          <div className="flex items-center -space-x-2">
            <div className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-xs font-bold">
              JD
            </div>
            <div className="w-8 h-8 rounded-full bg-gray-300 border-2 border-white flex items-center justify-center text-xs font-bold">
              AM
            </div>
            <div className="w-8 h-8 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center text-xs text-gray-500">
              +3
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

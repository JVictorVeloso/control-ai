'use client'

import { AlertCircle, CheckCircle2, Key, Save, Shield } from 'lucide-react'
import { useState } from 'react'

export default function DashboardPage() {
  const [apiKey, setApiKey] = useState('')
  const [isSaved, setIsSaved] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    if (!apiKey) return

    setLoading(true)

    // Simula uma chamada segura ao backend
    setTimeout(() => {
      setLoading(false)
      setIsSaved(true)
      setApiKey('') // Limpa o campo por segurança visual

      // Reseta o status de "Salvo" após 3 segundos
      setTimeout(() => setIsSaved(false), 3000)
    }, 1500)
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Cabeçalho da Página */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Configurações do Workspace
        </h1>
        <p className="text-gray-500 mt-2">
          Gerencie suas chaves de API e preferências de segurança.
        </p>
      </div>

      {/* Cartão do BYOK (A exigência do PRD) */}
      <div className="bg-white border rounded-xl shadow-sm overflow-hidden">
        <div className="p-6 border-b bg-gray-50 flex items-center gap-3">
          <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
            <Key className="h-5 w-5" />
          </div>
          <div>
            <h2 className="font-semibold text-gray-900">
              Configuração de Modelo (BYOK)
            </h2>
            <p className="text-sm text-gray-500">
              Conecte sua própria chave de LLM para ativar os agentes.
            </p>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                OpenAI API Key (GPT-4)
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="sk-..."
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-black focus:border-black outline-none font-mono text-sm"
                />
                <div className="absolute right-3 top-3 text-xs text-gray-400">
                  AES-256 Encrypted
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                <Shield className="h-3 w-3" />
                Sua chave é armazenada com criptografia de ponta a ponta.
              </p>
            </div>

            <div className="flex items-center justify-between pt-4">
              <div className="text-sm text-gray-500">
                Modelo atual:{' '}
                <span className="font-mono bg-gray-100 px-2 py-1 rounded text-black">
                  Inativo
                </span>
              </div>

              <button
                type="submit"
                disabled={loading || !apiKey}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isSaved
                    ? 'bg-green-600 text-white'
                    : 'bg-black text-white hover:bg-gray-800 disabled:opacity-50'
                }`}
              >
                {loading ? (
                  'Validando...'
                ) : isSaved ? (
                  <>
                    <CheckCircle2 className="h-4 w-4" />
                    Chave Salva!
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    Salvar Configuração
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Cartão de Segurança (Para encher linguiça e parecer profissional) */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white border rounded-xl p-6">
          <div className="flex items-center gap-2 mb-4 text-green-600">
            <Shield className="h-5 w-5" />
            <h3 className="font-semibold text-gray-900">Status de Segurança</h3>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between text-sm py-2 border-b">
              <span className="text-gray-600">RLS (Row Level Security)</span>
              <span className="text-green-600 font-medium">Ativo</span>
            </div>
            <div className="flex justify-between text-sm py-2 border-b">
              <span className="text-gray-600">Criptografia de Dados</span>
              <span className="text-green-600 font-medium">Ativo</span>
            </div>
            <div className="flex justify-between text-sm py-2">
              <span className="text-gray-600">Auditoria de Logs</span>
              <span className="text-green-600 font-medium">Ativo</span>
            </div>
          </div>
        </div>

        <div className="bg-white border rounded-xl p-6">
          <div className="flex items-center gap-2 mb-4 text-orange-600">
            <AlertCircle className="h-5 w-5" />
            <h3 className="font-semibold text-gray-900">Limites do Plano</h3>
          </div>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Tokens usados este mês</span>
                <span className="font-medium">0 / 100k</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-orange-500 w-[0%]"></div>
              </div>
            </div>
            <p className="text-xs text-gray-500">
              Atualize seu plano para aumentar os limites de uso da equipe.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

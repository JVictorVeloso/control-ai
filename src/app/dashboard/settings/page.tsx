'use client'

import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
import {
  AlertCircle,
  CheckCircle2,
  Eye,
  EyeOff,
  Key,
  Loader2,
  Save,
  Shield,
  Trash2,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { clearApiKey, getApiKey, saveApiKey } from './actions'

export default function SettingsPage() {
  const { toast } = useToast()
  const [currentApiKey, setCurrentApiKey] = useState<string | null>(null)
  const [apiKeyInput, setApiKeyInput] = useState('')
  const [showKey, setShowKey] = useState(false)
  const [isSaved, setIsSaved] = useState(false)
  const [loading, setLoading] = useState(false)
  const [loadingKey, setLoadingKey] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadCurrentApiKey = async () => {
    setLoadingKey(true)
    const result = await getApiKey()
    if (result.error) {
      setError(result.error)
    } else if (result.data) {
      setCurrentApiKey(result.data.maskedKey)
    }
    setLoadingKey(false)
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadCurrentApiKey()
  }, [])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!apiKeyInput) return

    setLoading(true)
    setError(null)

    const formData = new FormData()
    formData.append('api_key', apiKeyInput)

    const result = await saveApiKey(formData)

    if (result.error) {
      setError(result.error)
      toast({
        title: 'Erro ao salvar API Key',
        description: result.error,
        variant: 'destructive',
      })
    } else {
      setIsSaved(true)
      setApiKeyInput('')
      await loadCurrentApiKey()
      toast({
        title: 'API Key salva!',
        description: 'Sua chave foi armazenada com segurança.',
        variant: 'success',
      })

      setTimeout(() => setIsSaved(false), 3000)
    }

    setLoading(false)
  }

  const handleClear = async () => {
    if (
      !confirm(
        'Deseja realmente remover a API Key? Isso desativará o chat com IA.'
      )
    )
      return

    setError(null)
    setLoading(true)
    const result = await clearApiKey()

    if (result.error) {
      setError(result.error)
      toast({
        title: 'Erro ao remover API Key',
        description: result.error,
        variant: 'destructive',
      })
    } else {
      setCurrentApiKey(null)
      await loadCurrentApiKey()
      toast({
        title: 'API Key removida!',
        description: 'A chave foi removida com sucesso.',
        variant: 'success',
      })
    }
    setLoading(false)
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Cabeçalho da Página */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
          Configurações do Workspace
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm md:text-base">
          Gerencie sua chave de API e preferências de segurança.
        </p>
      </div>

      {/* Alerta de erro */}
      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-lg flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-medium text-red-900 dark:text-red-200">
              Erro
            </p>
            <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setError(null)}
            className="text-red-600 hover:text-red-700"
          >
            Fechar
          </Button>
        </div>
      )}

      {/* Cartão do BYOK */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-zinc-200 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-800/50 flex items-center gap-3">
          <div className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg">
            <Key className="h-5 w-5" />
          </div>
          <div>
            <h2 className="font-semibold text-gray-900 dark:text-white">
              Configuração de Modelo (BYOK)
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Conecte sua própria chave de LLM para ativar os agentes.
            </p>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {loadingKey ? (
            <div className="flex items-center justify-center p-8">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <>
              {/* Chave Atual */}
              {currentApiKey && (
                <div className="bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-lg p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
                        <p className="font-medium text-green-900 dark:text-green-200">
                          API Key Configurada
                        </p>
                      </div>
                      <p className="text-sm font-mono text-green-700 dark:text-green-300">
                        {currentApiKey.substring(0, 20)}...
                      </p>
                      <p className="text-xs text-green-600 dark:text-green-400 mt-2 flex items-center gap-1">
                        <Shield className="h-3 w-3" />
                        Sua chave está armazenada com segurança
                      </p>
                    </div>
                    <button
                      onClick={handleClear}
                      disabled={loading}
                      className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition-colors disabled:opacity-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* Formulário */}
              <form onSubmit={handleSave} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {currentApiKey ? 'Atualizar API Key' : 'Nova API Key'}
                  </label>
                  <div className="relative">
                    <input
                      type={showKey ? 'text' : 'password'}
                      value={apiKeyInput}
                      onChange={(e) => setApiKeyInput(e.target.value)}
                      placeholder="sk-proj-..."
                      className="w-full p-3 pr-10 border border-zinc-200 dark:border-zinc-700 dark:bg-zinc-800 rounded-lg focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-black dark:focus:border-white outline-none font-mono text-sm"
                      disabled={loading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowKey(!showKey)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    >
                      {showKey ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 flex items-center gap-1">
                    <Shield className="h-3 w-3" />
                    Suporta: Google Gemini (gemini-2.5-flash) - Grátis ✨
                  </p>
                </div>

                <div className="flex items-center justify-end pt-4">
                  <button
                    type="submit"
                    disabled={loading || !apiKeyInput}
                    className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-medium transition-all disabled:opacity-50 ${
                      isSaved
                        ? 'bg-green-600 text-white'
                        : 'bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200'
                    }`}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Salvando...
                      </>
                    ) : isSaved ? (
                      <>
                        <CheckCircle2 className="h-4 w-4" />
                        Chave Salva!
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4" />
                        {currentApiKey
                          ? 'Atualizar Chave'
                          : 'Salvar Configuração'}
                      </>
                    )}
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>

      {/* Cartões informativos */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6">
          <div className="flex items-center gap-2 mb-4 text-green-600 dark:text-green-400">
            <Shield className="h-5 w-5" />
            <h3 className="font-semibold text-gray-900 dark:text-white">
              Status de Segurança
            </h3>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between text-sm py-2 border-b border-zinc-200 dark:border-zinc-800">
              <span className="text-gray-600 dark:text-gray-400">
                RLS (Row Level Security)
              </span>
              <span className="text-green-600 dark:text-green-400 font-medium">
                Ativo
              </span>
            </div>
            <div className="flex justify-between text-sm py-2 border-b border-zinc-200 dark:border-zinc-800">
              <span className="text-gray-600 dark:text-gray-400">
                Criptografia de Dados
              </span>
              <span className="text-green-600 dark:text-green-400 font-medium">
                Ativo
              </span>
            </div>
            <div className="flex justify-between text-sm py-2">
              <span className="text-gray-600 dark:text-gray-400">
                Auditoria de Logs
              </span>
              <span className="text-green-600 dark:text-green-400 font-medium">
                Ativo
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6">
          <div className="flex items-center gap-2 mb-4 text-blue-600 dark:text-blue-400">
            <Key className="h-5 w-5" />
            <h3 className="font-semibold text-gray-900 dark:text-white">
              Status da Configuração
            </h3>
          </div>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600 dark:text-gray-400">
                  API Key
                </span>
                <span
                  className={`font-medium ${
                    currentApiKey
                      ? 'text-green-600 dark:text-green-400'
                      : 'text-orange-600 dark:text-orange-400'
                  }`}
                >
                  {currentApiKey ? 'Configurada' : 'Não configurada'}
                </span>
              </div>
              <div className="h-2 bg-gray-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                <div
                  className={`h-full ${
                    currentApiKey ? 'bg-green-500 w-full' : 'bg-orange-500 w-0'
                  }`}
                ></div>
              </div>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {currentApiKey
                ? 'Sistema configurado e pronto para uso'
                : 'Configure uma API Key para começar a usar o chat com IA'}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

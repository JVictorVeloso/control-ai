'use client'

import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
import { Loader2, Shield, User } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { setupUserRole } from './actions'

export default function SetupPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)

  const handleSelectRole = async () => {
    setLoading(true)

    const result = await setupUserRole('admin_tenant')

    if (result.error) {
      toast({
        title: 'Erro ao configurar role',
        description: result.error,
        variant: 'destructive',
      })
      setLoading(false)
    } else {
      toast({
        title: 'Role configurado com sucesso!',
        description: 'Redirecionando para seu dashboard...',
        variant: 'success',
      })

      // Redirecionar para o dashboard do admin tenant
      setTimeout(() => {
        router.push('/admin/tenant')
        router.refresh()
      }, 1000)
    }
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-linear-to-br from-blue-600 to-purple-600 rounded-2xl mb-6">
            <User className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Configuração Inicial
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Escolha seu tipo de conta para começar a usar a plataforma
          </p>
        </div>

        <div className="grid md:grid-cols-1 max-w-lg mx-auto gap-6">
          {/* Card Admin Tenant */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl border-2 border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500 transition-all p-8 hover:shadow-2xl">
            <div className="flex flex-col h-full">
              <div className="inline-flex items-center justify-center w-14 h-14 bg-linear-to-br from-blue-600 to-blue-700 rounded-xl mb-6">
                <Shield className="w-7 h-7 text-white" />
              </div>

              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                Admin da Empresa
              </h2>

              <p className="text-gray-600 dark:text-gray-400 mb-6 grow">
                Administrador da sua empresa com controle total sobre sua equipe
                e configurações.
              </p>

              <div className="space-y-3 mb-8">
                <div className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2"></div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Gerenciar membros da sua empresa
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2"></div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Convidar Admins e Colaboradores
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2"></div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Configurar API keys e integrações
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2"></div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Visualizar métricas da empresa
                  </p>
                </div>
              </div>

              <Button
                onClick={() => handleSelectRole()}
                disabled={loading}
                className="w-full bg-linear-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white gap-2"
                size="lg"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Shield className="w-5 h-5" />
                )}
                Configurar como Admin
              </Button>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            💡 Você poderá alterar isso posteriormente se necessário
          </p>
        </div>
      </div>
    </div>
  )
}

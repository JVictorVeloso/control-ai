'use client'

import { Logo } from '@/components/brand/logo'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { AlertCircle, Mail, Sparkles } from 'lucide-react'
import { useState } from 'react'
import { login, signup } from '../login/actions'

export default function AuthPage() {
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (
    formData: FormData,
    action: 'login' | 'signup'
  ) => {
    setError(null)
    setLoading(true)

    try {
      const result =
        action === 'login' ? await login(formData) : await signup(formData)

      if (result?.error) {
        setError(result.error)
      }
    } catch {
      setError('Ocorreu um erro. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-zinc-950 dark:via-blue-950/20 dark:to-purple-950/20 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Logo size="lg" showText={true} />
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            Entre ou crie sua conta gratuitamente
          </p>
        </div>

        {/* Auth Card */}
        <Card className="shadow-2xl border-2">
          <CardHeader className="space-y-3 pb-6">
            <CardTitle className="text-2xl font-bold text-center bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Acesse sua Conta
            </CardTitle>
            <CardDescription className="text-center">
              Comece a usar IA com segurança em minutos
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="signup" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="signup">Cadastrar</TabsTrigger>
                <TabsTrigger value="login">Entrar</TabsTrigger>
              </TabsList>

              <TabsContent value="signup">
                <form
                  action={async (formData) => handleSubmit(formData, 'signup')}
                  className="space-y-4"
                >
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email</Label>
                    <Input
                      id="signup-email"
                      name="email"
                      type="email"
                      placeholder="seu@email.com"
                      required
                      disabled={loading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Senha</Label>
                    <Input
                      id="signup-password"
                      name="password"
                      type="password"
                      placeholder="••••••••"
                      required
                      minLength={6}
                      disabled={loading}
                    />
                  </div>
                  {error && (
                    <div className="flex items-start gap-2 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-lg p-3">
                      <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
                      <span>{error}</span>
                    </div>
                  )}
                  <Button
                    type="submit"
                    className="w-full bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                        Cadastrando...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 mr-2" />
                        Criar Conta Gratuita
                      </>
                    )}
                  </Button>
                  <div className="flex items-start gap-2 text-xs text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
                    <Mail className="h-4 w-4 shrink-0" />
                    <span>
                      Ao se cadastrar, você receberá um email de confirmação
                    </span>
                  </div>
                </form>
              </TabsContent>

              <TabsContent value="login">
                <form
                  action={async (formData) => handleSubmit(formData, 'login')}
                  className="space-y-4"
                >
                  <div className="space-y-2">
                    <Label htmlFor="login-email">Email</Label>
                    <Input
                      id="login-email"
                      name="email"
                      type="email"
                      placeholder="seu@email.com"
                      required
                      disabled={loading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="login-password">Senha</Label>
                    <Input
                      id="login-password"
                      name="password"
                      type="password"
                      placeholder="••••••••"
                      required
                      disabled={loading}
                    />
                  </div>
                  {error && (
                    <div className="flex items-start gap-2 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-lg p-3">
                      <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
                      <span>{error}</span>
                    </div>
                  )}
                  <Button
                    type="submit"
                    className="w-full bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                        Entrando...
                      </>
                    ) : (
                      <>
                        <Mail className="w-4 h-4 mr-2" />
                        Entrar
                      </>
                    )}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>

            {/* Back to landing */}
            <div className="mt-6 pt-6 border-t text-center">
              <a
                href="/login"
                className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition"
              >
                ← Voltar para a página inicial
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

'use client'

import { createWorkspace } from '@/app/dashboard/actions'
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
import { useState } from 'react'

interface OnboardingCardProps {
  userEmail: string
}

export default function OnboardingCard({ userEmail }: OnboardingCardProps) {
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (formData: FormData) => {
    setError(null)
    setLoading(true)

    try {
      const result = await createWorkspace(formData)

      if (result?.error) {
        setError(result.error)
        setLoading(false)
      }
    } catch (err) {
      setError('Ocorreu um erro ao criar o workspace.')
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-zinc-50 to-zinc-100 dark:from-zinc-950 dark:to-zinc-900 p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            Bem-vindo ao Control AI!
          </CardTitle>
          <CardDescription className="text-center">
            Você está logado como {userEmail}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="empresa_nome">Nome da sua Empresa</Label>
              <Input
                id="empresa_nome"
                name="empresa_nome"
                type="text"
                placeholder="Ex: Minha Empresa Ltda"
                required
                disabled={loading}
                minLength={2}
              />
              <p className="text-xs text-muted-foreground">
                Este será o nome do seu workspace
              </p>
            </div>

            {error && (
              <div className="text-sm text-red-500 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-md p-3">
                {error}
              </div>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Criando Workspace...' : 'Criar Workspace'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

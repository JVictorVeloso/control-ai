'use client'

import { logout } from '@/app/dashboard/actions'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { User } from '@supabase/supabase-js'
import { Building2, LogOut, MessageSquare, Settings } from 'lucide-react'
import Link from 'next/link'

interface DashboardContentProps {
  user: User
  empresa: { id: string; nome: string } | null
}

export default function DashboardContent({
  user,
  empresa,
}: DashboardContentProps) {
  const userInitials =
    user.email?.split('@')[0].substring(0, 2).toUpperCase() || 'US'

  const handleLogout = async () => {
    await logout()
  }

  return (
    <div className="flex h-screen bg-zinc-50 dark:bg-zinc-950">
      {/* Sidebar */}
      <aside className="w-64 border-r border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex flex-col">
        {/* Header da Sidebar */}
        <div className="p-6">
          <div className="flex items-center gap-2 mb-2">
            <Building2 className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-bold">Control AI</h1>
          </div>
          {empresa && (
            <p className="text-sm text-muted-foreground">{empresa.nome}</p>
          )}
        </div>

        <Separator />

        {/* Navegação */}
        <nav className="flex-1 p-4 space-y-2">
          <Link href="/dashboard/chat">
            <Button variant="ghost" className="w-full justify-start gap-2">
              <MessageSquare className="h-4 w-4" />
              Chat
            </Button>
          </Link>

          <Link href="/dashboard/settings">
            <Button variant="ghost" className="w-full justify-start gap-2">
              <Settings className="h-4 w-4" />
              Configurações
            </Button>
          </Link>
        </nav>

        <Separator />

        {/* Perfil e Logout */}
        <div className="p-4 space-y-2">
          <div className="flex items-center gap-3 p-2">
            <Avatar>
              <AvatarFallback>{userInitials}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user.email}</p>
            </div>
          </div>

          <form action={handleLogout}>
            <Button
              type="submit"
              variant="outline"
              className="w-full justify-start gap-2 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/30"
            >
              <LogOut className="h-4 w-4" />
              Sair
            </Button>
          </form>
        </div>
      </aside>

      {/* Conteúdo Principal */}
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold mb-2">Dashboard</h2>
            <p className="text-muted-foreground mb-8">
              Bem-vindo ao seu workspace! Use o menu lateral para navegar.
            </p>

            {/* Cards de exemplo */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="p-6 border border-zinc-200 dark:border-zinc-800 rounded-lg bg-white dark:bg-zinc-900">
                <MessageSquare className="h-8 w-8 text-primary mb-4" />
                <h3 className="font-semibold mb-2">Chat AI</h3>
                <p className="text-sm text-muted-foreground">
                  Converse com a inteligência artificial
                </p>
              </div>

              <div className="p-6 border border-zinc-200 dark:border-zinc-800 rounded-lg bg-white dark:bg-zinc-900">
                <Settings className="h-8 w-8 text-primary mb-4" />
                <h3 className="font-semibold mb-2">Configurações</h3>
                <p className="text-sm text-muted-foreground">
                  Personalize seu workspace
                </p>
              </div>

              <div className="p-6 border border-zinc-200 dark:border-zinc-800 rounded-lg bg-white dark:bg-zinc-900">
                <Building2 className="h-8 w-8 text-primary mb-4" />
                <h3 className="font-semibold mb-2">Empresa</h3>
                <p className="text-sm text-muted-foreground">
                  {empresa?.nome || 'Gerenciar empresa'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

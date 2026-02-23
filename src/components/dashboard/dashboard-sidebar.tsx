'use client'

import { signOut } from '@/app/login/actions'
import { Logo } from '@/components/brand/logo'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import {
  Activity,
  Bot,
  Building2,
  Home,
  LogOut,
  MessageSquare,
  Moon,
  Settings,
  Sun,
  Users,
} from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

interface DashboardSidebarProps {
  empresaNome: string
  userEmail: string
  userRole: string
}

export function DashboardSidebar({
  empresaNome,
  userEmail,
  userRole,
}: DashboardSidebarProps) {
  const pathname = usePathname()
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      return document.documentElement.classList.contains('dark')
    }
    return false
  })
  const userInitials = userEmail.split('@')[0].substring(0, 2).toUpperCase()

  // Toggle dark mode
  const toggleDarkMode = () => {
    const html = document.documentElement
    if (html.classList.contains('dark')) {
      html.classList.remove('dark')
      localStorage.setItem('theme', 'light')
      setIsDark(false)
    } else {
      html.classList.add('dark')
      localStorage.setItem('theme', 'dark')
      setIsDark(true)
    }
  }

  const navItems = [
    {
      href: '/dashboard',
      icon: Home,
      label: 'Início',
      description: 'Visão geral',
      roles: ['colaborador', 'admin_tenant', 'master'],
    },
    {
      href: '/dashboard/chat',
      icon: MessageSquare,
      label: 'Chat AI',
      description: 'Conversas com IA',
      roles: ['colaborador', 'admin_tenant', 'master'],
    },
    {
      href: '/dashboard/agents',
      icon: Bot,
      label: 'Agentes IA',
      description: 'Prompts personalizados',
      roles: ['admin_tenant', 'master'],
    },
    {
      href: '/dashboard/team',
      icon: Users,
      label: 'Equipe',
      description: 'Gerenciar membros',
      roles: ['admin_tenant', 'master'],
    },
    {
      href: '/dashboard/audit',
      icon: Activity,
      label: 'Auditoria',
      description: 'Logs & Compliance',
      roles: ['admin_tenant', 'master'],
    },
    {
      href: '/dashboard/company',
      icon: Building2,
      label: 'Empresa',
      description: 'Workspace',
      roles: ['admin_tenant', 'master'],
    },
    {
      href: '/dashboard/settings',
      icon: Settings,
      label: 'Configurações',
      description: 'API Keys & Ajustes',
      roles: ['admin_tenant', 'master'],
    },
  ]

  // Admin dashboards
  const adminNavItems = [
    {
      href: '/admin/tenant',
      icon: Building2,
      label: 'Admin Dashboard',
      description: 'Gestão da Empresa',
      roles: ['admin_tenant'],
    },
    {
      href: '/admin/master',
      icon: Activity,
      label: 'Master Dashboard',
      description: 'Gestão da Plataforma',
      roles: ['master'],
    },
  ]

  // Filtrar itens baseado no role
  const visibleNavItems = navItems.filter((item) =>
    item.roles.includes(userRole)
  )
  const visibleAdminItems = adminNavItems.filter((item) =>
    item.roles.includes(userRole)
  )

  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return pathname === '/dashboard'
    }
    return pathname?.startsWith(href)
  }

  return (
    <aside className="hidden md:flex w-72 flex-col border-r bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-800">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 dark:border-zinc-800">
        <div className="flex flex-col gap-3">
          <Logo size="md" showText={true} />
          <div className="flex items-center gap-2 px-2">
            <Building2 className="h-4 w-4 text-gray-400" />
            <p className="text-sm text-gray-600 dark:text-gray-400 truncate font-medium">
              {empresaNome}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-1">
        {/* Admin Dashboards (se houver) */}
        {visibleAdminItems.length > 0 && (
          <div className="mb-6">
            <p className="px-3 mb-2 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
              Dashboards
            </p>
            {visibleAdminItems.map((item) => {
              const Icon = item.icon
              const active = isActive(item.href)

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`
                    group flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all
                    ${
                      active
                        ? 'bg-purple-50 dark:bg-purple-950/30 text-purple-700 dark:text-purple-400 font-medium'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-800'
                    }
                  `}
                >
                  <Icon
                    className={`h-5 w-5 ${active ? 'text-purple-600 dark:text-purple-400' : 'text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300'}`}
                  />
                  <div className="flex-1 min-w-0">
                    <p
                      className={`text-sm truncate ${active ? 'font-semibold' : ''}`}
                    >
                      {item.label}
                    </p>
                    <p
                      className={`text-xs truncate ${active ? 'text-purple-600 dark:text-purple-400' : 'text-gray-500 dark:text-gray-400'}`}
                    >
                      {item.description}
                    </p>
                  </div>
                </Link>
              )
            })}
          </div>
        )}

        <div className="mb-6">
          <p className="px-3 mb-2 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
            Menu Principal
          </p>
          {visibleNavItems.map((item) => {
            const Icon = item.icon
            const active = isActive(item.href)

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`
                  group flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all
                  ${
                    active
                      ? 'bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-400 font-medium'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-800'
                  }
                `}
              >
                <Icon
                  className={`h-5 w-5 ${
                    active
                      ? 'text-blue-600 dark:text-blue-400'
                      : 'text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300'
                  }`}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{item.label}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    {item.description}
                  </p>
                </div>
              </Link>
            )
          })}
        </div>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 dark:border-zinc-800 space-y-3">
        {/* Dark Mode Toggle */}
        <button
          onClick={toggleDarkMode}
          className="flex items-center gap-3 px-3 py-2.5 w-full rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
        >
          {isDark ? (
            <Sun className="h-5 w-5 text-yellow-500" />
          ) : (
            <Moon className="h-5 w-5 text-gray-500" />
          )}
          <span className="text-sm font-medium">
            {isDark ? 'Modo Claro' : 'Modo Escuro'}
          </span>
        </button>

        <Separator />

        {/* User Info */}
        <div className="flex items-center gap-3 px-3 py-2">
          <Avatar className="h-10 w-10 bg-blue-600 text-white">
            <AvatarFallback className="bg-blue-600 text-white font-semibold">
              {userInitials}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
              {userEmail.split('@')[0]}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {userRole === 'master' && 'Master'}
              {userRole === 'admin_tenant' && 'Admin'}
              {userRole === 'colaborador' && 'Colaborador'}
            </p>
          </div>
        </div>

        {/* Logout Button */}
        <form action={signOut}>
          <Button
            type="submit"
            variant="ghost"
            className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/30"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sair do Sistema
          </Button>
        </form>
      </div>
    </aside>
  )
}

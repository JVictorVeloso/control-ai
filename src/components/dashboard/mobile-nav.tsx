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
  Menu,
  MessageSquare,
  Moon,
  Settings,
  Sun,
  Users,
  X,
} from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

interface MobileNavProps {
  empresaNome: string
  userEmail: string
  userRole: string
}

export function MobileNav({
  empresaNome,
  userEmail,
  userRole,
}: MobileNavProps) {
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    // Read initial theme from DOM
    const dark = document.documentElement.classList.contains('dark')
    if (dark !== isDark) {
      queueMicrotask(() => setIsDark(dark))
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Close menu on navigation
  useEffect(() => {
    if (menuOpen) {
      queueMicrotask(() => setMenuOpen(false))
    }
  }, [pathname]) // eslint-disable-line react-hooks/exhaustive-deps

  const userInitials = userEmail.split('@')[0].substring(0, 2).toUpperCase()

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

  const isActive = (href: string) => {
    if (href === '/dashboard') return pathname === '/dashboard'
    return pathname?.startsWith(href)
  }

  // Bottom bar items (max 5 for mobile)
  const bottomBarItems = [
    {
      href: '/dashboard',
      icon: Home,
      label: 'Início',
      roles: ['colaborador', 'admin_tenant', 'master'],
    },
    {
      href: '/dashboard/chat',
      icon: MessageSquare,
      label: 'Chat',
      roles: ['colaborador', 'admin_tenant', 'master'],
    },
    {
      href: '/dashboard/team',
      icon: Users,
      label: 'Equipe',
      roles: ['admin_tenant', 'master'],
    },
    {
      href: '/dashboard/audit',
      icon: Activity,
      label: 'Auditoria',
      roles: ['admin_tenant', 'master'],
    },
  ].filter((item) => item.roles.includes(userRole))

  // Full menu items
  const menuItems = [
    {
      href: '/dashboard',
      icon: Home,
      label: 'Início',
      roles: ['colaborador', 'admin_tenant', 'master'],
    },
    {
      href: '/dashboard/chat',
      icon: MessageSquare,
      label: 'Chat AI',
      roles: ['colaborador', 'admin_tenant', 'master'],
    },
    {
      href: '/dashboard/agents',
      icon: Bot,
      label: 'Agentes IA',
      roles: ['admin_tenant', 'master'],
    },
    {
      href: '/dashboard/team',
      icon: Users,
      label: 'Equipe',
      roles: ['admin_tenant', 'master'],
    },
    {
      href: '/dashboard/audit',
      icon: Activity,
      label: 'Auditoria',
      roles: ['admin_tenant', 'master'],
    },
    {
      href: '/dashboard/company',
      icon: Building2,
      label: 'Empresa',
      roles: ['admin_tenant', 'master'],
    },
    {
      href: '/dashboard/settings',
      icon: Settings,
      label: 'Configurações',
      roles: ['admin_tenant', 'master'],
    },
  ].filter((item) => item.roles.includes(userRole))

  return (
    <>
      {/* Mobile Top Header */}
      <header className="md:hidden flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
        <Logo size="sm" showText={true} />
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-30">
            {empresaNome}
          </span>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-800 transition"
          >
            {menuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </header>

      {/* Full-screen slide menu */}
      {menuOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-white dark:bg-zinc-900 flex flex-col">
          {/* Menu header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-zinc-800">
            <Logo size="sm" showText={true} />
            <button
              onClick={() => setMenuOpen(false)}
              className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-800 transition"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Menu items */}
          <nav className="flex-1 overflow-y-auto p-4 space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon
              const active = isActive(item.href)
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                    active
                      ? 'bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-400 font-semibold'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-800'
                  }`}
                >
                  <Icon
                    className={`h-5 w-5 ${active ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400'}`}
                  />
                  <span className="text-sm">{item.label}</span>
                </Link>
              )
            })}
          </nav>

          {/* Menu footer */}
          <div className="p-4 border-t border-gray-200 dark:border-zinc-800 space-y-3">
            <button
              onClick={toggleDarkMode}
              className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-800 transition"
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

            <div className="flex items-center gap-3 px-4 py-2">
              <Avatar className="h-9 w-9 bg-blue-600 text-white">
                <AvatarFallback className="bg-blue-600 text-white font-semibold text-sm">
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

            <form action={signOut}>
              <Button
                type="submit"
                variant="ghost"
                className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/30"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sair
              </Button>
            </form>
          </div>
        </div>
      )}

      {/* Bottom Tab Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white dark:bg-zinc-900 border-t border-gray-200 dark:border-zinc-800 px-2 pb-[env(safe-area-inset-bottom)]">
        <div className="flex items-center justify-around py-2">
          {bottomBarItems.map((item) => {
            const Icon = item.icon
            const active = isActive(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-lg transition-all min-w-15 ${
                  active
                    ? 'text-blue-600 dark:text-blue-400'
                    : 'text-gray-400 dark:text-gray-500'
                }`}
              >
                <Icon
                  className={`h-5 w-5 ${active ? 'text-blue-600 dark:text-blue-400' : ''}`}
                />
                <span className="text-[10px] font-medium">{item.label}</span>
              </Link>
            )
          })}
          {/* Menu (More) */}
          <button
            onClick={() => setMenuOpen(true)}
            className="flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-lg text-gray-400 dark:text-gray-500 min-w-15"
          >
            <Menu className="h-5 w-5" />
            <span className="text-[10px] font-medium">Menu</span>
          </button>
        </div>
      </nav>
    </>
  )
}

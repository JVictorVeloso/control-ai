import { DashboardSidebar } from '@/components/dashboard/dashboard-sidebar'
import { MobileNav } from '@/components/dashboard/mobile-nav'
import { Toaster } from '@/components/ui/toaster'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Buscar perfil do usuário
  const { data: perfil } = await supabase
    .from('perfis')
    .select('empresa_id, role')
    .eq('id', user.id)
    .single()

  // Buscar nome da empresa se existir
  let empresaNome = 'Enterprise'
  if (perfil?.empresa_id) {
    const { data: empresa } = await supabase
      .from('empresas')
      .select('nome')
      .eq('id', perfil.empresa_id)
      .single()

    empresaNome = empresa?.nome || 'Enterprise'
  }

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-50 dark:bg-zinc-950">
      {/* Desktop Sidebar */}
      <DashboardSidebar
        empresaNome={empresaNome}
        userEmail={user.email || ''}
        userRole={perfil?.role || 'colaborador'}
      />

      {/* Mobile Navigation (header + bottom bar + slide menu) */}
      <MobileNav
        empresaNome={empresaNome}
        userEmail={user.email || ''}
        userRole={perfil?.role || 'colaborador'}
      />

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto">
        <div className="p-4 md:p-8 pb-20 md:pb-8">{children}</div>
      </main>
      <Toaster />
    </div>
  )
}
